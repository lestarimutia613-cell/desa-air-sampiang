'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Bot, X, Sparkles, MessageCircle } from 'lucide-react';

export default function FloatingActionBar() {
  const { chatOpen, setChatOpen } = useAppStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If chat is open, hide the floating buttons
  if (chatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Welcome tooltip - shows once */}
      {showTooltip && !dismissed && (
        <div className="absolute bottom-24 right-0 bg-white shadow-2xl rounded-2xl px-5 py-4 border border-emerald-100 max-w-[260px] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-bold text-emerald-800">Butuh Bantuan?</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Chat dengan AI Chatbot atau hubungi kami via WhatsApp untuk respon cepat!
          </p>
        </div>
      )}

      {/* WhatsApp Button - Modern floating circle */}
      <a
        href="https://wa.me/6285150859735"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-110 transition-all duration-300"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => !dismissed && setShowTooltip(false)}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
        <svg className="h-7 w-7 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {/* Label on hover */}
        <span className="absolute right-16 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          WhatsApp Desa
        </span>
      </a>

      {/* AI Chatbot Button - Modern floating circle */}
      <button
        onClick={() => setChatOpen(true)}
        className="group relative w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300"
      >
        {/* Outer pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" style={{ animationDuration: '2.5s' }} />
        {/* Inner glow */}
        <span className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-400/20" />
        <Bot className="h-8 w-8 text-white relative z-10" />
        {/* Label on hover */}
        <span className="absolute right-20 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          AI Chatbot Desa
        </span>
      </button>
    </div>
  );
}
