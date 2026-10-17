'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  BarChart3,
  Check,
  Clock,
  Copy,
  Cpu,
  DollarSign,
  Download,
  FileText,
  PlusCircle,
  Radar as RadarIcon,
  ScatterChart as ScatterIcon,
  Search,
  Server,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  SimulatorConfig,
  EconomicsBreakdown,
  CompetitorModel,
} from '../types/simulator';
import { COMPETITOR_MODELS } from '../data/competitorModels';
import { GPU_SPECS } from '../data/constants';
import {
  formatMoney,
  formatContextWindow,
  formatTrainingDuration,
  normalizeDomainMixture,
} from '../lib/simulationEngine';
import { SettingTooltip } from './SettingTooltip';

// --- TrainingSettingsDossier ---
interface TrainingSettingsDossierProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  userRank: number;
}

export const TrainingSettingsDossier: React.FC<TrainingSettingsDossierProps> = ({
  config,
  econ,
  userRank,
}) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'data' | 'memory'>('budget');
  const [copied, setCopied] = useState<boolean>(false);
  const gpu = GPU_SPECS[config.gpuType];

  const { tokens: dTokens, pcts: dPcts, totalTokensT: activeTokensT } = normalizeDomainMixture(
    config.domainMixture,
    config.totalTokensT
  );

  const costChartData = [
    {
      name: 'Compute',
      fullName: 'Pre-Training Compute',
      cost: Math.round(econ.preTrainingComputeCostUSD),
      formatted: formatMoney(econ.preTrainingComputeCostUSD),
      share: Number(((econ.preTrainingComputeCostUSD / econ.grandTotalBuildCostUSD) * 100).toFixed(1)),
      fill: '#06b6d4',
    },
    {
      name: 'Data',
      fullName: 'Data & Synthesis',
      cost: Math.round(econ.dataAcquisitionCostUSD),
      formatted: formatMoney(econ.dataAcquisitionCostUSD),
      share: Number(((econ.dataAcquisitionCostUSD / econ.grandTotalBuildCostUSD) * 100).toFixed(1)),
      fill: '#3b82f6',
    },
    {
      name: 'Post-Train',
      fullName: 'Post-Training (SFT/RLVR)',
      cost: Math.round(econ.postTrainingCostUSD),
      formatted: formatMoney(econ.postTrainingCostUSD),
      share: Number(((econ.postTrainingCostUSD / econ.grandTotalBuildCostUSD) * 100).toFixed(1)),
      fill: '#8b5cf6',
    },
    {
      name: 'Power/Cooling',
      fullName: 'Power & Cooling (PUE 1.2)',
      cost: Math.round(econ.powerCoolingCostUSD),
      formatted: formatMoney(econ.powerCoolingCostUSD),
      share: Number(((econ.powerCoolingCostUSD / econ.grandTotalBuildCostUSD) * 100).toFixed(1)),
      fill: '#f59e0b',
    },
  ];

  const domainData = [
    {
      name: 'Web Crawl',
      pct: dPcts.webCrawl,
      tokensT: dTokens.webCrawl,
      fill: '#94a3b8',
    },
    {
      name: 'Code',
      pct: dPcts.code,
      tokensT: dTokens.code,
      fill: '#06b6d4',
    },
    {
      name: 'Math',
      pct: dPcts.math,
      tokensT: dTokens.math,
      fill: '#10b981',
    },
    {
      name: 'Science',
      pct: dPcts.science,
      tokensT: dTokens.science,
      fill: '#a855f7',
    },
    {
      name: 'Synth CoT',
      pct: dPcts.syntheticCoT,
      tokensT: dTokens.syntheticCoT,
      fill: '#f59e0b',
    },
    {
      name: 'Multilingual',
      pct: dPcts.multilingual,
      tokensT: dTokens.multilingual,
      fill: '#ec4899',
    },
    {
      name: 'Multimodal',
      pct: dPcts.multimodal,
      tokensT: dTokens.multimodal,
      fill: '#6366f1',
    },
  ];

  const memoryData = [
    { name: 'Training VRAM', value: Math.round(econ.trainingVramGB), unit: 'GB', fill: '#06b6d4' },
    { name: 'Inference VRAM', value: Math.round(econ.inferenceVramGB), unit: 'GB', fill: '#10b981' },
    { name: 'Weights', value: Math.round(econ.inferenceWeightGB), unit: 'GB', fill: '#8b5cf6' },
    { name: 'Activation', value: Math.round(econ.activationBufferGB), unit: 'GB', fill: '#3b82f6' },
    { name: 'KV Cache', value: Math.round(econ.kvCacheVramGB), unit: 'GB', fill: '#f59e0b' },
  ];

  const fullSpecification = {
    modelName: config.modelName,
    trainingDuration: {
      wallClockDays: Number(econ.trainingDays.toFixed(2)),
      wallClockHours: Number(econ.trainingHours.toFixed(1)),
      formattedDuration: formatTrainingDuration(econ.trainingHours),
      totalGpuHours: Math.round(econ.trainingHours * config.gpuCount),
    },
    modelArchitecture: {
      paradigm: config.paradigm,
      totalParametersB: econ.totalParamsB,
      activeParametersB: econ.activeParamsB,
      activeRatioPct: Math.round(config.activeParamRatio * 100),
      attention: config.attention,
      contextWindowK: config.contextWindowK,
      contextWindowFormatted: formatContextWindow(config.contextWindowK),
      numericPrecision: config.precision,
      optimizer: config.optimizer,
      license: config.license,
    },
    hardwareCluster: {
      accelerator: gpu.name,
      gpuCount: config.gpuCount,
      vramPerGpuGB: gpu.vramGB,
      achievedMfuPct: econ.mfuPct,
      powerDrawMegawatts: Number(econ.powerMegawatts.toFixed(2)),
      datacenterPue: 1.2,
      totalEnergyMWh: Math.round(econ.totalEnergyMWh),
      totalTrainingFlops: econ.totalFlops,
      trainingVramRequiredGB: Math.round(econ.trainingVramGB),
      checkpointStorageTB: Number(econ.trainingTotalStorageTB.toFixed(1)),
    },
    dataPipeline: {
      totalTokensTrillion: activeTokensT,
      effectiveTrainTokensT: Number((activeTokensT * (config.trainSplitPct / 100)).toFixed(2)),
      splits: {
        trainPct: config.trainSplitPct,
        valPct: config.valSplitPct,
        testPct: config.testSplitPct,
      },
      chinchillaRatio: econ.chinchillaRatio,
      chinchillaStatus: econ.chinchillaStatus,
      decontaminationFilter: config.decontaminationFilter,
      domainMixture: config.domainMixture,
    },
    postTraining: {
      sftRounds: config.sftRounds,
      rlhfAlignment: config.rlhfAlignment,
      rlvrEffort: config.rlvrEffort,
    },
    costEconomicsUSD: {
      preTrainingComputeUSD: Math.round(econ.preTrainingComputeCostUSD),
      dataAcquisitionUSD: Math.round(econ.dataAcquisitionCostUSD),
      postTrainingUSD: Math.round(econ.postTrainingCostUSD),
      powerCoolingUSD: Math.round(econ.powerCoolingCostUSD),
      grandTotalBuildCostUSD: Math.round(econ.grandTotalBuildCostUSD),
    },
    inferenceDeployment: {
      canRunBadge: econ.canRunOnBadge,
      inferenceVramGB: econ.inferenceVramGB,
      kvCacheVramGB: Number(econ.kvCacheVramGB.toFixed(1)),
      inferenceSystemRamGB: econ.inferenceSystemRamGB,
      inferenceDiskGB: econ.inferenceDiskSpaceGB,
      outputSpeedTokPerSec: econ.predictedOutputSpeedTokPerSec,
      ttftSec: econ.predictedTtftSec,
      inputTokenPricePer1M: econ.inputTokenPricePer1M,
      outputTokenPricePer1M: econ.outputTokenPricePer1M,
      blendedPricePer1M: econ.blendedPricePer1M,
      costPerTaskUSD: econ.costPerTaskUSD,
    },
    evaluationResults: {
      predictedIntelligenceIndex: econ.predictedIntelligenceIndex,
      userRank,
      subScores: econ.subScores,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fullSpecification, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const jsonStr = JSON.stringify(fullSpecification, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="settings-dossier" className="mt-8 space-y-6">
      {/* Dossier Section Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                Run Dossier &amp; Parameter Matrix
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Audited Simulation Spec
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Complete Training Settings &amp; Resource Allocation Breakdown
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Detailed configuration sheet detailing wall-clock training duration, accelerator sizing, data mixtures, and hyperparameter choices.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Copied JSON!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Settings JSON</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Spec (.json)</span>
          </button>
        </div>
      </div>

      {/* Hero Training Time & Run Result Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase flex items-center gap-1 text-cyan-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              Time Took To Train
            </span>
            <span className="text-emerald-400 text-[10px]">Converged</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatTrainingDuration(econ.trainingHours)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {econ.trainingDays.toFixed(1)} Days • {Math.round(econ.trainingHours).toLocaleString()} Hours @ {econ.mfuPct}% MFU
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase text-emerald-400 flex items-center gap-1 font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              Total Run Investment
            </span>
            <span className="text-[10px] text-slate-400">CapEx / OpEx</span>
          </div>
          <div className="text-xl font-bold text-emerald-300">
            {formatMoney(econ.grandTotalBuildCostUSD)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Compute: {formatMoney(econ.preTrainingComputeCostUSD)} • Data: {formatMoney(econ.dataAcquisitionCostUSD)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase text-purple-400 flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5" />
              Compute &amp; Energy
            </span>
            <span className="text-[10px] text-slate-400">Cluster FLOPs</span>
          </div>
          <div className="text-xl font-bold text-purple-300">
            {econ.totalFlops.toExponential(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round(econ.totalEnergyMWh).toLocaleString()} MWh • {econ.powerMegawatts.toFixed(2)} MW draw
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase text-amber-400 flex items-center gap-1 font-bold">
              <Trophy className="w-3.5 h-3.5" />
              Final Intelligence
            </span>
            <span className="text-[10px] text-cyan-300 font-bold">Rank #{userRank}</span>
          </div>
          <div className="text-xl font-bold text-white">
            {econ.predictedIntelligenceIndex} <span className="text-xs text-slate-400 font-normal">AA Index</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Speed: {econ.predictedOutputSpeedTokPerSec} tok/s • TTFT: {econ.predictedTtftSec}s
          </div>
        </div>
      </div>

      {/* Visual Charts: Settings & Allocation Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Settings &amp; Resource Allocation Visualizations</span>
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              Interactive visual breakdown of training costs, data pipeline allocation, and memory distribution.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'budget'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Training Budget Breakdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'data'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Data Pipeline Mixture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('memory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'memory'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Memory &amp; Footprint
            </button>
          </div>
        </div>

        {/* Tab 1: Training Budget Breakdown Chart */}
        {activeTab === 'budget' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <span>
                Total Build Investment: <strong className="text-emerald-400">{formatMoney(econ.grandTotalBuildCostUSD)}</strong>
              </span>
              <span>
                Total Wall-Clock Training Duration:{' '}
                <strong className="text-cyan-300">{formatTrainingDuration(econ.trainingHours)}</strong>
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costChartData} margin={{ top: 12, right: 16, left: 16, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    tickFormatter={(v) => formatMoney(v)}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${formatMoney(Number(val))} (${item.payload.share}% of total)`,
                      item.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                    {costChartData.map((entry, index) => (
                      <Cell key={`cost-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              {costChartData.map((item) => (
                <div key={item.name} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{item.fullName}</div>
                  <div className="font-bold text-white">{item.formatted}</div>
                  <div className="text-[10px] text-cyan-400">{item.share}% of budget</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Data Pipeline Mixture Chart */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <span>
                Total Dataset Volume:{' '}
                <strong className="text-cyan-300">
                  {activeTokensT} Trillion Tokens ({econ.datasetStorageTB.toFixed(1)} TB NVMe)
                </strong>
              </span>
              <span>
                Effective Training Split:{' '}
                <strong className="text-white">
                  {(activeTokensT * (config.trainSplitPct / 100)).toFixed(2)}T ({config.trainSplitPct}%)
                </strong>
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData} margin={{ top: 12, right: 16, left: 16, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val}% (${item.payload.tokensT} Trillion tokens)`,
                      item.payload.name,
                    ]}
                  />
                  <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                    {domainData.map((entry, index) => (
                      <Cell key={`domain-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 font-mono text-xs">
              {domainData.map((d) => (
                <div key={d.name} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{d.name}</div>
                  <div className="font-bold text-white">{d.pct}%</div>
                  <div className="text-[10px] text-emerald-400">{d.tokensT}T tokens</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Memory Footprint & Hardware Sizing Chart */}
        {activeTab === 'memory' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <span>
                Cluster Hardware: <strong className="text-white">{config.gpuCount.toLocaleString()}x {gpu.name}</strong>
              </span>
              <span>
                Serving Footprint: <strong className="text-amber-300">{econ.canRunOnBadge}</strong>
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memoryData} margin={{ top: 12, right: 16, left: 16, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    tickFormatter={(v) => `${v} GB`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any) => [`${val} GB`, 'Memory Required']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {memoryData.map((entry, index) => (
                      <Cell key={`mem-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-xs">
              {memoryData.map((m) => (
                <div key={m.name} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{m.name}</div>
                  <div className="font-bold text-white">{m.value} GB</div>
                  <div className="text-[10px] text-cyan-400">{(m.value / 1024).toFixed(2)} TB</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5-Column Complete Settings Specification Details Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-xs font-mono">
        {/* Panel 1: Model Architecture Settings */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase pb-2 border-b border-slate-800">
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Architecture Settings</span>
            </div>
            <div className="divide-y divide-slate-800/60 pt-1 space-y-1.5 text-[11px]">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Model Name:</span>
                <span className="text-white font-bold truncate max-w-[120px]">{config.modelName}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Paradigm:</span>
                <span className="text-cyan-300 font-semibold">{config.paradigm}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Total Params:</span>
                <span className="text-white font-bold">
                  {econ.totalParamsB >= 1000 ? `${(econ.totalParamsB / 1000).toFixed(2)}T` : `${econ.totalParamsB}B`}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Active Params:</span>
                <span className="text-slate-200">
                  {econ.activeParamsB}B ({Math.round(config.activeParamRatio * 100)}%)
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Attention:</span>
                <span className="text-purple-300">{config.attention}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Context Window:</span>
                <span className="text-slate-200">{formatContextWindow(config.contextWindowK)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Precision:</span>
                <span className="text-amber-300 font-semibold">{config.precision}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Optimizer:</span>
                <span className="text-emerald-300">{config.optimizer}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">License:</span>
                <span className="text-slate-200">{config.license}</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
            State Memory: {econ.weightBytesPerParam}B weights + {econ.gradBytesPerParam}B grads + {econ.optBytesPerParam}B opt
          </div>
        </div>

        {/* Panel 2: Training Duration & Compute Dynamics */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3 flex flex-col justify-between shadow-[0_0_15px_rgba(6,182,212,0.08)]">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase pb-2 border-b border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Training Duration</span>
            </div>
            <div className="divide-y divide-slate-800/60 pt-1 space-y-1.5 text-[11px]">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Time To Train:</span>
                <span className="text-cyan-300 font-bold">{formatTrainingDuration(econ.trainingHours)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Wall-Clock Days:</span>
                <span className="text-white font-semibold">{econ.trainingDays.toFixed(2)} Days</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Cluster Hours:</span>
                <span className="text-slate-200">{Math.round(econ.trainingHours).toLocaleString()} hrs</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Total GPU Hours:</span>
                <span className="text-slate-200">{Math.round(econ.trainingHours * config.gpuCount).toLocaleString()} GPU-hrs</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Total FLOPs:</span>
                <span className="text-purple-300">{econ.totalFlops.toExponential(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Dataset Tokens:</span>
                <span className="text-slate-200">{activeTokensT} Trillion ({econ.datasetStorageTB.toFixed(1)} TB)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Split (Tr/Val/Ts):</span>
                <span className="text-slate-200">{config.trainSplitPct}% / {config.valSplitPct}% / {config.testSplitPct}%</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Chinchilla Ratio:</span>
                <span className="text-emerald-300 font-bold">{econ.chinchillaRatio}x</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Decontamination:</span>
                <span className={config.decontaminationFilter ? 'text-emerald-300' : 'text-rose-300'}>
                  {config.decontaminationFilter ? 'Enabled' : 'Off (-2.5)'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300">
            {econ.chinchillaStatus}
          </div>
        </div>

        {/* Panel 3: Datacenter Cluster & Hardware Specs */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase pb-2 border-b border-slate-800">
              <Server className="w-3.5 h-3.5" />
              <span>3. Cluster &amp; Hardware</span>
            </div>
            <div className="divide-y divide-slate-800/60 pt-1 space-y-1.5 text-[11px]">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">GPU Accelerator:</span>
                <span className="text-white font-semibold">{gpu.name.split(' (')[0]}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">GPU Cluster Size:</span>
                <span className="text-cyan-300 font-bold">{config.gpuCount.toLocaleString()} Accelerators</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Memory Per GPU:</span>
                <span className="text-slate-200">{gpu.vramGB} GB HBM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Peak Cluster TFLOPS:</span>
                <span className="text-white font-bold">
                  {(
                    (config.gpuCount *
                      (config.precision === 'FP8' || config.precision === 'INT4' || config.precision === 'INT8'
                        ? gpu.fp8Tflops
                        : gpu.bf16Tflops)) /
                    1000
                  ).toFixed(1)}{' '}
                  PFLOPS
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Achieved MFU:</span>
                <span className="text-emerald-300 font-bold">{econ.mfuPct}%</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Power Draw:</span>
                <span className="text-amber-300">{econ.powerMegawatts.toFixed(2)} MW</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Datacenter PUE:</span>
                <span className="text-slate-200">1.20</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Total Energy:</span>
                <span className="text-slate-200">{Math.round(econ.totalEnergyMWh).toLocaleString()} MWh</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Interconnect:</span>
                <span className="text-slate-300 truncate max-w-[120px]">{gpu.interconnect}</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
            Training VRAM: {econ.trainingVramTB >= 1 ? `${econ.trainingVramTB.toFixed(2)} TB` : `${econ.trainingVramGB.toFixed(0)} GB`} (Fit Verified)
          </div>
        </div>

        {/* Panel 4: Post-Training, Alignment & Costs */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase pb-2 border-b border-slate-800">
              <DollarSign className="w-3.5 h-3.5" />
              <span>4. Alignment &amp; Budget</span>
            </div>
            <div className="divide-y divide-slate-800/60 pt-1 space-y-1.5 text-[11px]">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Build Investment:</span>
                <span className="text-emerald-300 font-bold">{formatMoney(econ.grandTotalBuildCostUSD)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Compute Cost:</span>
                <span className="text-slate-200">{formatMoney(econ.preTrainingComputeCostUSD)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Data &amp; Synth:</span>
                <span className="text-slate-200">{formatMoney(econ.dataAcquisitionCostUSD)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Post-Training Cost:</span>
                <span className="text-slate-200">{formatMoney(econ.postTrainingCostUSD)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Power &amp; Cooling:</span>
                <span className="text-slate-200">{formatMoney(econ.powerCoolingCostUSD)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">SFT Curriculum:</span>
                <span className="text-purple-300">{config.sftRounds} Rounds</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">RLHF Alignment:</span>
                <span className="text-purple-300">Level {config.rlhfAlignment} / 5</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">RLVR Thinking:</span>
                <span className="text-amber-300 font-bold">{config.rlvrEffort}</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-300">
            RLVR Multiplier: {config.rlvrEffort === 'Max' ? '14.5x (+14.5 pts max)' : config.rlvrEffort === 'Xhigh' ? '8.6x (+10.8 pts max)' : config.rlvrEffort === 'High' ? '4.8x (+7.2 pts max)' : config.rlvrEffort === 'Medium' ? '2.3x (+3.5 pts max)' : '1.0x (+0.0 pts)'}
          </div>
        </div>

        {/* Panel 5: Inference, Deployment & Unit Economics */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase pb-2 border-b border-slate-800">
              <Zap className="w-3.5 h-3.5" />
              <span>5. Serving Economics</span>
            </div>
            <div className="divide-y divide-slate-800/60 pt-1 space-y-1.5 text-[11px]">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Inference VRAM:</span>
                <span className="text-cyan-300 font-bold">{econ.inferenceVramGB} GB</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">KV Cache Overhead:</span>
                <span className="text-slate-200">{econ.kvCacheVramGB.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">System RAM:</span>
                <span className="text-slate-200">{econ.inferenceSystemRamGB} GB</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Disk Space:</span>
                <span className="text-slate-200">{econ.inferenceDiskSpaceGB} GB</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Output Speed:</span>
                <span className="text-emerald-300 font-bold">{econ.predictedOutputSpeedTokPerSec} tok/s</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">TTFT Latency:</span>
                <span className="text-amber-300">{econ.predictedTtftSec}s</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Input Token ($/1M):</span>
                <span className="text-slate-200">${econ.inputTokenPricePer1M.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Output Token ($/1M):</span>
                <span className="text-slate-200">${econ.outputTokenPricePer1M.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Cost Per Task:</span>
                <span className="text-amber-300 font-bold">${econ.costPerTaskUSD.toFixed(4)}</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 truncate" title={econ.canRunOnBadge}>
            Target: {econ.canRunOnBadge}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Module4Leaderboard ---
interface Module4LeaderboardProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  savedUserModels: CompetitorModel[];
  onSaveCurrentModel: () => void;
  onPrevStage: () => void;
}

type SortKey =
  | 'intelligenceIndex'
  | 'outputSpeed'
  | 'blendedPrice'
  | 'costPerTask'
  | 'inferenceVramGB';

export const Module4Leaderboard: React.FC<Module4LeaderboardProps> = ({
  config,
  econ,
  savedUserModels,
  onSaveCurrentModel,
  onPrevStage,
}) => {
  const [licenseFilter, setLicenseFilter] = useState<'All' | 'Proprietary' | 'Open Weights'>('All');
  const [includeOutliers, setIncludeOutliers] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortKey>('intelligenceIndex');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [scatterXMetric, setScatterXMetric] = useState<
    'outputSpeed' | 'blendedPrice' | 'costPerTask' | 'inferenceVramGB'
  >('outputSpeed');
  const [radarOpponentId, setRadarOpponentId] = useState<string>('claude-opus-5-5-max');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Construct live user model entry
  const liveUserModel: CompetitorModel = useMemo(
    () => ({
      rank: null,
      id: 'user-live-model',
      name: `${config.modelName} ★`,
      creator: 'Your Frontier Lab',
      license: config.license,
      intelligenceIndex: econ.predictedIntelligenceIndex,
      outputSpeed: econ.predictedOutputSpeedTokPerSec,
      ttft: econ.predictedTtftSec,
      inputPrice: econ.inputTokenPricePer1M,
      outputPrice: econ.outputTokenPricePer1M,
      blendedPrice: econ.blendedPricePer1M,
      costPerTask: econ.costPerTaskUSD,
      contextWindow: econ.contextWindowLabel,
      contextTokens: config.contextWindowK * 1000,
      archSummary: `${config.paradigm} (${econ.totalParamsB >= 1000 ? `${(econ.totalParamsB / 1000).toFixed(2)}T` : `${econ.totalParamsB}B`} / ${econ.inferenceVramGB} GB VRAM)`,
      paradigm: config.paradigm,
      totalParamsB: econ.totalParamsB,
      activeParamsB: econ.activeParamsB,
      inferenceVramGB: econ.inferenceVramGB,
      inferenceDiskGB: econ.inferenceDiskSpaceGB,
      canRunOnBadge: econ.canRunOnBadge,
      isUserModel: true,
      contaminWarning: !config.decontaminationFilter,
      subScores: econ.subScores,
    }),
    [config, econ]
  );

  const allModels = useMemo(() => {
    const merged = [
      liveUserModel,
      ...savedUserModels.filter((m) => m.name !== liveUserModel.name),
      ...COMPETITOR_MODELS,
    ];
    // Assign dynamic rank by Intelligence Index descending
    const rankedByIndex = [...merged].sort(
      (a, b) => b.intelligenceIndex - a.intelligenceIndex
    );
    const rankMap = new Map<string, number>();
    rankedByIndex.forEach((m, i) => rankMap.set(m.id, i + 1));

    return merged
      .map((m) => ({ ...m, rank: rankMap.get(m.id) || 99 }))
      .filter((m) => {
        if (!includeOutliers && m.isOutlier) return false;
        if (licenseFilter !== 'All' && m.license !== licenseFilter) return false;
        if (
          searchQuery.trim() &&
          !`${m.name} ${m.creator} ${m.archSummary}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortBy] ?? 0;
        const valB = b[sortBy] ?? 0;
        const diff = (valA as number) - (valB as number);
        return sortAsc ? diff : -diff;
      });
  }, [
    liveUserModel,
    savedUserModels,
    includeOutliers,
    licenseFilter,
    searchQuery,
    sortBy,
    sortAsc,
  ]);

  const userRank =
    allModels.find((m) => m.id === 'user-live-model')?.rank || 1;

  // Top models for Horizontal Ranked Bar Chart (always includes liveUserModel)
  const barChartModels = useMemo(() => {
    const top = [...allModels]
      .sort((a, b) => b.intelligenceIndex - a.intelligenceIndex)
      .slice(0, 12);
    if (!top.some((m) => m.id === 'user-live-model')) {
      const userRanked = allModels.find((m) => m.id === 'user-live-model');
      if (userRanked) {
        top.push(userRanked);
      }
    }
    return top.sort((a, b) => b.intelligenceIndex - a.intelligenceIndex);
  }, [allModels, liveUserModel]);

  // Radar comparison data
  const opponentModel =
    COMPETITOR_MODELS.find((m) => m.id === radarOpponentId) ||
    COMPETITOR_MODELS[0];
  const deepseekRef =
    COMPETITOR_MODELS.find((m) => m.id === 'deepseek-v3-2-2501') ||
    COMPETITOR_MODELS[6] ||
    COMPETITOR_MODELS[0];

  const radarData = [
    {
      domain: 'Math (AIME)',
      user: liveUserModel.subScores.math,
      opponent: opponentModel.subScores.math,
      deepseek: deepseekRef.subScores.math,
    },
    {
      domain: 'Coding (SWE)',
      user: liveUserModel.subScores.coding,
      opponent: opponentModel.subScores.coding,
      deepseek: deepseekRef.subScores.coding,
    },
    {
      domain: 'Science (GPQA)',
      user: liveUserModel.subScores.science,
      opponent: opponentModel.subScores.science,
      deepseek: deepseekRef.subScores.science,
    },
    {
      domain: 'Humanities & Lore',
      user: liveUserModel.subScores.humanities,
      opponent: opponentModel.subScores.humanities ?? 88.5,
      deepseek: deepseekRef.subScores.humanities ?? 91.2,
    },
    {
      domain: '1M Context',
      user: liveUserModel.subScores.longContext,
      opponent: opponentModel.subScores.longContext,
      deepseek: deepseekRef.subScores.longContext,
    },
    {
      domain: 'Multilingual',
      user: liveUserModel.subScores.multilingual,
      opponent: opponentModel.subScores.multilingual,
      deepseek: deepseekRef.subScores.multilingual,
    },
    {
      domain: 'Multimodal',
      user: liveUserModel.subScores.multimodal,
      opponent: opponentModel.subScores.multimodal,
      deepseek: deepseekRef.subScores.multimodal,
    },
  ];

  const handleSortClick = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortBy(key);
      setSortAsc(key === 'blendedPrice' || key === 'costPerTask' || key === 'inferenceVramGB');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Leaderboard Header */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Stage 04 // Artificial Analysis Leaderboard (Live Evaluation Suite)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Quality vs. Throughput &amp; Price Pareto Frontiers — Global Rank #{userRank}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onPrevStage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Training Telemetry</span>
          </button>
          <a
            href="#settings-dossier"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition"
          >
            <FileText className="w-4 h-4" />
            <span>Settings Dossier &amp; Charts</span>
          </a>
          <button
            type="button"
            onClick={onSaveCurrentModel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pin Snapshot to Leaderboard ({savedUserModels.length} Saved)</span>
          </button>
        </div>
      </div>

      {/* User Model Executive Benchmark Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/50 border border-cyan-500/50 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 font-mono">
        <div>
          <span className="text-[10px] text-cyan-300 uppercase block">Your Model Rank</span>
          <span className="text-lg font-bold text-white">
            #{userRank} <span className="text-xs text-slate-400">of {allModels.length}</span>
          </span>
          <span className="text-[11px] text-cyan-300 truncate block">{config.modelName}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">AA Intelligence Index</span>
          <span className="text-lg font-bold text-emerald-300">
            {liveUserModel.intelligenceIndex}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {liveUserModel.intelligenceIndex > 58.0
              ? 'New #1 World Record!'
              : `${(58.0 - liveUserModel.intelligenceIndex).toFixed(1)} pts behind Claude Opus 5.5 (Max)`}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-cyan-400 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            Training Time
          </span>
          <span className="text-lg font-bold text-white">
            {econ.trainingDays >= 1 ? `${econ.trainingDays.toFixed(1)} Days` : `${econ.trainingHours.toFixed(1)} Hrs`}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {Math.round(econ.trainingHours).toLocaleString()} hrs @ {econ.mfuPct}% MFU
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Output Throughput</span>
          <span className="text-lg font-bold text-cyan-300">
            {liveUserModel.outputSpeed} tok/s
          </span>
          <span className="text-[10px] text-slate-400 block">
            TTFT: {liveUserModel.ttft}s
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Input / Output ($/1M)</span>
          <span className="text-lg font-bold text-purple-300">
            ${liveUserModel.inputPrice.toFixed(2)} / ${liveUserModel.outputPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Blended: ${liveUserModel.blendedPrice.toFixed(2)}/1M
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Cost Per Index Task</span>
          <span className="text-lg font-bold text-amber-300">
            ${liveUserModel.costPerTask.toFixed(4)}
          </span>
          <span className="text-[10px] text-slate-400 block">
            RLVR Effort: {config.rlvrEffort}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Inference VRAM &amp; Target</span>
          <span className="text-lg font-bold text-white">
            {liveUserModel.inferenceVramGB} GB
          </span>
          <span className="text-[10px] text-emerald-300 truncate block" title={liveUserModel.canRunOnBadge}>
            {liveUserModel.canRunOnBadge}
          </span>
        </div>
      </div>

      {/* Row 1 Charts: Pareto Scatter Plot + Sub-Benchmark Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Plot: Quality vs. Speed / Price / Cost-per-Task / VRAM */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <ScatterIcon className="w-4 h-4 text-cyan-400" />
                <span>Artificial Analysis Pareto Frontier</span>
                <SettingTooltip id="scatterAxisMode" />
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Y-Axis: AA Intelligence Index (Calibrated 0 – 62) • Cyan Star = Your Model
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { key: 'outputSpeed', label: 'Speed (tok/s)' },
                  { key: 'blendedPrice', label: 'Price ($/1M)' },
                  { key: 'costPerTask', label: 'Cost/Task ($)' },
                  { key: 'inferenceVramGB', label: 'Run VRAM (GB)' },
                ] as const
              ).map((axis) => (
                <button
                  key={axis.key}
                  type="button"
                  onClick={() => setScatterXMetric(axis.key)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition ${
                    scatterXMetric === axis.key
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {axis.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, bottom: 16, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey={scatterXMetric}
                  name={scatterXMetric}
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="intelligenceIndex"
                  name="AA Intelligence Index"
                  domain={[0, 62]}
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <ZAxis range={[65, 160]} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const m = payload[0].payload as CompetitorModel;
                    return (
                      <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-700 shadow-xl font-mono text-xs space-y-1">
                        <div className="font-bold text-cyan-300">{m.name}</div>
                        <div className="text-slate-400 text-[11px]">
                          {m.creator} • {m.license}
                        </div>
                        <div className="text-white">
                          AA Index: <strong className="text-emerald-300">{m.intelligenceIndex}</strong>
                        </div>
                        <div className="text-slate-300">
                          Speed: {m.outputSpeed} tok/s • Blended: ${m.blendedPrice.toFixed(2)}/1M
                        </div>
                        <div className="text-slate-300">
                          Task Cost: ${m.costPerTask.toFixed(4)} • VRAM: {m.inferenceVramGB} GB
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter name="Models" data={allModels}>
                  {allModels.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={
                        entry.isUserModel
                          ? '#22d3ee'
                          : entry.license === 'Open Weights'
                            ? '#34d399'
                            : '#a855f7'
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
              Your Simulated Model
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              Proprietary Frontier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              Open Weights
            </span>
          </div>
        </div>

        {/* Radar Chart: 6-Domain Capability Comparison */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <RadarIcon className="w-4 h-4 text-emerald-400" />
                <span>Sub-Benchmark Capability Radar</span>
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Compare against Top Benchmark Models
              </p>
            </div>

            <select
              aria-label="Select radar opponent model"
              value={radarOpponentId}
              onChange={(e) => setRadarOpponentId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
            >
              {COMPETITOR_MODELS.slice(0, 15).map((m) => (
                <option key={m.id} value={m.id}>
                  vs. {m.name} ({m.intelligenceIndex})
                </option>
              ))}
            </select>
          </div>

          <div className="relative h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'monospace' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  name={liveUserModel.name}
                  dataKey="user"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.35}
                />
                <Radar
                  name={opponentModel.name}
                  dataKey="opponent"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.2}
                />
                <Radar
                  name={deepseekRef.name}
                  dataKey="deepseek"
                  stroke="#34d399"
                  fill="#34d399"
                  fillOpacity={0.12}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Horizontal Ranked Bar Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Artificial Analysis Intelligence Index Ranking (Top Frontier + Your Model)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Current Artificial Analysis Evaluation Scale
          </span>
        </div>

        <div className="relative h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartModels}
              layout="vertical"
              margin={{ top: 4, right: 28, left: 20, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 62]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={175}
                stroke="#94a3b8"
                tick={{ fill: '#e2e8f0', fontSize: 11, fontFamily: 'monospace' }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="intelligenceIndex" name="AA Intelligence Index" radius={[0, 6, 6, 0]}>
                {barChartModels.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={
                      entry.isUserModel
                        ? '#22d3ee'
                        : entry.license === 'Open Weights'
                          ? '#34d399'
                          : '#6366f1'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Sortable & Filterable Leaderboard Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Complete Artificial Analysis Leaderboard ({allModels.length} Models)
            </h3>
            {(['All', 'Proprietary', 'Open Weights'] as const).map((lic) => (
              <button
                key={lic}
                type="button"
                onClick={() => setLicenseFilter(lic)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition ${
                  licenseFilter === lic
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {lic}
              </button>
            ))}
            <label className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 ml-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeOutliers}
                onChange={(e) => setIncludeOutliers(e.target.checked)}
                className="rounded accent-cyan-400"
              />
              <span>Include Speed/Price Outliers</span>
            </label>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models, creators..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Model Name</th>
                <th className="py-2.5 px-3">Creator / License</th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSortClick('intelligenceIndex')}
                    className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold"
                  >
                    <span>AA Index</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSortClick('outputSpeed')}
                    className="inline-flex items-center gap-1 text-cyan-300 hover:text-white font-bold"
                  >
                    <span>Speed (tok/s)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSortClick('blendedPrice')}
                    className="inline-flex items-center gap-1 text-purple-300 hover:text-white font-bold"
                  >
                    <span>In / Out ($/1M)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSortClick('costPerTask')}
                    className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-bold"
                  >
                    <span>Cost/Task</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3">Context</th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSortClick('inferenceVramGB')}
                    className="inline-flex items-center gap-1 text-slate-200 hover:text-white font-bold"
                  >
                    <span>Hardware to Run (VRAM / Disk)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {allModels.map((m) => (
                <tr
                  key={m.id}
                  className={
                    m.isUserModel
                      ? 'bg-cyan-500/15 border-l-4 border-l-cyan-400'
                      : 'hover:bg-slate-950/60 transition'
                  }
                >
                  <td className="py-2.5 px-3 font-bold text-slate-300">
                    #{m.rank}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{m.name}</span>
                      {m.isUserModel && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/30 text-cyan-200 border border-cyan-400/50">
                          YOUR BUILD
                        </span>
                      )}
                      {m.contaminWarning && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Unfiltered (-2.5)
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{m.archSummary}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{m.creator}</div>
                    <span
                      className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] ${
                        m.license === 'Open Weights'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {m.license}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-sm font-bold text-emerald-300">
                      {m.intelligenceIndex.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-cyan-300">{m.outputSpeed} tok/s</span>
                    <span className="block text-[10px] text-slate-400">
                      TTFT {m.ttft}s
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-100 font-semibold">
                      ${m.inputPrice.toFixed(2)} / ${m.outputPrice.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-purple-300">
                      Blended: ${m.blendedPrice.toFixed(2)}/1M
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-300">
                    ${m.costPerTask.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{m.contextWindow}</td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-100 font-semibold">
                      {m.inferenceVramGB} GB VRAM • {m.inferenceDiskGB} GB Disk
                    </div>
                    <div className="text-[10px] text-cyan-300">{m.canRunOnBadge}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Training Run Dossier & Parameter Specification Matrix */}
      <TrainingSettingsDossier config={config} econ={econ} userRank={userRank} />
    </div>
  );
};
