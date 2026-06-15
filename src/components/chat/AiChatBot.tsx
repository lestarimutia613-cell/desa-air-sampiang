'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send, X, Bot, User, Loader2, Sparkles, RotateCcw, Minus } from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const quickReplies = [
  { label: 'Layanan Desa', value: 'Apa saja layanan desa yang tersedia?' },
  { label: 'Produk UMKM', value: 'Produk UMKM apa saja yang ada di desa?' },
  { label: 'Program Desa', value: 'Apa saja program desa yang sedang berjalan?' },
  { label: 'Cara Daftar', value: 'Bagaimana cara mendaftar layanan desa online?' },
  { label: 'Jam Layanan', value: 'Jam layanan kantor desa kapan?' },
];

export default function AiChatBot() {
  const { chatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Halo! 👋 Saya AI Assistant Desa Air Sempiang. Saya siap membantu Anda dengan informasi seputar layanan desa, produk UMKM, program desa, dan lainnya. Silakan pilih topik di bawah atau ketik pertanyaan Anda!',
        },
      ]);
    }
  }, [chatOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen, minimized]);

  const handleSend = async (text?: string) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    const userMsg: ChatMsg = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowQuickReplies(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi atau hubungi kami melalui WhatsApp di 085150859735.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (value: string) => {
    handleSend(value);
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Halo! 👋 Saya AI Assistant Desa Air Sempiang. Saya siap membantu Anda. Silakan pilih topik atau ketik pertanyaan!',
      },
    ]);
    setShowQuickReplies(true);
  };

  if (!chatOpen) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-110 transition-all duration-300"
      >
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
          {messages.length}
        </span>
        <Bot className="h-8 w-8 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-100 bg-white">
        {/* Header - Modern glassmorphism style */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-5 py-4">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm flex items-center gap-1.5">
                  AI Desa Air Sempiang
                  <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-[11px] text-emerald-200">Online - Siap membantu</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                title="Reset percakapan"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMinimized(true)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                title="Minimize"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                title="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[380px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-md shadow-sm'
                    : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-md shadow-sm'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Quick Replies */}
          {showQuickReplies && messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 pl-10 animate-in fade-in duration-300">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(qr.value)}
                  className="px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 rounded-full transition-all hover:shadow-sm"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Modern style */}
        <div className="p-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 bg-transparent text-sm py-1.5 focus:outline-none placeholder:text-gray-400"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`p-2 rounded-lg transition-all ${
                input.trim() && !loading
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm hover:shadow-md'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" /> Powered by AI - Desa Air Sempiang
          </p>
        </div>
      </div>
    </div>
  );
}
