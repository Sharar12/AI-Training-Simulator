'use client';

import React from 'react';
import {
  Database,
  Sliders,
  Brain,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  SimulatorConfig,
  EconomicsBreakdown,
  DomainMixture,
  RlvrEffortType,
} from '../types/simulator';
import { DOMAIN_META } from '../data/constants';
import { formatMoney } from '../lib/simulationEngine';
import { SettingTooltip } from './SettingTooltip';

interface Module2DataPipelineProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  onChange: (updater: (prev: SimulatorConfig) => SimulatorConfig) => void;
  onPrevStage: () => void;
  onNextStage: () => void;
}

export const Module2DataPipeline: React.FC<Module2DataPipelineProps> = ({
  config,
  econ,
  onChange,
  onPrevStage,
  onNextStage,
}) => {
  const handleDomainSlider = (targetKey: keyof DomainMixture, newValue: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newValue)));
    onChange((prev) => {
      const current = prev.domainMixture;
      const otherKeys = (Object.keys(current) as (keyof DomainMixture)[]).filter(
        (k) => k !== targetKey
      );
      const otherSum = otherKeys.reduce((acc, k) => acc + current[k], 0);
      const remaining = 100 - clamped;

      const updated: DomainMixture = { ...current, [targetKey]: clamped };
      if (otherSum === 0) {
        const share = Math.floor(remaining / otherKeys.length);
        otherKeys.forEach((k, idx) => {
          updated[k] = idx === 0 ? remaining - share * (otherKeys.length - 1) : share;
        });
      } else {
        let running = 0;
        otherKeys.forEach((k, idx) => {
          if (idx === otherKeys.length - 1) {
            updated[k] = Math.max(0, remaining - running);
          } else {
            const scaled = Math.round((current[k] / otherSum) * remaining);
            updated[k] = scaled;
            running += scaled;
          }
        });
      }
      return { ...prev, domainMixture: updated };
    });
  };

  const applySplitPreset = (train: number, val: number, test: number) => {
    onChange((prev) => ({
      ...prev,
      trainSplitPct: train,
      valSplitPct: val,
      testSplitPct: test,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Stage 02 // Data Pipeline &amp; Alignment Curation</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Chinchilla Scaling, 7-Domain Mixture &amp; Post-Training RLVR Thinking Budget
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPrevStage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Architecture</span>
          </button>
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs font-mono transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <span>Launch Training Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Token Volume, Chinchilla Gauge, Splits, Decontamination & 7 Domain Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Token Budget & Chinchilla Optimality Gauge */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>1. Token Volume &amp; Chinchilla Scaling Law</span>
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                  econ.chinchillaStatus.includes('Optimal')
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : econ.chinchillaStatus.includes('Over-Trained')
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                }`}
              >
                {econ.chinchillaStatus} ({econ.chinchillaRatio}x Chinchilla)
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Total Pre-Training Dataset Size (0.5T – 100T Tokens)
                  <SettingTooltip id="totalTokensT" />
                </label>
                <span className="font-mono text-sm font-bold text-emerald-300">
                  {config.totalTokensT.toFixed(1)} Trillion Tokens
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={100}
                step={0.5}
                value={config.totalTokensT}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    totalTokensT: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
                <span>Chinchilla 1x Baseline: {econ.chinchillaOptimalTokensT}T Tokens</span>
                <span>Dataset Disk: {econ.datasetStorageTB.toFixed(1)} TB NVMe</span>
              </div>
            </div>

            {/* Train / Validation / Test Split + Decontamination Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Train / Validation / Test Split (%)
                  <SettingTooltip id="trainValTestSplit" />
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '98 / 1 / 1%', vals: [98, 1, 1] },
                    { label: '96 / 2 / 2%', vals: [96, 2, 2] },
                    { label: '94 / 3 / 3%', vals: [94, 3, 3] },
                  ].map((preset) => {
                    const active = config.trainSplitPct === preset.vals[0];
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          applySplitPreset(
                            preset.vals[0],
                            preset.vals[1],
                            preset.vals[2]
                          )
                        }
                        className={`py-2 px-2 rounded-xl font-mono text-[11px] font-semibold border transition ${
                          active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Benchmark Decontamination Filter
                  <SettingTooltip id="decontaminationFilter" />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      decontaminationFilter: !prev.decontaminationFilter,
                    }))
                  }
                  className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-semibold border flex items-center justify-between transition ${
                    config.decontaminationFilter
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {config.decontaminationFilter ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <ShieldAlert className="w-4 h-4" />
                    )}
                    {config.decontaminationFilter
                      ? 'Active (N-Gram + Embedding Purge)'
                      : 'Disabled (Leakage Risk -2.5 pts)'}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-950">
                    {config.decontaminationFilter ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 7 Domain Mixture Sliders totaling 100% */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>2. 7-Domain Pre-Training Mixture (Auto-Balanced 100%)</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      domainMixture: {
                        webCrawl: 18,
                        code: 26,
                        math: 20,
                        science: 14,
                        syntheticCoT: 14,
                        multilingual: 4,
                        multimodal: 4,
                      },
                    }))
                  }
                  className="px-2 py-1 rounded text-[10px] font-mono bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800"
                >
                  STEM &amp; Coding Heavy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      domainMixture: {
                        webCrawl: 24,
                        code: 22,
                        math: 16,
                        science: 12,
                        syntheticCoT: 12,
                        multilingual: 7,
                        multimodal: 7,
                      },
                    }))
                  }
                  className="px-2 py-1 rounded text-[10px] font-mono bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800"
                >
                  Balanced Frontier
                </button>
              </div>
            </div>

            {/* Stacked Visual Composition Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800">
              {DOMAIN_META.map((d) => {
                const pct = config.domainMixture[d.key];
                if (pct <= 0) return null;
                return (
                  <div
                    key={d.key}
                    style={{ width: `${pct}%` }}
                    title={`${d.label}: ${pct}%`}
                    className={`${d.barClass} h-full first:rounded-l-full last:rounded-r-full transition-all`}
                  />
                );
              })}
            </div>

            <div className="space-y-3">
              {DOMAIN_META.map((d) => {
                const val = config.domainMixture[d.key];
                const tokT = ((config.totalTokensT * val) / 100).toFixed(2);
                return (
                  <div key={d.key}>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className={d.color}>
                        {d.label}
                        <SettingTooltip id={d.tooltipId} />
                      </span>
                      <span className="text-slate-200 font-bold">
                        {val}% <span className="text-slate-500 font-normal">({tokT}T tok)</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={70}
                      step={1}
                      value={val}
                      onChange={(e) =>
                        handleDomainSlider(d.key, Number(e.target.value))
                      }
                      className="w-full accent-cyan-400 cursor-pointer h-1.5"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Post-Training Alignment & RLVR Thinking Effort */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>3. Post-Training &amp; RLVR Thinking</span>
              </h3>
              <span className="text-xs font-mono text-amber-300">
                Post-Train: {formatMoney(econ.postTrainingCostUSD)}
              </span>
            </div>

            {/* SFT Rounds */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Supervised Fine-Tuning (SFT) Intensity
                  <SettingTooltip id="sftRounds" />
                </label>
                <span className="font-mono text-xs font-bold text-cyan-300">
                  Level {config.sftRounds} / 5 ({config.sftRounds * 250}K Curated Traces)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={config.sftRounds}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    sftRounds: Number(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* RLHF / DPO Alignment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  RLHF / DPO Human Alignment &amp; Safety Passes
                  <SettingTooltip id="rlhfAlignment" />
                </label>
                <span className="font-mono text-xs font-bold text-purple-300">
                  {config.rlhfAlignment} Alignment Rounds
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={config.rlhfAlignment}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    rlhfAlignment: Number(e.target.value),
                  }))
                }
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* RLVR / Thinking Effort Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                RLVR / Thinking Effort (Verifiable Math/Code Rollouts)
                <SettingTooltip id="rlvrEffort" />
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['Low', 'Medium', 'High', 'Xhigh', 'Max'] as RlvrEffortType[]).map(
                  (effort) => (
                    <button
                      key={effort}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, rlvrEffort: effort }))
                      }
                      className={`py-2.5 px-1.5 rounded-xl font-mono text-xs font-bold border transition text-center ${
                        config.rlvrEffort === effort
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {effort}
                    </button>
                  )
                )}
              </div>
              <div className="mt-2 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reasoning Output Tokens/Task:</span>
                  <span className="text-amber-300 font-bold">
                    ~{econ.avgOutputTokensPerTask.toLocaleString()} tokens
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Cost per AA Index Task:</span>
                  <span className="text-emerald-300 font-bold">
                    ${econ.costPerTaskUSD.toFixed(4)} / task
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time-to-First-Token (TTFT):</span>
                  <span className="text-cyan-300 font-bold">{econ.predictedTtftSec}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Capability Projection Preview */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Projected Sub-Benchmark Profile</span>
              </span>
              <span className="font-mono text-xs font-bold text-white">
                AA Index: {econ.predictedIntelligenceIndex}
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { label: 'Math & Olympiad (AIME / FrontierMath)', val: econ.subScores.math, color: 'bg-emerald-400' },
                { label: 'Agentic Coding (SWE-Bench / LiveCode)', val: econ.subScores.coding, color: 'bg-cyan-400' },
                { label: 'Scientific Reasoning (GPQA Diamond)', val: econ.subScores.science, color: 'bg-purple-400' },
                { label: 'Long-Context Recall (RULER 1M)', val: econ.subScores.longContext, color: 'bg-amber-400' },
                { label: 'Multilingual MMLU-Pro', val: econ.subScores.multilingual, color: 'bg-pink-400' },
                { label: 'Multimodal Vision (MMMU-Pro)', val: econ.subScores.multimodal, color: 'bg-indigo-400' },
              ].map((b) => {
                const isZero = b.val === 0;
                return (
                  <div key={b.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">{b.label}</span>
                      <span className={`font-bold ${isZero ? 'text-slate-500' : 'text-white'}`}>
                        {isZero
                          ? b.label.includes('Multimodal')
                            ? '0.0% (Text-Only)'
                            : '0.0% (No Domain Data)'
                          : `${b.val}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`${b.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, b.val)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
