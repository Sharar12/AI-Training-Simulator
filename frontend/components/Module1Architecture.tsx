'use client';

import React from 'react';
import {
  Cpu,
  Layers,
  Sliders,
  Server,
  Zap,
  ArrowRight,
  Cloud,
  Building2,
  TrendingUp,
  Coins,
} from 'lucide-react';
import {
  SimulatorConfig,
  EconomicsBreakdown,
  ParadigmType,
  AttentionType,
  PrecisionType,
  OptimizerType,
  GpuType,
} from '../types/simulator';
import {
  GPU_SPECS,
  PARAM_STOPS,
  CONTEXT_STOPS,
  GPU_COUNT_STOPS,
} from '../data/constants';
import {
  formatContextWindow,
  formatMemoryGB,
  formatMoney,
} from '../lib/simulationEngine';
import { SettingTooltip } from './SettingTooltip';

interface Module1ArchitectureProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  onChange: (updater: (prev: SimulatorConfig) => SimulatorConfig) => void;
  onNextStage: () => void;
}

export const Module1Architecture: React.FC<Module1ArchitectureProps> = ({
  config,
  econ,
  onChange,
  onNextStage,
}) => {
  const gpuSpec = GPU_SPECS[config.gpuType];

  return (
    <div className="space-y-6">
      {/* Top Module Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Stage 01 // Architecture &amp; Compute Foundry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Transformer Topology, Numerical Precision &amp; Supercluster Allocation
          </h2>
        </div>

        <button
          type="button"
          onClick={onNextStage}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          <span>Proceed to Data Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Model Identity, Paradigm, Parameters, Attention & Context */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Model Identity & Paradigm */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>1. Model Identity &amp; Routing Paradigm</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Active: {econ.activeParamsB}B / {econ.totalParamsB}B Total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Model Identifier
                  <SettingTooltip id="modelName" />
                </label>
                <input
                  type="text"
                  value={config.modelName}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, modelName: e.target.value }))
                  }
                  placeholder="e.g. Chronos-V2 Ultra (Max)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Release License
                  <SettingTooltip id="license" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Proprietary', 'Open Weights'] as const).map((lic) => (
                    <button
                      key={lic}
                      type="button"
                      onClick={() => onChange((prev) => ({ ...prev, license: lic }))}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition ${
                        config.license === lic
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {lic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paradigm Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Architecture Paradigm
                  <SettingTooltip id="paradigm" />
                </label>
                <span className="text-[10px] font-mono text-cyan-400">
                  Select topology &amp; routing dynamics
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      id: 'DeepSeek-V3 MoE',
                      title: 'DeepSeek-V3 MoE (Frontier Efficiency)',
                      desc: '256 Fine-Grained Micro-Experts (8 routed + 1 shared) • Multi-Token Prediction (MTP) • DualPipe Overlap',
                      badges: [
                        { text: '+🧠 +0.85 AA Intelligence', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/15' },
                        { text: '+⚡ +75% Decode Speed', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15' },
                        { text: '+💰 62% Cost Saver', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/15' },
                      ],
                    },
                    {
                      id: 'Dense',
                      title: 'Dense Transformer',
                      desc: '100% monolithic weights active per token • Zero routing noise • Maximum representation density',
                      badges: [
                        { text: '+🧠 +1.6 AA Intelligence Boost', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/15' },
                        { text: '+🛡️ Peak Numerical Stability', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15' },
                        { text: '-⚡ High FLOPs/tok', cls: 'text-rose-300 border-rose-500/40 bg-rose-500/15' },
                      ],
                    },
                    {
                      id: 'Sparse MoE',
                      title: 'Sparse MoE (Standard Top-K)',
                      desc: 'Top-K routed experts with auxiliary loss balancing • Decouples capacity from inference FLOPs',
                      badges: [
                        { text: '+⚡ +18% Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15' },
                        { text: '+💰 Cheap Per-Token Cost', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/15' },
                        { text: 'Dynamic Active Scaling', cls: 'text-slate-300 border-slate-700 bg-slate-800' },
                      ],
                    },
                    {
                      id: 'Hybrid Mamba-Transformer',
                      title: 'Hybrid Mamba-Attn',
                      desc: 'Linear State Space (SSM) blocks interleaved with attention • Constant O(1) inference state memory',
                      badges: [
                        { text: '+⚡ +32% Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15' },
                        { text: '+⚡ Ultra-Fast TTFT', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15' },
                        { text: '-🧠 -0.9 AA Complex Reasoning', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/15' },
                      ],
                    },
                  ] as { id: ParadigmType; title: string; desc: string; badges: { text: string; cls: string }[] }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        paradigm: item.id,
                        activeParamRatio:
                          item.id === 'Dense'
                            ? 1.0
                            : item.id === 'DeepSeek-V3 MoE'
                              ? 0.055
                              : prev.activeParamRatio === 1.0
                                ? 0.08
                                : prev.activeParamRatio,
                      }))
                    }
                    className={`p-3 rounded-xl text-left border transition relative flex flex-col justify-between ${
                      config.paradigm === item.id
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-[0_0_18px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-300">
                          {item.title}
                        </span>
                        {config.paradigm === item.id && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
                      {item.badges.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${b.cls}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Parameters Slider (Scales from 1B up to 1,000T) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Total Parameters (1B – 1,000T)
                  <SettingTooltip id="totalParamsB" />
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-cyan-300">
                    {config.totalParamsB >= 1000000
                      ? `${(config.totalParamsB / 1000000).toFixed(2)} Quadrillion (${config.totalParamsB.toLocaleString()}B)`
                      : config.totalParamsB >= 1000
                        ? `${(config.totalParamsB / 1000).toFixed(2)} Trillion (${config.totalParamsB.toLocaleString()}B)`
                        : `${config.totalParamsB} Billion`}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      value={config.totalParamsB}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          totalParamsB: Math.max(1, Math.min(1000000, Number(e.target.value))),
                        }))
                      }
                      className="w-16 bg-transparent text-right font-mono text-xs text-white focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-slate-400">B</span>
                  </div>
                </div>
              </div>

              {/* Logarithmic Slider spanning 1B to 1,000,000B (1B to 1,000T) */}
              <input
                type="range"
                min={0}
                max={6}
                step={0.01}
                value={Math.log10(Math.max(1, config.totalParamsB))}
                onChange={(e) => {
                  const rawVal = Math.pow(10, Number(e.target.value));
                  const rounded = rawVal >= 10000 ? Math.round(rawVal / 1000) * 1000 : Math.round(rawVal);
                  onChange((prev) => ({
                    ...prev,
                    totalParamsB: Math.max(1, Math.min(1000000, rounded)),
                  }));
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="flex flex-wrap gap-1.5 mt-2">
                {PARAM_STOPS.map((stop) => (
                  <button
                    key={stop}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, totalParamsB: stop }))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
                      config.totalParamsB === stop
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {stop >= 1000000 ? '1000T' : stop >= 1000 ? `${stop / 1000}T` : `${stop}B`}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>Model Weights: {(econ.inferenceWeightGB / 1024).toFixed(2)} TB</span>
                <span>Rolling Checkpoint Pool: {econ.checkpointStorageTB.toFixed(1)} TB NVMe</span>
              </div>
            </div>

            {/* MoE Active Parameter Ratio Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  MoE Active Parameter Ratio (Direct Reasoning Scaling)
                  <SettingTooltip id="activeParamRatio" />
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    {config.paradigm === 'Dense'
                      ? '100% (Dense Full Activation)'
                      : `${Math.round(config.activeParamRatio * 100)}% Active (${econ.activeParamsB >= 1000 ? (econ.activeParamsB / 1000).toFixed(2) + 'T' : econ.activeParamsB + 'B'} / tok)`}
                  </span>
                  {config.paradigm !== 'Dense' && (
                    <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                      +{(5.5 * Math.log10(Math.max(1, config.totalParamsB * config.activeParamRatio)) - 5.5 * Math.log10(Math.max(1, config.totalParamsB * 0.05))).toFixed(1)} AA vs 5% base
                    </span>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={0.02}
                max={1.0}
                step={0.01}
                disabled={config.paradigm === 'Dense'}
                value={config.paradigm === 'Dense' ? 1.0 : config.activeParamRatio}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    activeParamRatio: Number(e.target.value),
                  }))
                }
                className={`w-full accent-emerald-400 ${
                  config.paradigm === 'Dense'
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>2% Ultra-Sparse (DeepSeek Style)</span>
                <span>15% Moderate MoE</span>
                <span>100% Dense</span>
              </div>
            </div>
          </div>

          {/* Card 2: Attention, Context Window, Precision & Optimizer */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>2. Attention, Context Window &amp; Numerics</span>
              </h3>
              <span className="text-xs font-mono text-purple-300">
                KV-Cache: {econ.kvCacheVramGB.toFixed(1)} GB
              </span>
            </div>

            {/* Attention Mechanism */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Attention Mechanism
                  <SettingTooltip id="attention" />
                </label>
                <span className="text-[10px] font-mono text-purple-300">
                  KV-Cache Projection &amp; Head Factor
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    {
                      id: 'MLA',
                      label: 'MLA (Latent Low-Rank)',
                      kv: '~16% KV Size',
                      badges: [
                        { text: '+⚡ +22% Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+💰 -84% KV VRAM', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'GQA',
                      label: 'GQA (8-Group)',
                      kv: '~32% KV Size',
                      badges: [
                        { text: '+⚡ +8% Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+💰 -68% KV VRAM', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'MHA',
                      label: 'MHA (Standard)',
                      kv: '100% KV Size',
                      badges: [
                        { text: '+🧠 Full Uncompressed', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
                        { text: '-💰 High KV VRAM', cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10' },
                      ],
                    },
                  ] as { id: AttentionType; label: string; kv: string; badges: { text: string; cls: string }[] }[]
                ).map((attn) => (
                  <button
                    key={attn.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, attention: attn.id }))
                    }
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                      config.attention === attn.id
                        ? 'bg-purple-500/20 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-purple-300">
                        {attn.label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {attn.kv}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-slate-800/80">
                      {attn.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono border ${b.cls}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Context Window Length */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Context Window Length (8K – 10M Tokens)
                  <SettingTooltip id="contextWindow" />
                </label>
                <span className="font-mono text-sm font-bold text-purple-300">
                  {formatContextWindow(config.contextWindowK)} Tokens
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={10000}
                step={8}
                value={config.contextWindowK}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    contextWindowK: Number(e.target.value),
                  }))
                }
                className="w-full accent-purple-400 cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CONTEXT_STOPS.map((stop) => (
                  <button
                    key={stop}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, contextWindowK: stop }))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
                      config.contextWindowK === stop
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {formatContextWindow(stop)}
                  </button>
                ))}
              </div>
            </div>

            {/* Precision / Quantization (BF16, FP8, INT4, Ternary 1.58b, Bonsai 1-bit, FP32) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Precision &amp; State-of-the-Art Quantization
                  <SettingTooltip id="precision" />
                </label>
                <span className="text-[10px] font-mono text-amber-300">
                  {econ.weightBytesPerParam} Bytes/Param
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    {
                      id: 'BF16',
                      label: 'BF16 (Standard)',
                      desc: 'Full 16-bit master precision',
                      badges: [
                        { text: '+🧠 Zero Quant Loss', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
                        { text: '0.0 AA Delta', cls: 'text-slate-400 border-slate-700 bg-slate-800' },
                      ],
                    },
                    {
                      id: 'FP8',
                      label: 'FP8 (E4M3)',
                      desc: 'Modern 8-bit mixed precision',
                      badges: [
                        { text: '+⚡ +68% Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+💰 -50% VRAM', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'Ternary 1.58b',
                      label: 'Ternary 1.58b (BitNet)',
                      desc: '{-1, 0, +1} MatMul-free additions',
                      badges: [
                        { text: '+⚡ 3.85x Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+🧠 -0.85 AA Minimal Loss', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
                        { text: '+💰 90% VRAM Saver', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'Bonsai 1-bit',
                      label: 'Bonsai 1-bit (PrismML)',
                      desc: '1-bit bundle group quantization',
                      badges: [
                        { text: '+⚡ 4.45x Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+📱 Fits 16GB Laptop', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                        { text: '+💰 93% VRAM Saver', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'INT4',
                      label: 'INT4 (AWQ/GPTQ)',
                      desc: '4-bit integer quantization',
                      badges: [
                        { text: '+⚡ 2.15x Speed Boost', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '-🧠 -3.5 AA Penalty', cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10' },
                      ],
                    },
                    {
                      id: 'FP32',
                      label: 'FP32 (Float32)',
                      desc: 'Legacy single precision',
                      badges: [
                        { text: '+🛡️ Max Stability', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '-⚡ 0.5x Slowest', cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10' },
                      ],
                    },
                  ] as { id: PrecisionType; label: string; desc: string; badges: { text: string; cls: string }[] }[]
                ).map((prec) => (
                  <button
                    key={prec.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, precision: prec.id }))
                    }
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                      config.precision === prec.id
                        ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-amber-300">
                        {prec.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {prec.desc}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-slate-800/80">
                      {prec.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono border ${b.cls}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optimizer Algorithm */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Optimizer Algorithm
                <SettingTooltip id="optimizer" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(
                  [
                    {
                      id: 'Muon',
                      label: 'Muon (Newton-Schulz)',
                      desc: 'Orthogonalized momentum matrix updates',
                      badges: [
                        { text: '+🧠 +0.85 AA Boost', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
                        { text: '+💰 -33% Opt VRAM (8B)', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'Lion',
                      label: 'Lion (Sign Momentum)',
                      desc: 'Memory-efficient sign-based step rule',
                      badges: [
                        { text: '+⚡ Fast Step Updates', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+💰 -33% Opt VRAM (8B)', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                      ],
                    },
                    {
                      id: 'AdamW',
                      label: 'AdamW (Standard)',
                      desc: 'Proven decoupled adaptive moments',
                      badges: [
                        { text: '+🛡️ Gold Standard Baseline', cls: 'text-slate-300 border-slate-700 bg-slate-800' },
                        { text: '-💰 12B/param VRAM', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                      ],
                    },
                  ] as { id: OptimizerType; label: string; desc: string; badges: { text: string; cls: string }[] }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, optimizer: opt.id }))
                    }
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                      config.optimizer === opt.id
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-emerald-300">
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-slate-800/80">
                      {opt.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono border ${b.cls}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Datacenter GPU Supercluster & Live Topology Readout */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 3: GPU Cluster Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>3. Datacenter Supercluster</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                ${gpuSpec.hourlyRateUSD.toFixed(2)}/GPU/hr
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Accelerator Hardware Node
                <SettingTooltip id="gpuType" />
              </label>
              <div className="space-y-2">
                {(
                  [
                    {
                      id: 'B200',
                      badges: [
                        { text: '+⚡ +125% FLOPs Speed', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+⚡ 8.0 TB/s NVLink 5', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                        { text: 'Buy: $52K/chip', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                      ],
                    },
                    {
                      id: 'H200',
                      badges: [
                        { text: '+⚡ 4.8 TB/s HBM3e', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
                        { text: '+💰 141GB VRAM', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
                        { text: 'Buy: $38K/chip', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                      ],
                    },
                    {
                      id: 'H100',
                      badges: [
                        { text: '+💰 Gold Standard Baseline', cls: 'text-slate-300 border-slate-700 bg-slate-800' },
                        { text: '3.35 TB/s NVLink 4', cls: 'text-slate-400 border-slate-700 bg-slate-800' },
                        { text: 'Buy: $32K/chip', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                      ],
                    },
                    {
                      id: 'TPUv6e',
                      badges: [
                        { text: '+💰 $1.85/hr Budget Cost Saver', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                        { text: 'ICI Optical Torus', cls: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
                        { text: 'Buy: $18K/chip', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                      ],
                    },
                    {
                      id: 'Ascend910C',
                      badges: [
                        { text: '+💰 $2.05/hr Sovereign Silicon', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
                        { text: 'HCCS High Mesh', cls: 'text-slate-400 border-slate-700 bg-slate-800' },
                        { text: 'Buy: $22K/chip', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
                      ],
                    },
                  ] as { id: GpuType; badges: { text: string; cls: string }[] }[]
                ).map((item) => {
                  const g = GPU_SPECS[item.id];
                  const selected = config.gpuType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, gpuType: item.id }))
                      }
                      className={`w-full p-2.5 rounded-xl border text-left transition ${
                        selected
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-xs font-bold text-slate-100">
                            {g.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {g.bf16Tflops} TFLOPs BF16 • {g.fp8Tflops} TFLOPs FP8 • {g.bandwidthTBps} TB/s • {g.tdpWatts}W
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-emerald-300">
                            ${g.hourlyRateUSD.toFixed(2)}/hr
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {g.vramGB}GB HBM
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-slate-800/80">
                        {item.badges.map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono border ${b.cls}`}
                          >
                            {b.text}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cluster GPU Count */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Cluster Size (Total GPUs)
                  <SettingTooltip id="gpuCount" />
                </label>
                <span className="font-mono text-sm font-bold text-emerald-300">
                  {config.gpuCount.toLocaleString()}x {gpuSpec.id} ({Math.ceil(config.gpuCount / 8).toLocaleString()} Nodes)
                </span>
              </div>
              <input
                type="range"
                min={128}
                max={131072}
                step={128}
                value={config.gpuCount}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    gpuCount: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {GPU_COUNT_STOPS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, gpuCount: cnt }))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
                      config.gpuCount === cnt
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {cnt >= 1024 ? `${cnt / 1024}K` : cnt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      gpuCount: Math.max(128, econ.minGpusToFitMemory),
                    }))
                  }
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 ml-auto"
                >
                  Auto-Fit Min VRAM ({econ.minGpusToFitMemory.toLocaleString()})
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Live Architecture & Sharding Telemetry Summary */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Live Memory &amp; Parallelism Diagnostic</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                MFU: <strong className="text-white">{econ.mfuPct}%</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Training VRAM Pool</span>
                <span className="text-sm font-bold text-cyan-300">
                  {formatMemoryGB(econ.trainingVramGB)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Cluster Cap: {((config.gpuCount * gpuSpec.vramGB) / 1024).toFixed(1)} TB
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Inference VRAM</span>
                <span className="text-sm font-bold text-amber-300">
                  {econ.inferenceVramGB} GB
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Weights: {econ.inferenceWeightGB.toFixed(1)}G + KV: {econ.kvCacheVramGB.toFixed(1)}G
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Pred. Output Speed</span>
                <span className="text-sm font-bold text-emerald-300">
                  {econ.predictedOutputSpeedTokPerSec} tok/s
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  TTFT Latency: {econ.predictedTtftSec}s
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Est. Total Build Cost</span>
                <span className="text-sm font-bold text-white">
                  {formatMoney(econ.grandTotalBuildCostUSD)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Duration: {econ.trainingDays.toFixed(1)} days
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Hardware Procurement Strategy: Cloud Rental vs Owned Local Hardware */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>4. Procurement: Cloud Rental vs. Owned Hardware</span>
              </h3>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                Breakeven: {econ.procurement.breakevenMonths} Mo
              </span>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {/* Option A: Cloud Rental */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Cloud On-Demand Rental</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                    OpEx Model
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cluster Hourly Burn:</span>
                    <span className="text-white font-bold">{formatMoney(econ.procurement.cloudRentalHourlyUSD)}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Run Compute Cost:</span>
                    <span className="text-cyan-300 font-bold">{formatMoney(econ.procurement.cloudRentalTotalUSD)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Upfront CapEx:</span>
                    <span className="text-emerald-400 font-bold">$0 (Zero Down)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <div className="text-emerald-300 font-semibold">✓ Zero Upfront Commitment</div>
                  <div>• Pay only for active training wall-clock hours</div>
                  <div>• Elastic burst scaling &amp; zero obsolescence risk</div>
                </div>
              </div>

              {/* Option B: Local / Owned Hardware */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Owned Cluster Hardware</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                    CapEx Model
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Purchase CapEx:</span>
                    <span className="text-amber-300 font-bold">{formatMoney(econ.procurement.ownedHardwareCapExUSD)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">3-Yr Amortized Run:</span>
                    <span className="text-purple-300 font-bold">{formatMoney(econ.procurement.ownedHardwareTotalUSD)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Breakeven Horizon:</span>
                    <span className="text-white font-bold">{econ.procurement.breakevenMonths} Mo ({econ.procurement.breakevenTrainingHours.toLocaleString()} hrs)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <div className="text-purple-300 font-semibold">✓ Permanent Asset Ownership</div>
                  <div>• {config.gpuCount.toLocaleString()}x {gpuSpec.id} @ ${gpuSpec.purchaseCostUSD.toLocaleString()}/chip</div>
                  <div>• Includes 18% colocation, switches &amp; PUE power</div>
                </div>
              </div>
            </div>

            {/* Strategic Verdict Callout */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] leading-relaxed">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Procurement Analysis &amp; Capital Efficiency</span>
              </div>
              <p className="text-slate-300">
                {econ.trainingHours < econ.procurement.breakevenTrainingHours ? (
                  <>
                    For this single <strong className="text-white">{econ.trainingDays.toFixed(1)}-day</strong> ({Math.round(econ.trainingHours).toLocaleString()} hrs) training run,{' '}
                    <strong className="text-cyan-300">Cloud Rental is drastically more capital-efficient</strong> ({formatMoney(econ.procurement.cloudRentalTotalUSD)} vs.{' '}
                    {formatMoney(econ.procurement.ownedHardwareCapExUSD)} CapEx). Purchasing an owned cluster only becomes profitable after{' '}
                    <strong className="text-white">{econ.procurement.breakevenMonths} months</strong> of continuous 24/7 cluster utilization.
                  </>
                ) : (
                  <>
                    For sustained workloads exceeding <strong className="text-white">{econ.procurement.breakevenMonths} months</strong> ({econ.procurement.breakevenTrainingHours.toLocaleString()} continuous hours),{' '}
                    <strong className="text-emerald-300">Owning hardware yields massive long-term savings</strong> (saving ~{formatMoney(econ.procurement.ownedSavingsUSD)} over cloud markups), providing complete physical hardware sovereignty.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
