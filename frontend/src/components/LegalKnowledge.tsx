import React, { useState, useEffect } from 'react';
import type { LegalKnowledgeItem, LegalSource } from '../types';
import { fetchLegalKnowledge, fetchOfficialSources } from '../services/api';
import { Globe, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export const LegalKnowledge: React.FC = () => {
  const [items, setItems] = useState<LegalKnowledgeItem[]>([]);
  const [sources, setSources] = useState<LegalSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [kData, sData] = await Promise.all([
          fetchLegalKnowledge(searchQuery),
          fetchOfficialSources(),
        ]);
        setItems(kData);
        setSources(sData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authoritative Indian Legal Knowledge & Aid Directory</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
          Educational guide explaining standard Indian legal concepts (Registration Act, Legal Notice, Indemnity) with official links to NALSA, eCourts, and India Code.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Indian legal terms (e.g. 11-month rental, legal notice, indemnity, NALSA)..."
          className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* General Legal Concepts */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
          General Legal Concepts (Statutory Frameworks)
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-500">Loading authoritative legal concepts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{item.authoritative_source}</span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary}</p>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">DETAILED STATUTORY CONTEXT:</div>
                  <p>{item.detailed_explanation}</p>
                </div>

                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                  >
                    <span>View on {item.authoritative_source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Legal Assistance Portals */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official Indian Free Legal Aid & Judicial Portals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div key={src.id} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{src.name}</h4>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{src.authority}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{src.description}</p>
              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                >
                  <span>Access Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
