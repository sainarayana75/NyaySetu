import React, { useState } from 'react';
import type { AskResponse } from '../types';
import { askDocumentQuestion } from '../services/api';
import { Send, Sparkles, Eye } from 'lucide-react';

interface AskDocumentProps {
  documentId: string;
  language: string;
  onShowSource: (page: number, text: string) => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  response?: AskResponse;
}

export const AskDocument: React.FC<AskDocumentProps> = ({
  documentId,
  language,
  onShowSource,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your evidence-grounded document assistant. Ask any question about your document. Every answer will be strictly backed by original source clauses.',
    },
  ]);

  const quickPrompts = [
    'What are my primary obligations under this agreement?',
    'What is the monthly rent and late payment penalty?',
    'What is the lock-in period and notice period?',
    'What happens if I terminate before 6 months?',
    'How much is the painting deduction upon leaving?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsgId = Date.now().toString();
    const userMsg: MessageItem = { id: userMsgId, sender: 'user', text: textToSend };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const resp = await askDocumentQuestion(documentId, textToSend, language);
      const aiMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: resp.answer,
        response: resp,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'I encountered an error retrieving evidence from your document.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white">ASK YOUR DOCUMENT (Grounded RAG)</h2>
        </div>
        <span className="text-[10px] uppercase font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
          Strict Evidence Verification
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-3 shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>

                {/* AI Response Classification Badge */}
                {m.response?.response_classification && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase text-slate-400">Classification:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {m.response.response_classification}
                    </span>
                  </div>
                )}

                {/* Attached Source Evidence Cards */}
                {m.response?.sources && m.response.sources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-amber-700 dark:text-amber-400 text-[10px] uppercase">Grounded Source Evidence:</div>
                    {m.response.sources.map((src, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950/80 border border-amber-500/30 p-2.5 rounded-lg space-y-1.5 text-slate-800 dark:text-slate-200">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span>Page {src.page_number} • {src.clause || src.section || 'Clause'}</span>
                          <button
                            onClick={() => onShowSource(src.page_number, src.source_text)}
                            className="flex items-center space-x-1 text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-bold"
                          >
                            <Eye className="w-3 h-3" />
                            <span>SHOW SOURCE</span>
                          </button>
                        </div>
                        <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 italic">
                          "{src.source_text}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-xs text-slate-500 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Retrieving document evidence & verifying source clauses...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-slate-100 dark:bg-slate-950/60 p-2 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap pl-2">Try asking:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="bg-white dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 dark:border-slate-700 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 p-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your uploaded legal document..."
          className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputQuery.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
