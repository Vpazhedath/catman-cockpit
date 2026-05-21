'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { useCatalyst, ChatMessage } from '@/lib/CatalystContext';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

const QUICK_ACTIONS = [
  { label: 'How are we performing?', prompt: 'Give me a quick overview of how we are performing this week' },
  { label: 'SKUs needing attention', prompt: 'Which SKUs need my attention right now?' },
  { label: 'Slow movers', prompt: 'Show me slow-moving SKUs in my category' },
  { label: 'Engine signals', prompt: 'What engine recommendations are pending?' },
];

// Mock responses for placeholder mode
const MOCK_RESPONSES: Record<string, string> = {
  'performance': `📊 **Performance Overview**

Here's how you're doing this week:

• **GMV**: AED 124M (+6.7% vs last week)
• **Orders**: 1.68M (+6.2%)
• **Items Sold**: 12.3M (+8.2%)
• **Active Stores**: 45

📈 **Top Categories:**
1. Beverages - AED 38M
2. Dairy & Eggs - AED 28M
3. Snacks - AED 18M

💡 *Tip: Your Beverages category is outperforming others by 35%*`,
  'attention': `⚠️ **SKUs Needing Attention**

I found **7 SKUs** that need your attention:

**On-Hold (3):**
• Organic Almond Milk 1L - 72% availability
• Premium Saffron 1g - 65% availability
• Imported Olive Oil 500ml - 78% availability

**Slow Movers (2):**
• Head & Shoulders Shampoo 400ml - 320 units/week
• Generic Soap Bar - 5 units/week

**Engine Signals (2):**
• Almarai Greek Yogurt 400g - Lifecycle review
• Mountain Dew 500ml - Profitability opportunity

Would you like me to take action on any of these?`,
  'slow': `🐌 **Slow-Moving SKUs**

Found **5 slow movers** in your category:

| SKU | Units/Week | Availability | Margin |
|-----|-----------|--------------|--------|
| Organic Almond Milk 1L | 45 | 72% | 30% |
| Premium Saffron 1g | 12 | 65% | 30% |
| Imported Olive Oil 500ml | 85 | 78% | 30% |
| Head & Shoulders 400ml | 320 | 82% | 35% |
| Generic Soap Bar | 5 | 28% | 30% |

💡 **Recommendation:** Consider putting items with <50 units/week on hold or clearance.

Shall I prepare a bulk status change?`,
  'engine': `🔧 **Engine Recommendations**

**Choice Engine** (2 pending):
• Add Sadia Choc Milk 200ml - 91% confidence
• Add Oat milk 1L - 85% confidence

**Lifecycle Engine** (3 pending):
• Review Almarai Greek Yogurt 400g
• Review Kinder Chocolate 100g
• Review Tide Detergent 2kg

**Affordability Engine** (2 pending):
• Lacnor Orange Juice 1L - Price match opportunity
• Imported Olive Oil 500ml - Competitor price gap

**Profitability Engine** (1 pending):
• Red Bull 250ml - Margin optimization

Would you like details on any specific recommendation?`,
  'default': `I'm Cat-alyst, your AI category assistant! 🚀

I can help you:
• **Monitor** - Check KPIs, trends, and performance
• **Analyze** - Find slow movers, gaps, opportunities
• **Execute** - Update SKU statuses, manage clusters
• **Recommend** - Get insights from engine signals

Try asking me something like:
- "How are we performing?"
- "Show me slow movers in Dairy"
- "Which SKUs need attention?"`,
};

// Simple keyword matching for mock responses
function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('perform') || lower.includes('overview') || lower.includes('how are we') || lower.includes('kpi')) {
    return MOCK_RESPONSES.performance;
  }
  if (lower.includes('attention') || lower.includes('need') || lower.includes('alert')) {
    return MOCK_RESPONSES.attention;
  }
  if (lower.includes('slow') || lower.includes('mover') || lower.includes('zero')) {
    return MOCK_RESPONSES.slow;
  }
  if (lower.includes('engine') || lower.includes('recommendation') || lower.includes('signal')) {
    return MOCK_RESPONSES.engine;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 I'm Cat-alyst, your AI category assistant. How can I help you today?";
  }
  if (lower.includes('thank')) {
    return "You're welcome! Let me know if you need anything else. 🙌";
  }
  if (lower.includes('help') || lower.includes('can you do')) {
    return MOCK_RESPONSES.default;
  }

  // Default response with tool execution preview
  return `I understand you're asking about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}".

Let me fetch that information for you...

*(In full mode, I would use the **search_skus** and **get_kpis** tools to give you real-time data. Currently running in demo mode with sample data.)*

${MOCK_RESPONSES.default}`;
}

