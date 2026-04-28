import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CATALYST_TOOLS, executeTool } from '@/lib/catalyst-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Cat-alyst, an AI assistant for Delivery Hero category managers using the Category Management Cockpit. You help monitor performance, analyze data, and execute actions.

Your capabilities:
- Monitor KPIs: Query GMV, orders, SKU counts, and performance trends
- Search & Analyze: Find SKUs by status, category, supplier, or efficiency
- Execute Actions: Update SKU statuses (with user confirmation for destructive actions)
- Explain & Recommend: Provide insights and recommendations

Guidelines:
1. Be concise and action-oriented. Use bullet points for lists.
2. Use tools to fetch real data - don't make up numbers.
3. When suggesting actions, ask for confirmation before executing destructive operations.
4. Format numbers with commas (e.g., 1,234,567) and include units (AED, %, units).
5. If you don't know something or can't find it, say so honestly.

Current context will be provided with each request.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body;

    // Build the messages for Claude
    const claudeMessages: Anthropic.Messages.MessageParam[] = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    );

    // Add context to the first message if provided
    const contextPrompt = context
      ? `\n\nCurrent context:\n- Entity: ${context.entity || 'Talabat UAE'}\n- Category: ${context.category || 'All Categories'}\n- Date range: ${context.dateRange || 'Last 7 days'}`
      : '';

    // Create a streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT + contextPrompt,
      messages: claudeMessages,
      tools: CATALYST_TOOLS.map(tool => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.input_schema,
      })),
    });

    // Set up SSE response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            // Handle different event types
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if (delta.type === 'text_delta') {
                const data = JSON.stringify({
                  type: 'text',
                  text: delta.text,
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            } else if (event.type === 'content_block_start') {
              const block = event.content_block;
              if (block.type === 'tool_use') {
                const data = JSON.stringify({
                  type: 'tool_start',
                  name: block.name,
                  id: block.id,
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            } else if (event.type === 'content_block_stop') {
              const data = JSON.stringify({ type: 'block_stop' });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // Get the final message to handle tool use
          const finalMessage = await stream.finalMessage();

          // Check if there are tool use blocks
          for (const block of finalMessage.content) {
            if (block.type === 'tool_use') {
              const toolResult = executeTool(block.name, block.input as Record<string, unknown>);

              const data = JSON.stringify({
                type: 'tool_result',
                name: block.name,
                id: block.id,
                result: toolResult.result,
                error: toolResult.error,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // Send completion signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}