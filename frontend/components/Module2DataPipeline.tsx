'use client';

import React, { useState } from 'react';
import {
  Database,
  Sliders,
  Brain,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  SimulatorConfig,
  EconomicsBreakdown,
  DomainMixture,
  RlvrEffortType,
} from '../types/simulator';
import { DOMAIN_META } from '../data/constants';
import { formatMoney, normalizeDomainMixture } from '../lib/simulationEngine';
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
  const { tokens, pcts, totalTokensT } = normalizeDomainMixture(
    config.domainMixture,
    config.totalTokensT
  );

  const [activeTab, setActiveTab] = useState<'mixture' | 'splits'>('mixture');

  // Independent Domain Token handler: only modifies targetKey and updates totalTokensT
  const handleDomainTokenChange = (targetKey: keyof DomainMixture, newTokens: number) => {
    const clamped = Math.max(0, Number(newTokens.toFixed(2)));
    onChange((prev) => {
      const updatedMixture: DomainMixture = {
        ...prev.domainMixture,
        [targetKey]: clamped,
      };
      const newTotalTokens = Object.values(updatedMixture).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0
      );
      return {
        ...prev,
        domainMixture: updatedMixture,
        totalTokensT: Number(newTotalTokens.toFixed(2)),
      };
    });
  };

  // Master Dataset Scaler (Scales up to 1,000 TB NVMe ~ 312.5T tokens)
  const handleMasterDatasetScale = (targetTokensT: number) => {
    const clamped = Math.max(0.1, Math.min(350, Number(targetTokensT.toFixed(2))));
    onChange((prev) => {
      const currentSum = Object.values(prev.domainMixture).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0
      );
      if (currentSum === 0) {
        // Balanced frontier starter distribution
        const updated: DomainMixture = {
          webCrawl: Number((clamped * 0.32).toFixed(2)),
          code: Number((clamped * 0.20).toFixed(2)),
          math: Number((clamped * 0.14).toFixed(2)),
          science: Number((clamped * 0.10).toFixed(2)),
          booksHistory: Number((clamped * 0.08).toFixed(2)),
          syntheticCoT: Number((clamped * 0.08).toFixed(2)),
          multilingual: Number((clamped * 0.04).toFixed(2)),
          multimodal: Number((clamped * 0.04).toFixed(2)),
        };
        return { ...prev, domainMixture: updated, totalTokensT: clamped };
      }
      const ratio = clamped / currentSum;
      const updated: DomainMixture = {
        webCrawl: Number(((prev.domainMixture.webCrawl || 0) * ratio).toFixed(2)),
        code: Number(((prev.domainMixture.code || 0) * ratio).toFixed(2)),
        math: Number(((prev.domainMixture.math || 0) * ratio).toFixed(2)),
        science: Number(((prev.domainMixture.science || 0) * ratio).toFixed(2)),
        booksHistory: Number(((prev.domainMixture.booksHistory || 0) * ratio).toFixed(2)),
        syntheticCoT: Number(((prev.domainMixture.syntheticCoT || 0) * ratio).toFixed(2)),
        multilingual: Number(((prev.domainMixture.multilingual || 0) * ratio).toFixed(2)),
        multimodal: Number(((prev.domainMixture.multimodal || 0) * ratio).toFixed(2)),
      };
      return { ...prev, domainMixture: updated, totalTokensT: clamped };
    });
  };

  // Preset mixtures based on real-world published frontier models
  const applyMixturePreset = (preset: {
    label: string;
    tokens: DomainMixture;
  }) => {
    const sum = Object.values(preset.tokens).reduce((acc, v) => acc + v, 0);
    onChange((prev) => ({
      ...prev,
      domainMixture: { ...preset.tokens },
      totalTokensT: Number(sum.toFixed(2)),
    }));
  };

  // Train / Validation / Test interactive split handlers
  const handleTrainSplitChange = (newTrain: number) => {
    const train = Math.max(50.0, Math.min(99.8, Number(newTrain.toFixed(1))));
    const remaining = Number((100 - train).toFixed(1));
    const currentOtherSum = config.valSplitPct + config.testSplitPct;
    let val = Number((remaining * (config.valSplitPct / (currentOtherSum || 1))).toFixed(1));
    let test = Number((remaining - val).toFixed(1));
    if (val < 0.1) {
      val = 0.1;
      test = Number((remaining - 0.1).toFixed(1));
    }
    if (test < 0.1) {
      test = 0.1;
      val = Number((remaining - 0.1).toFixed(1));
    }
    onChange((prev) => ({
      ...prev,
      trainSplitPct: train,
      valSplitPct: val,
      testSplitPct: test,
    }));
  };

  const handleValSplitChange = (newVal: number) => {
    const val = Math.max(0.1, Math.min(25.0, Number(newVal.toFixed(1))));
    const currentTrain = config.trainSplitPct;
    const test = Math.max(0.1, Number((100 - currentTrain - val).toFixed(1)));
    onChange((prev) => ({
      ...prev,
      valSplitPct: val,
      testSplitPct: test,
    }));
  };

  const handleTestSplitChange = (newTest: number) => {
    const test = Math.max(0.1, Math.min(25.0, Number(newTest.toFixed(1))));
    const currentTrain = config.trainSplitPct;
    const val = Math.max(0.1, Number((100 - currentTrain - test).toFixed(1)));
    onChange((prev) => ({
      ...prev,
      valSplitPct: val,
      testSplitPct: test,
    }));
  };

  const normalizeSplits = () => {
    const sum = config.trainSplitPct + config.valSplitPct + config.testSplitPct;
    if (sum <= 0) return;
    const train = Number(((config.trainSplitPct / sum) * 100).toFixed(1));
    const val = Number(((config.valSplitPct / sum) * 100).toFixed(1));
    const test = Number((100 - train - val).toFixed(1));
    onChange((prev) => ({
      ...prev,
      trainSplitPct: train,
      valSplitPct: val,
      testSplitPct: test,
    }));
  };

  const splitSum = Number(
    (config.trainSplitPct + config.valSplitPct + config.testSplitPct).toFixed(1)
  );
  const isSplitValid = Math.abs(splitSum - 100.0) < 0.15;

  const trainTokens = Number(((totalTokensT * config.trainSplitPct) / 100).toFixed(2));
  const valTokens = Number(((totalTokensT * config.valSplitPct) / 100).toFixed(2));
  const testTokens = Number(((totalTokensT * config.testSplitPct) / 100).toFixed(2));

  const trainDiskTB = Number(((econ.datasetStorageTB * config.trainSplitPct) / 100).toFixed(1));
  const valDiskTB = Number(((econ.datasetStorageTB * config.valSplitPct) / 100).toFixed(1));
  const testDiskTB = Number(((econ.datasetStorageTB * config.testSplitPct) / 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Stage Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Stage 02 // Data Pipeline &amp; Alignment Curation</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Independent Real-World Mixture, 1,000 TB Sizing &amp; Custom Split Control
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
        {/* Left Column: 1. 8-Domain Mixture -> 2. Master Capacity Footprint -> 3. Train/Val/Test Partition */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: 8-Domain Pre-Training Mixture (Independent Real-World Tokens) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>1. 8-Domain Pre-Training Mixture (Independent Real-World Tokens)</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Adjust each real-world domain independently. The total tokens and master dataset footprint update automatically.
                </p>
              </div>

              {/* Realistic Real-World Mixture Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    label: 'Llama 3.1 15T',
                    tokens: {
                      webCrawl: 7.0,
                      code: 3.0,
                      math: 1.0,
                      science: 0.5,
                      booksHistory: 1.0,
                      syntheticCoT: 0.5,
                      multilingual: 2.0,
                      multimodal: 0.0,
                    },
                  },
                  {
                    label: 'DeepSeek-V3 14.8T',
                    tokens: {
                      webCrawl: 5.5,
                      code: 3.2,
                      math: 2.0,
                      science: 0.8,
                      booksHistory: 1.0,
                      syntheticCoT: 1.6,
                      multilingual: 0.7,
                      multimodal: 0.0,
                    },
                  },
                  {
                    label: 'Qwen 2.5 18T',
                    tokens: {
                      webCrawl: 6.5,
                      code: 3.5,
                      math: 2.5,
                      science: 1.0,
                      booksHistory: 1.2,
                      syntheticCoT: 1.0,
                      multilingual: 2.3,
                      multimodal: 0.0,
                    },
                  },
                  {
                    label: 'Humanities & Lore Heavy',
                    tokens: {
                      webCrawl: 4.5,
                      code: 2.0,
                      math: 1.0,
                      science: 1.5,
                      booksHistory: 3.5,
                      syntheticCoT: 1.5,
                      multilingual: 2.0,
                      multimodal: 0.0,
                    },
                  },
                  {
                    label: 'STEM & Reasoning Heavy',
                    tokens: {
                      webCrawl: 3.5,
                      code: 5.5,
                      math: 4.5,
                      science: 2.5,
                      booksHistory: 0.8,
                      syntheticCoT: 3.5,
                      multilingual: 1.0,
                      multimodal: 0.7,
                    },
                  },
                  {
                    label: '1,000 TB Max Pool',
                    tokens: {
                      webCrawl: 120.0,
                      code: 45.0,
                      math: 28.0,
                      science: 22.0,
                      booksHistory: 20.0,
                      syntheticCoT: 25.0,
                      multilingual: 25.0,
                      multimodal: 17.5,
                    },
                  },
                  {
                    label: 'Zero All (0T)',
                    tokens: {
                      webCrawl: 0,
                      code: 0,
                      math: 0,
                      science: 0,
                      booksHistory: 0,
                      syntheticCoT: 0,
                      multilingual: 0,
                      multimodal: 0,
                    },
                  },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyMixturePreset(preset)}
                    className="px-2 py-1 rounded text-[10px] font-mono bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stacked Proportional Bar of Mixture */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Mixture Composition ({DOMAIN_META.length} Domains)</span>
                <span>{totalTokensT > 0 ? `Total: ${totalTokensT.toFixed(2)}T tokens (${econ.datasetStorageTB.toFixed(1)} TB)` : 'Corpus Empty (0.00T)'}</span>
              </div>
              <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800">
                {DOMAIN_META.map((d) => {
                  const pct = pcts[d.key];
                  if (pct <= 0) return null;
                  return (
                    <div
                      key={d.key}
                      style={{ width: `${pct}%` }}
                      title={`${d.label}: ${pct}% (${tokens[d.key]}T tok)`}
                      className={`${d.barClass} h-full first:rounded-l-full last:rounded-r-full transition-all`}
                    />
                  );
                })}
              </div>
            </div>

            {/* 8 Independent Domain Sliders with Real-World Limits and Datasets */}
            <div className="space-y-4 pt-1">
              {DOMAIN_META.map((d) => {
                const currentT = tokens[d.key] || 0;
                const currentPct = pcts[d.key] || 0;
                const diskTB = Number((currentT * d.tbMultiplier).toFixed(1));

                return (
                  <div
                    key={d.key}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-slate-700/80 transition"
                  >
                    {/* Domain Header: Label, Datasets & Telemetry */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                          <span className={d.color}>{d.label}</span>
                          <SettingTooltip id={d.tooltipId} />
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {d.datasets}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {currentPct}% share • {diskTB} TB
                        </span>
                        <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">
                          <input
                            type="number"
                            min={0}
                            max={d.maxTokensT}
                            step={d.stepTokensT}
                            value={currentT}
                            onChange={(e) =>
                              handleDomainTokenChange(d.key, Number(e.target.value))
                            }
                            className="w-16 bg-transparent text-right font-mono font-bold text-white text-xs focus:outline-none"
                          />
                          <span className="text-slate-400 text-xs font-mono">T tok</span>
                        </div>
                      </div>
                    </div>

                    {/* Real-World Human Archive vs Frontier Limit Indicator */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[10px] font-mono">
                      <span className="text-slate-400">
                        {d.archiveNote}
                      </span>
                      <span className="text-cyan-400 font-semibold whitespace-nowrap bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        Human Earth Archive: ~{d.humanArchiveMaxT}T • Max Headroom: {d.maxTokensT}T
                      </span>
                    </div>

                    {/* Independent Range Slider */}
                    <input
                      type="range"
                      min={0}
                      max={d.maxTokensT}
                      step={d.stepTokensT}
                      value={currentT}
                      onChange={(e) =>
                        handleDomainTokenChange(d.key, Number(e.target.value))
                      }
                      className="w-full accent-cyan-400 cursor-pointer h-1.5"
                    />

                    {/* Quick Pick Real-World Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-mono text-slate-500">Quick:</span>
                      {d.quickPicks.map((chip) => {
                        const isMatch = Math.abs(currentT - chip.tokensT) < 0.05;
                        return (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => handleDomainTokenChange(d.key, chip.tokensT)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition ${
                              isMatch
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            {chip.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Master Dataset Capacity & Storage Footprint (Derived from Mixture) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>2. Master Dataset Capacity &amp; Storage Footprint</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Directly derived from the sum of the 8 domains above. Use the master slider below to scale all domains proportionally.
                </p>
              </div>
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
                <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <span>Proportional Master Dataset Scaler (Scalable to 1,000 TB NVMe)</span>
                  <SettingTooltip id="totalTokensT" />
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-emerald-300">
                    {totalTokensT.toFixed(2)} Trillion Tokens
                  </span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {econ.datasetStorageTB.toFixed(1)} TB NVMe
                  </span>
                </div>
              </div>

              {/* Master Scaler Range Slider */}
              <input
                type="range"
                min={0.5}
                max={312.5}
                step={0.5}
                value={Math.min(312.5, totalTokensT)}
                onChange={(e) => handleMasterDatasetScale(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />

              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-slate-400 mt-2">
                <span>Chinchilla 1x Baseline: {econ.chinchillaOptimalTokensT}T Tokens</span>
                <span>Max Target NVMe Pool: 1,000.0 TB</span>
              </div>

              {/* Quick Scale Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {[
                  { label: '8.0T (25 TB)', tokens: 8.0 },
                  { label: '15.0T (48 TB • Llama 3)', tokens: 15.0 },
                  { label: '18.0T (58 TB • Qwen 2.5)', tokens: 18.0 },
                  { label: '35.0T (112 TB • Colossus)', tokens: 35.0 },
                  { label: '100.0T (320 TB)', tokens: 100.0 },
                  { label: '312.5T (1,000 TB Max)', tokens: 312.5 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMasterDatasetScale(item.tokens)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition hover:border-emerald-500/50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Train / Validation / Test Custom Split Control */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>3. Train, Validation &amp; Test Split (Partitioned from Total Corpus)</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Partitions the {totalTokensT.toFixed(2)}T master tokens ({econ.datasetStorageTB.toFixed(1)} TB) into training shards and held-out evaluation sets.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                    isSplitValid
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {isSplitValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Sum: {splitSum}%</span>
                </span>
                {!isSplitValid && (
                  <button
                    type="button"
                    onClick={normalizeSplits}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Auto-Normalize</span>
                  </button>
                )}
              </div>
            </div>

            {/* Segmented Visual Split Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800">
              <div
                style={{ width: `${Math.min(100, config.trainSplitPct)}%` }}
                title={`Train: ${config.trainSplitPct}%`}
                className="bg-emerald-400 h-full rounded-l-full transition-all"
              />
              <div
                style={{ width: `${Math.min(100, config.valSplitPct)}%` }}
                title={`Validation: ${config.valSplitPct}%`}
                className="bg-amber-400 h-full transition-all"
              />
              <div
                style={{ width: `${Math.min(100, config.testSplitPct)}%` }}
                title={`Test / Holdout: ${config.testSplitPct}%`}
                className="bg-cyan-400 h-full rounded-r-full transition-all"
              />
            </div>

            {/* Split Sliders & Granular Direct Number Inputs */}
            <div className="space-y-3.5 pt-1">
              {/* Training Set Split Slider */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>Training Set Split</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {trainTokens}T tok • {trainDiskTB} TB
                    </span>
                    <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      <input
                        type="number"
                        min={50.0}
                        max={99.8}
                        step={0.1}
                        value={config.trainSplitPct}
                        onChange={(e) => handleTrainSplitChange(Number(e.target.value))}
                        className="w-12 bg-transparent text-right font-mono font-bold text-emerald-300 text-xs focus:outline-none"
                      />
                      <span className="text-slate-400 text-xs font-mono">%</span>
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={50.0}
                  max={99.8}
                  step={0.1}
                  value={config.trainSplitPct}
                  onChange={(e) => handleTrainSplitChange(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5"
                />
              </div>

              {/* Validation Set Split Slider */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span>Validation Set Split</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {valTokens}T tok • {valDiskTB} TB
                    </span>
                    <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      <input
                        type="number"
                        min={0.1}
                        max={25.0}
                        step={0.1}
                        value={config.valSplitPct}
                        onChange={(e) => handleValSplitChange(Number(e.target.value))}
                        className="w-12 bg-transparent text-right font-mono font-bold text-amber-300 text-xs focus:outline-none"
                      />
                      <span className="text-slate-400 text-xs font-mono">%</span>
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={25.0}
                  step={0.1}
                  value={config.valSplitPct}
                  onChange={(e) => handleValSplitChange(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5"
                />
              </div>

              {/* Test / Holdout Set Split Slider */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    <span>Test / Holdout Set Split</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {testTokens}T tok • {testDiskTB} TB
                    </span>
                    <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      <input
                        type="number"
                        min={0.1}
                        max={25.0}
                        step={0.1}
                        value={config.testSplitPct}
                        onChange={(e) => handleTestSplitChange(Number(e.target.value))}
                        className="w-12 bg-transparent text-right font-mono font-bold text-cyan-300 text-xs focus:outline-none"
                      />
                      <span className="text-slate-400 text-xs font-mono">%</span>
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={25.0}
                  step={0.1}
                  value={config.testSplitPct}
                  onChange={(e) => handleTestSplitChange(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5"
                />
              </div>
            </div>

            {/* Split Presets & Benchmark Decontamination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  Split Presets (1-Click)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: '98/1/1%', t: 98, v: 1, te: 1 },
                    { label: '96/2/2%', t: 96, v: 2, te: 2 },
                    { label: '95/2.5/2.5%', t: 95, v: 2.5, te: 2.5 },
                    { label: '90/5/5%', t: 90, v: 5, te: 5 },
                    { label: '80/10/10%', t: 80, v: 10, te: 10 },
                    { label: '99/0.5/0.5%', t: 99, v: 0.5, te: 0.5 },
                  ].map((p) => {
                    const active =
                      config.trainSplitPct === p.t &&
                      config.valSplitPct === p.v &&
                      config.testSplitPct === p.te;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            trainSplitPct: p.t,
                            valSplitPct: p.v,
                            testSplitPct: p.te,
                          }))
                        }
                        className={`py-1.5 px-1 rounded-lg font-mono text-[10px] font-semibold border transition ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  Benchmark Decontamination Filter
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
                    {config.decontaminationFilter ? 'Active (Purged)' : 'Disabled (-2.5 pts)'}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-950">
                    {config.decontaminationFilter ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Post-Training Alignment, RLVR Thinking Effort & Sub-Benchmark Profile */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>4. Post-Training &amp; RLVR Thinking</span>
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
                {
                  label: 'Math & Olympiad (AIME / FrontierMath)',
                  val: econ.subScores.math,
                  color: 'bg-emerald-400',
                  tokensT: tokens.math,
                },
                {
                  label: 'Agentic Coding (SWE-Bench / LiveCode)',
                  val: econ.subScores.coding,
                  color: 'bg-cyan-400',
                  tokensT: tokens.code,
                },
                {
                  label: 'Scientific Reasoning (GPQA Diamond)',
                  val: econ.subScores.science,
                  color: 'bg-purple-400',
                  tokensT: tokens.science,
                },
                {
                  label: 'Literature, History & Humanities',
                  val: econ.subScores.humanities,
                  color: 'bg-rose-400',
                  tokensT: tokens.booksHistory,
                },
                {
                  label: 'Long-Context Recall (RULER 1M)',
                  val: econ.subScores.longContext,
                  color: 'bg-amber-400',
                  tokensT: null,
                },
                {
                  label: 'Multilingual MMLU-Pro',
                  val: econ.subScores.multilingual,
                  color: 'bg-pink-400',
                  tokensT: tokens.multilingual,
                },
                {
                  label: 'Multimodal Vision (MMMU-Pro)',
                  val: econ.subScores.multimodal,
                  color: 'bg-indigo-400',
                  tokensT: tokens.multimodal,
                },
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
