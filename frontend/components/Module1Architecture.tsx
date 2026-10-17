'use client';

import React from 'react';
import {
  Cpu,
  Layers,
  Sliders,
  Server,
  Zap,
  ArrowRight,
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
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Architecture Paradigm
                <SettingTooltip id="paradigm" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    {
                      id: 'Dense',
                      title: 'Dense Transformer',
                      desc: '100% weights active per token',
                    },
                    {
                      id: 'Sparse MoE',
                      title: 'Sparse MoE',
                      desc: 'Top-K routed experts + shared',
                    },
                    {
                      id: 'Hybrid Mamba-Transformer',
                      title: 'Hybrid Mamba-Attn',
                      desc: 'Linear SSM + interleaved MLA',
                    },
                  ] as { id: ParadigmType; title: string; desc: string }[]
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
                            : prev.activeParamRatio === 1.0
                              ? 0.08
                              : prev.activeParamRatio,
                      }))
                    }
                    className={`p-3 rounded-xl text-left border transition ${
                      config.paradigm === item.id
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-cyan-300">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Parameters Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Total Parameters (1B – 10T)
                  <SettingTooltip id="totalParamsB" />
                </label>
                <span className="font-mono text-sm font-bold text-cyan-300">
                  {config.totalParamsB >= 1000
                    ? `${(config.totalParamsB / 1000).toFixed(2)} Trillion (${config.totalParamsB.toLocaleString()}B)`
                    : `${config.totalParamsB} Billion`}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10000}
                step={1}
                value={config.totalParamsB}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    totalParamsB: Number(e.target.value),
                  }))
                }
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
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {stop >= 1000 ? `${stop / 1000}T` : `${stop}B`}
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
                  MoE Active Parameter Ratio
                  <SettingTooltip id="activeParamRatio" />
                </label>
                <span className="font-mono text-xs font-bold text-emerald-300">
                  {config.paradigm === 'Dense'
                    ? '100% (Dense Locked)'
                    : `${Math.round(config.activeParamRatio * 100)}% Active (${econ.activeParamsB}B / tok)`}
                </span>
              </div>
              <input
                type="range"
                min={0.03}
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
                className="w-full accent-emerald-400 cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>3% Ultra-Sparse (DeepSeek Style)</span>
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
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Attention Mechanism
                <SettingTooltip id="attention" />
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'MHA', label: 'MHA (Standard)', kv: '100% KV Size' },
                    { id: 'GQA', label: 'GQA (8-Group)', kv: '~32% KV Size' },
                    { id: 'MLA', label: 'MLA (Latent Low-Rank)', kv: '~16% KV Size' },
                  ] as { id: AttentionType; label: string; kv: string }[]
                ).map((attn) => (
                  <button
                    key={attn.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, attention: attn.id }))
                    }
                    className={`p-2.5 rounded-xl text-left border transition ${
                      config.attention === attn.id
                        ? 'bg-purple-500/20 border-purple-500/60 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-purple-300">
                      {attn.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {attn.kv}
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
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {formatContextWindow(stop)}
                  </button>
                ))}
              </div>
            </div>

            {/* Precision & Optimizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Precision / Quantization
                  <SettingTooltip id="precision" />
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['FP32', 'BF16', 'FP8', 'INT4'] as PrecisionType[]).map((prec) => (
                    <button
                      key={prec}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, precision: prec }))
                      }
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition ${
                        config.precision === prec
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {prec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Optimizer Algorithm
                  <SettingTooltip id="optimizer" />
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['AdamW', 'Muon', 'Lion'] as OptimizerType[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, optimizer: opt }))
                      }
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition ${
                        config.optimizer === opt
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
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
                {(Object.keys(GPU_SPECS) as GpuType[]).map((gKey) => {
                  const g = GPU_SPECS[gKey];
                  const selected = config.gpuType === gKey;
                  return (
                    <button
                      key={gKey}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, gpuType: gKey }))
                      }
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        selected
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
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
        </div>
      </div>
    </div>
  );
};
