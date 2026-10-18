'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Server,
  Cpu,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SimulatorConfig, EconomicsBreakdown } from '../types/simulator';
import { GPU_SPECS } from '../data/constants';
import { formatMoney, formatMemoryGB } from '../lib/simulationEngine';

interface HardwareEconomicsDockProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
}

export const HardwareEconomicsDock: React.FC<HardwareEconomicsDockProps> = ({
  config,
  econ,
}) => {
  const [expanded, setExpanded] = useState(true);
  const gpu = GPU_SPECS[config.gpuType];

  const badgeToneClasses =
    econ.canRunTierColor === 'emerald'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
      : econ.canRunTierColor === 'cyan'
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
        : econ.canRunTierColor === 'amber'
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
          : 'bg-rose-500/15 text-rose-300 border-rose-500/40';

  return (
    <aside
      aria-label="Real-Time Hardware Footprint & Economics Dock"
      className="sticky bottom-0 z-40 w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-10px_35px_rgba(0,0,0,0.65)]"
    >
      {/* Top Compact Summary Strip */}
      <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200">
              Hardware &amp; Economics Engine
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${badgeToneClasses}`}
          >
            {econ.canRunOnBadge}
          </span>

          {!econ.clusterFitsMemory ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="w-3.5 h-3.5" />
              Cluster VRAM Deficit: Need &ge;{econ.minGpusToFitMemory.toLocaleString()}x {gpu.id}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ZeRO-3 / FSDP Fit Verified ({config.gpuCount.toLocaleString()} GPUs)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Model: </span>
            <span className="text-white font-bold">
              {econ.totalParamsB >= 1000
                ? `${(econ.totalParamsB / 1000).toFixed(1)}T`
                : `${econ.totalParamsB}B`}
              {econ.activeParamsB < econ.totalParamsB ? (
                <span className="text-cyan-400 font-normal ml-1">
                  ({econ.activeParamsB}B active)
                </span>
              ) : (
                <span className="text-slate-400 font-normal ml-1">(Dense)</span>
              )}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Build Total: </span>
            <span className="text-emerald-400 font-bold">
              {formatMoney(econ.grandTotalBuildCostUSD)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Train Time: </span>
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {econ.trainingDays >= 1 ? `${econ.trainingDays.toFixed(1)}d` : `${econ.trainingHours.toFixed(1)}h`}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Train VRAM: </span>
            <span className="text-cyan-300 font-bold">
              {econ.trainingVramTB >= 1
                ? `${econ.trainingVramTB.toFixed(2)} TB`
                : `${econ.trainingVramGB.toFixed(0)} GB`}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Run VRAM: </span>
            <span className="text-amber-300 font-bold">{econ.inferenceVramGB} GB</span>
          </div>
          <div>
            <span className="text-slate-400">API (In/Out): </span>
            <span className="text-purple-300 font-bold">
              ${econ.inputTokenPricePer1M.toFixed(2)} / ${econ.outputTokenPricePer1M.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Pred. AA Index: </span>
            <span className="text-white font-bold bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded">
              {econ.predictedIntelligenceIndex}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition"
          >
            {expanded ? (
              <>
                <span>Collapse Dock</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Expand Full Telemetry</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4-Column Detailed Engineering Grid */}
      {expanded && (
        <div className="max-w-[1600px] mx-auto px-4 py-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
          {/* Card A: Total Cost to Make (Build CapEx / OpEx Breakdown) */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  A. Total Cost to Make (CapEx/OpEx)
                </span>
                <span className="font-mono text-sm font-bold text-emerald-300">
                  {formatMoney(econ.grandTotalBuildCostUSD)}
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pre-Training Cluster Compute:</span>
                  <span className="text-slate-100 font-semibold">
                    {formatMoney(econ.preTrainingComputeCostUSD)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data &amp; Synthetic CoT Gen:</span>
                  <span className="text-slate-100 font-semibold">
                    {formatMoney(econ.dataAcquisitionCostUSD)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Post-Training (SFT/RLHF/RLVR):</span>
                  <span className="text-slate-100 font-semibold">
                    {formatMoney(econ.postTrainingCostUSD)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Power &amp; Cooling (PUE 1.2):</span>
                  <span className="text-amber-300 font-semibold">
                    {formatMoney(econ.powerCoolingCostUSD)} ({Math.round(econ.totalEnergyMWh).toLocaleString()} MWh)
                  </span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-800/70 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-cyan-400 font-semibold">☁️ Cloud Rental:</span>
                    <span className="text-cyan-200 font-bold">{formatMoney(econ.procurement.cloudRentalTotalUSD)} ({formatMoney(econ.procurement.cloudRentalHourlyUSD)}/hr)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-purple-400 font-semibold">🏢 Owned CapEx:</span>
                    <span className="text-amber-300 font-bold">{formatMoney(econ.procurement.ownedHardwareCapExUSD)} (Breakeven: {econ.procurement.breakevenMonths} Mo)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Wall-Clock: {econ.trainingDays.toFixed(1)} days ({Math.round(econ.trainingHours).toLocaleString()} hrs)</span>
              <span>Power: {econ.powerMegawatts.toFixed(2)} MW @ {econ.mfuPct}% MFU</span>
            </div>
          </div>

          {/* Card B: Hardware Required TO TRAIN (Datacenter Cluster Specs) */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  B. Hardware Required TO TRAIN
                </span>
                <span className="font-mono text-xs font-bold text-cyan-300">
                  Min {econ.minGpusToFitMemory.toLocaleString()}x {gpu.id}
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Model Parameters:</span>
                  <span className="text-cyan-300 font-bold">
                    {econ.totalParamsB >= 1000 ? `${(econ.totalParamsB / 1000).toFixed(1)}T` : `${econ.totalParamsB}B`}
                    {econ.activeParamsB < econ.totalParamsB ? ` (${econ.activeParamsB}B active)` : ' (Dense)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Training VRAM Required:</span>
                  <span className="text-cyan-200 font-semibold">
                    {formatMemoryGB(econ.trainingVramGB)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Host System DDR5 RAM (1.5x):</span>
                  <span className="text-slate-100 font-semibold">
                    {econ.trainingSystemRamTB.toFixed(2)} TB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Server CPU Cores (16/GPU):</span>
                  <span className="text-slate-100 font-semibold">
                    {econ.trainingCpuCores.toLocaleString()} Cores
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Training NVMe Storage (5x Ckpt):</span>
                  <span className="text-slate-100 font-semibold">
                    {econ.trainingTotalStoragePB >= 1
                      ? `${econ.trainingTotalStoragePB.toFixed(2)} PB`
                      : `${econ.trainingTotalStorageTB.toFixed(1)} TB`}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>
                State: {econ.weightBytesPerParam}B Wt + {econ.gradBytesPerParam}B Grad + {econ.optBytesPerParam}B Opt (Bytes/param)
              </span>
              <span>Act Buf: {Math.round(econ.activationBufferGB)} GB</span>
            </div>
          </div>

          {/* Card C: Hardware Required TO RUN / INFERENCE (Deployment Specs) */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  C. Hardware Required TO RUN
                </span>
                <span className="font-mono text-xs font-bold text-amber-300">
                  {econ.inferenceVramGB} GB VRAM
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Model Scale:</span>
                  <span className="text-amber-300 font-bold">
                    {econ.totalParamsB >= 1000 ? `${(econ.totalParamsB / 1000).toFixed(1)}T` : `${econ.totalParamsB}B`} ({config.paradigm})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inference VRAM (1.15x + KV):</span>
                  <span className="text-amber-200 font-semibold">
                    {econ.inferenceVramGB} GB (KV: {econ.kvCacheVramGB.toFixed(1)} GB)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inference Host RAM (1.25x):</span>
                  <span className="text-slate-100 font-semibold">
                    {econ.inferenceSystemRamGB} GB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">vLLM / SGLang vCPUs:</span>
                  <span className="text-slate-100 font-semibold">
                    {econ.inferenceCpuCores} vCPUs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safetensors Disk Space:</span>
                  <span className="text-slate-100 font-semibold">
                    {econ.inferenceDiskSpaceGB >= 1024
                      ? `${(econ.inferenceDiskSpaceGB / 1024).toFixed(2)} TB`
                      : `${econ.inferenceDiskSpaceGB} GB`}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="truncate" title={econ.canRunOnBadge}>
                target: {econ.canRunOnBadge}
              </span>
            </div>
          </div>

          {/* Card D: API Token Pricing & Task Cost Calculator */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-purple-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  D. API Pricing &amp; Task Economics
                </span>
                <span className="font-mono text-xs font-bold text-purple-300">
                  ${econ.blendedPricePer1M.toFixed(2)}/1M Blended
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Input Token Price (Prefill):</span>
                  <span className="text-slate-100 font-semibold">
                    ${econ.inputTokenPricePer1M.toFixed(2)} / 1M tok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Output Token Price (Decode):</span>
                  <span className="text-slate-100 font-semibold">
                    ${econ.outputTokenPricePer1M.toFixed(2)} / 1M tok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blended Price (3:1 In/Out):</span>
                  <span className="text-purple-300 font-semibold">
                    ${econ.blendedPricePer1M.toFixed(2)} / 1M tok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Cost / Task (AA Avg):</span>
                  <span className="text-emerald-300 font-bold">
                    ${econ.costPerTaskUSD.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>RLVR Effort: {config.rlvrEffort}</span>
              <span>~{econ.avgOutputTokensPerTask.toLocaleString()} out tok/task</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
