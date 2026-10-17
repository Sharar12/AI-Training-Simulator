'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, TrendingUp, TrendingDown } from 'lucide-react';
import { TooltipSpec } from '../types/simulator';
import { TOOLTIP_REGISTRY } from '../data/constants';

interface SettingTooltipProps {
  id: string;
  customSpec?: TooltipSpec;
}

export const SettingTooltip: React.FC<SettingTooltipProps> = ({ id, customSpec }) => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const spec = customSpec || TOOLTIP_REGISTRY[id];

  useEffect(() => {
    if (!pinned) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPinned(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pinned]);

  if (!spec) return null;

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center ml-1.5 align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!pinned) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={`What-If info for ${spec.title}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPinned((prev) => !prev);
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-mono transition-all border ${
          open || pinned
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
            : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-cyan-300 hover:border-cyan-500/60'
        }`}
      >
        <HelpCircle className="w-3 h-3" />
      </button>

      {open && (
        <div
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 left-0 sm:left-auto sm:right-0 top-6 w-80 sm:w-96 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-2xl text-left text-xs text-slate-200 animate-in fade-in duration-150"
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                Interactive What-If Telemetry
              </span>
              <h4 className="font-semibold text-white text-xs mt-0.5">{spec.title}</h4>
            </div>
            {pinned && (
              <button
                type="button"
                onClick={() => {
                  setPinned(false);
                  setOpen(false);
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded"
                aria-label="Close tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed mb-3 text-[11px]">
            <span className="font-semibold text-slate-100">What it is: </span>
            {spec.whatItIs}
          </p>

          <div className="space-y-2.5">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/90">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>🔼 Increasing (▲ Effect)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug mb-1.5">
                {spec.increasingEffect}
              </p>
              <div className="flex flex-wrap gap-1">
                {spec.increasingTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                      tag.tone === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : tag.tone === 'negative'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/90">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase tracking-wider font-semibold mb-1">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>🔽 Decreasing (▼ Effect)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug mb-1.5">
                {spec.decreasingEffect}
              </p>
              <div className="flex flex-wrap gap-1">
                {spec.decreasingTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                      tag.tone === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : tag.tone === 'negative'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};