export function CatalystPanel() {
  const { theme } = useTheme();
  const { state, addMessage, updateMessage, setLoading } = useCatalyst();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = theme === 'dark';
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (state.isOpen) {
      inputRef.current?.focus();
    }
  }, [state.isOpen]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || state.isLoading) return;

    const userMessage = messageText.trim();
    setInput('');

    // Add user message
    addMessage({ role: 'user', content: userMessage });
    setLoading(true);

    // Create placeholder for assistant message with streaming simulation
    const assistantMsgId = addMessage({ role: 'assistant', content: '', isStreaming: true });

    // Simulate streaming with mock response
    const mockResponse = getMockResponse(userMessage);

    // Simulate typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < mockResponse.length) {
        currentIndex += Math.floor(Math.random() * 5) + 3; // Random chunk size
        const partialContent = mockResponse.slice(0, Math.min(currentIndex, mockResponse.length));
        updateMessage(assistantMsgId, { content: partialContent });
      } else {
        clearInterval(typingInterval);
        updateMessage(assistantMsgId, { content: mockResponse, isStreaming: false });
        setLoading(false);
      }
    }, 30);

  }, [state.isLoading, addMessage, updateMessage, setLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      style={{
        width: 400,
        height: '100%',
        background: surfPrimary,
        borderLeft: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #4629FF 0%, #6635B6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div>
          <div style={{ font: `700 15px/1.2 ${font}`, color: fg1 }}>Cat-alyst</div>
          <div style={{ font: `500 11px/1.2 ${font}`, color: fg3 }}>AI Category Assistant</div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {state.messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: t ? 'rgba(70,41,255,0.15)' : '#EDEBFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4629FF" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div style={{ font: `600 14px/1.4 ${font}`, color: fg1, marginBottom: 8 }}>
              Hello! I&apos;m Cat-alyst
            </div>
            <div style={{ font: `500 13px/1.5 ${font}`, color: fg2, marginBottom: 20 }}>
              I can help you monitor performance, analyze SKUs, and execute actions. Try asking:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action.prompt)}
                  style={{
                    background: surfSecondary,
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    font: `500 12px/1.3 ${font}`,
                    color: fg1,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 150ms',
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          state.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isDark={t} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: 16,
          borderTop: `1px solid ${border}`,
          background: surfPrimary,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about SKUs, performance, or actions..."
            disabled={state.isLoading}
            style={{
              flex: 1,
              padding: '12px 14px',
              border: `1px solid ${border}`,
              borderRadius: 10,
              background: surfSecondary,
              color: fg1,
              font: `500 13px/1.4 ${font}`,
              outline: 'none',
              opacity: state.isLoading ? 0.7 : 1,
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || state.isLoading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: 0,
              background: input.trim() && !state.isLoading ? '#4629FF' : surfSecondary,
              cursor: input.trim() && !state.isLoading ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 150ms',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={input.trim() && !state.isLoading ? '#fff' : fg3}
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isDark }: { message: ChatMessage; isDark: boolean }) {
  const t = isDark;
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const surfSecondary = t ? '#343437' : '#F4F5F6';

  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '10px 14px',
          borderRadius: 12,
          background: isUser ? '#4629FF' : surfSecondary,
          color: isUser ? '#fff' : fg1,
          font: `500 13px/1.5 ${font}`,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content || (message.isStreaming && '...')}
        {message.toolUse && (
          <div
            style={{
              marginTop: 8,
              padding: '8px 10px',
              borderRadius: 6,
              background: t ? 'rgba(70,41,255,0.15)' : '#EDEBFF',
              fontSize: 11,
            }}
          >
            <div style={{ font: `600 11px/1 ${font}`, color: '#4629FF', marginBottom: 4 }}>
              🔧 {message.toolUse.name.replace(/_/g, ' ')}
            </div>
            {message.toolUse.result ? (
              <div style={{ font: `500 10px/1.4 ${font}`, color: fg2, marginTop: 4 }}>
                {JSON.stringify(message.toolUse.result as object, null, 2).slice(0, 200) + '...'}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}