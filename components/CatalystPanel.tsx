'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { useCatalyst, ChatMessage } from '@/lib/CatalystContext';
import { useAppContext } from '@/lib/AppContext';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

const QUICK_ACTIONS = [
  { label: 'How are we performing?', prompt: 'Give me a quick overview of how we are performing this week' },
  { label: 'SKUs needing attention', prompt: 'Which SKUs need my attention right now?' },
  { label: 'Slow movers', prompt: 'Show me slow-moving SKUs in my category' },
  { label: 'Engine signals', prompt: 'What engine recommendations are pending?' },
];

export function CatalystPanel() {
  const { theme } = useTheme();
  const { state, addMessage, updateMessage, setLoading } = useCatalyst();
  const { state: appState } = useAppContext();
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

    // Create placeholder for assistant message
    const assistantMsgId = addMessage({ role: 'assistant', content: '', isStreaming: true });

    try {
      // Build messages for API
      const apiMessages = state.messages
        .filter(m => m.content) // Only include messages with content
        .map(m => ({ role: m.role, content: m.content }));

      // Add the new user message
      apiMessages.push({ role: 'user', content: userMessage });

      // Call API with streaming
      const response = await fetch('/api/catalyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context: {
            entity: appState.entity,
            category: appState.categoryL0,
            dateRange: appState.dateRange,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'text') {
                  fullContent += data.text;
                  updateMessage(assistantMsgId, { content: fullContent });
                } else if (data.type === 'tool_start') {
                  updateMessage(assistantMsgId, {
                    toolUse: { name: data.name, input: {} },
                  });
                } else if (data.type === 'tool_result') {
                  updateMessage(assistantMsgId, {
                    toolUse: {
                      name: data.name,
                      input: {},
                      result: data.result,
                    },
                  });
                } else if (data.type === 'error') {
                  updateMessage(assistantMsgId, {
                    content: `Error: ${data.message}`,
                    isStreaming: false,
                  });
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      updateMessage(assistantMsgId, { isStreaming: false });
    } catch (error) {
      console.error('Failed to send message:', error);
      updateMessage(assistantMsgId, {
        content: 'Sorry, I encountered an error. Please try again.',
        isStreaming: false,
      });
    } finally {
      setLoading(false);
    }
  }, [state.messages, state.isLoading, appState, addMessage, updateMessage, setLoading]);

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