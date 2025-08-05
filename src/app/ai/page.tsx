'use client';

import { useOpenRouter } from '@/hooks/useOpenRouter';
import {
  Bot,
  Copy,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AIPage() {
  const [input, setInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: Date;
    }>
  >([]);
  const { isLoading, error, response, sendMessage } = useOpenRouter();

  // Predefined system instructions for Nexty (hidden from users)
  const systemInstructions = `You are Nexty, an intelligent AI assistant specifically designed for NextDentist.com - a comprehensive dental practice management platform. You are knowledgeable, professional, and friendly.

Your expertise includes:
- Dental procedures, treatments, and patient care
- Dental practice management and optimization
- Appointment scheduling and patient management
- Treatment planning and case documentation
- Dental technology and equipment
- Practice growth and patient acquisition strategies
- Dental billing, insurance, and financial management
- Staff training and practice efficiency

Always maintain a professional yet approachable tone. Provide accurate, helpful information while emphasizing that for specific medical advice, users should consult with qualified dental professionals. You represent NextDentist.com's commitment to excellence in dental care technology.

When appropriate, you can mention relevant features of NextDentist.com that might help solve their problems, but focus primarily on being genuinely helpful rather than promotional.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
      };

      setConversationHistory(prev => [...prev, userMessage]);

      // Always include system instructions with user input
      const fullPrompt = `${systemInstructions}\n\nUser: ${input}`;

      await sendMessage(fullPrompt);
      setInput('');
    }
  };

  // Add AI response to conversation history when available
  useEffect(() => {
    if (response && response.trim()) {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
      };
      setConversationHistory(prev => {
        // Avoid duplicate responses
        if (prev.length > 0 && prev[prev.length - 1].content === response) {
          return prev;
        }
        return [...prev, assistantMessage];
      });
    }
  }, [response]);

  const clearConversation = () => {
    setConversationHistory([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#356574] to-[#df9d7c]">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#356574]">Meet Nexty</h1>
          </div>
          <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">
            Your intelligent dental practice assistant powered by
            NextDentist.com
          </p>
          <p className="mt-2 text-sm text-[#92b5b9]">
            Get expert guidance on dental procedures, practice management, and
            patient care
          </p>
        </div>

        {/* Chat Interface */}
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-4xl border border-[#92b5b9]/20 bg-white shadow-lg">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#356574] to-[#df9d7c] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Nexty AI Assistant
                    </h3>
                    <p className="text-sm text-white/80">
                      Dental expertise at your fingertips • NextDentist.com
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearConversation}
                  className="rounded-full p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  title="Clear conversation"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[500px] space-y-6 overflow-y-auto p-6">
              {conversationHistory.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#356574]/10 to-[#df9d7c]/10">
                    <Bot className="h-10 w-10 text-[#356574]" />
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-[#356574]">
                    Hello! I'm Nexty 👋
                  </h3>
                  <p className="mx-auto mb-6 max-w-lg leading-relaxed text-[#92b5b9]">
                    I'm your AI assistant specializing in dental practice
                    management and patient care. Ask me anything about dental
                    procedures, practice optimization, or patient management!
                  </p>
                  <div className="mx-auto grid max-w-2xl gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-[#F4F8F8] p-4 text-left">
                      <div className="mb-1 font-medium text-[#356574]">
                        💡 Practice Management
                      </div>
                      <div className="text-[#92b5b9]">
                        Optimize appointments, billing, and workflows
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F4F8F8] p-4 text-left">
                      <div className="mb-1 font-medium text-[#356574]">
                        🦷 Clinical Support
                      </div>
                      <div className="text-[#92b5b9]">
                        Treatment planning and procedure guidance
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F4F8F8] p-4 text-left">
                      <div className="mb-1 font-medium text-[#356574]">
                        📊 Business Growth
                      </div>
                      <div className="text-[#92b5b9]">
                        Patient acquisition and retention strategies
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F4F8F8] p-4 text-left">
                      <div className="mb-1 font-medium text-[#356574]">
                        💼 Technology
                      </div>
                      <div className="text-[#92b5b9]">
                        Digital dentistry and practice software
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                conversationHistory.map(message => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[85%] gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          message.role === 'user'
                            ? 'bg-[#356574]'
                            : 'bg-gradient-to-br from-[#df9d7c] to-[#356574]'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-[#356574] text-white'
                            : 'border border-[#92b5b9]/10 bg-[#F4F8F8] text-gray-800'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                          <span
                            className={`text-xs ${
                              message.role === 'user'
                                ? 'text-white/70'
                                : 'text-[#92b5b9]'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className={`ml-3 rounded-lg p-1.5 transition-colors hover:bg-white/10 ${
                              message.role === 'user'
                                ? 'text-white/70 hover:text-white'
                                : 'text-[#92b5b9] hover:text-[#356574]'
                            }`}
                            title="Copy message"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#df9d7c] to-[#356574]">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="rounded-2xl border border-[#92b5b9]/10 bg-[#F4F8F8] p-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-[#356574]" />
                      <span className="text-[#92b5b9]">
                        Nexty is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-[#92b5b9]/20 bg-white p-6"
            >
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  <strong>Oops!</strong> {error}
                </div>
              )}

              <div className="flex gap-4">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 resize-none rounded-2xl border border-[#92b5b9]/20 p-4 text-gray-800 placeholder-[#92b5b9] focus:border-transparent focus:ring-2 focus:ring-[#df9d7c]"
                  rows={3}
                  placeholder="Ask Nexty about dental procedures, practice management, or patient care..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#356574] to-[#df9d7c] px-8 py-4 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-[#92b5b9]">
                Press Enter to send • Shift+Enter for new line • Powered by
                NextDentist.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
