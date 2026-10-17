'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
  FastForward,
  Pause,
  Play,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import {
  SimulatorConfig,
  EconomicsBreakdown,
  TelemetryPoint,
  TrainingEventAlert,
} from '../types/simulator';
import { GPU_SPECS, TRAINING_EVENTS } from '../data/constants';
import { formatTrainingDuration } from '../lib/simulationEngine';
import { SettingTooltip } from './SettingTooltip';

interface Module3LiveTrainingProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  eventBonusIndex: number;
  onUpdateEventBonus: (delta: number) => void;
  onCompleteRun: () => void;
  onPrevStage: () => void;
}

export const Module3LiveTraining: React.FC<Module3LiveTrainingProps> = ({
  config,
  econ,
  eventBonusIndex,
  onUpdateEventBonus,
  onCompleteRun,
  onPrevStage,
}) => {
  const [progress, setProgress] = useState<number>(100);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<1 | 5 | 20>(5);
  const [autoMitigate, setAutoMitigate] = useState<boolean>(true);
  const [activeAlert, setActiveAlert] = useState<TrainingEventAlert | null>(null);
  const [resolvedEvents, setResolvedEvents] = useState<string[]>([
    'grad-spike-28',
    'math-plateau-62',
  ]);
  const [logs, setLogs] = useState<string[]>([
    '[00:00] Initialized ZeRO-3 / FSDP shards across cluster fabric.',
    '[28:14] Auto-mitigated Gradient Spike via QK-LayerNorm & grad clipping.',
    '[62:40] Injected verified Synthetic CoT curriculum during Context Annealing.',
    '[100:00] RLVR GRPO verification complete. Checkpoint ready for Artificial Analysis.',
  ]);

  // Generate telemetry curve points up to current `progress`
  const telemetryData: TelemetryPoint[] = useMemo(() => {
    const points: TelemetryPoint[] = [];
    const targetFinalLoss = Math.max(
      1.05,
      2.65 - (econ.predictedIntelligenceIndex - 30) * 0.038
    );
    const maxStep = Math.max(2, progress);
    for (let s = 0; s <= maxStep; s += 2) {
      const t = s / 100;
      const stage =
        s < 60
          ? 'Pre-Training'
          : s < 75
            ? 'Context Annealing'
            : s < 88
              ? 'SFT'
              : 'RLVR';

      // Realistic exponential decay + slight wave
      const wave = Math.sin(s * 0.45) * 0.022;
      const trainLoss = Number(
        (targetFinalLoss + 4.2 * Math.exp(-3.6 * t) + wave).toFixed(3)
      );
      const valGap = config.decontaminationFilter ? 0.065 : -0.03; // Unfiltered leaks test set!
      const valLoss = Number(
        (trainLoss + valGap + 0.015 * Math.cos(s * 0.3)).toFixed(3)
      );
      const testLoss = Number(
        (
          trainLoss +
          0.085 +
          (config.decontaminationFilter ? 0.0 : 0.14) +
          0.012 * Math.sin(s * 0.25)
        ).toFixed(3)
      );
      const gradNorm = Number(
        (0.85 + 1.8 * Math.exp(-2.5 * t) + Math.abs(wave) * 4).toFixed(2)
      );
      const mfu = Number(
        (econ.mfuPct - 1.2 + Math.sin(s * 0.2) * 1.1).toFixed(1)
      );
      const mwDraw = Number(
        (econ.powerMegawatts * (0.96 + 0.04 * Math.sin(s * 0.3))).toFixed(2)
      );

      points.push({
        stepPct: s,
        stage,
        trainLoss,
        valLoss,
        testLoss,
        gradNorm,
        mfu,
        mwDraw,
      });
    }
    return points;
  }, [progress, econ.predictedIntelligenceIndex, econ.mfuPct, econ.powerMegawatts, config.decontaminationFilter]);

  useEffect(() => {
    if (!isRunning || activeAlert) return;
    if (progress >= 100) {
      setIsRunning(false);
      return;
    }

    const intervalMs = simSpeed === 1 ? 220 : simSpeed === 5 ? 70 : 25;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 2);
        // Check if an event triggers at this step
        const triggered = TRAINING_EVENTS.find(
          (ev) => next >= ev.stepPct && !resolvedEvents.includes(ev.id)
        );
        if (triggered) {
          if (autoMitigate) {
            setResolvedEvents((r) => [...r, triggered.id]);
            onUpdateEventBonus(triggered.options[0].indexDelta);
            setLogs((l) => [
              ...l,
              `[${next}%] Auto-Mitigated: ${triggered.title} -> ${triggered.options[0].label}`,
            ]);
          } else {
            setActiveAlert(triggered);
            setIsRunning(false);
          }
        }
        if (next === 100) {
          setLogs((l) => [
            ...l,
            '[100%] Multi-stage training & RLVR verification converged. Ready for evaluation.',
          ]);
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, progress, simSpeed, autoMitigate, activeAlert, resolvedEvents, onUpdateEventBonus]);

  const handleRestartSimulation = () => {
    setProgress(0);
    setResolvedEvents([]);
    setActiveAlert(null);
    onUpdateEventBonus(-eventBonusIndex);
    setLogs([
      `[0%] Starting live training run for ${config.modelName} on ${config.gpuCount.toLocaleString()}x ${GPU_SPECS[config.gpuType].id}...`,
    ]);
    setIsRunning(true);
  };

  const handleInstantFinish = () => {
    setActiveAlert(null);
    setResolvedEvents(TRAINING_EVENTS.map((e) => e.id));
    setProgress(100);
    setIsRunning(false);
    setLogs((l) => [
      ...l,
      '[100%] Instant convergence completed across Pre-Training, Context Annealing, SFT, and RLVR.',
    ]);
  };

  const currentPoint = telemetryData[telemetryData.length - 1] || {
    stepPct: 0,
    stage: 'Pre-Training',
    trainLoss: 6.4,
    valLoss: 6.5,
    testLoss: 6.55,
    gradNorm: 2.4,
    mfu: econ.mfuPct,
    mwDraw: econ.powerMegawatts,
  };

  const stages = [
    { name: '1. Pre-Training', start: 0, end: 60 },
    { name: '2. Context Annealing', start: 60, end: 75 },
    { name: '3. Supervised Fine-Tuning (SFT)', start: 75, end: 88 },
    { name: '4. RLVR Thinking Rollouts', start: 88, end: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Stage 03 // Live Training Simulator (Telemetry HUD)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Multi-Stage Loss Convergence, Token Ingestion &amp; Cluster Anomaly Mitigation
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onPrevStage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Data Pipeline</span>
          </button>
          <button
            type="button"
            onClick={onCompleteRun}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <span>Benchmark on Artificial Analysis Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Bar & Speed Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (progress >= 100) {
                handleRestartSimulation();
              } else {
                setIsRunning((r) => !r);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Telemetry</span>
              </>
            ) : progress >= 100 ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Training Run</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Run</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleInstantFinish}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Instant Converge (100%)</span>
          </button>

          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-800">
            <span className="text-xs font-mono text-slate-400 mr-1">
              Speed
              <SettingTooltip id="simSpeed" />
            </span>
            {([1, 5, 20] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSimSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition ${
                  simSpeed === spd
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoMitigate}
              onChange={(e) => setAutoMitigate(e.target.checked)}
              className="rounded accent-cyan-400"
            />
            <span>Auto-Mitigate Cluster Anomalies</span>
            <SettingTooltip id="autoMitigateEvents" />
          </label>
        </div>
      </div>

      {/* Interactive Mid-Training Anomaly Modal / Banner */}
      {activeAlert && (
        <div className="p-5 rounded-2xl bg-rose-950/50 border-2 border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.25)] space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-mono text-xs uppercase font-bold">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Mid-Training Telemetry Interrupt @ {activeAlert.stepPct}% Progress</span>
          </div>
          <h3 className="text-base font-bold text-white">{activeAlert.title}</h3>
          <p className="text-xs text-slate-200 leading-relaxed">{activeAlert.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {activeAlert.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onUpdateEventBonus(opt.indexDelta);
                  setResolvedEvents((r) => [...r, activeAlert.id]);
                  setLogs((l) => [
                    ...l,
                    `[${activeAlert.stepPct}%] Manual Action: ${opt.label} (${opt.effectDesc})`,
                  ]);
                  setActiveAlert(null);
                  setIsRunning(true);
                }}
                className="p-3 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-left transition"
              >
                <div className="font-mono text-xs font-bold text-cyan-300">
                  {opt.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{opt.effectDesc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Training Duration & Clock Tracker */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-cyan-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>Cluster Wall-Clock Training Time</span>
              {progress === 100 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  Run 100% Converged
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-2">
              <span>{formatTrainingDuration(econ.trainingHours)}</span>
              <span className="text-xs text-cyan-300 font-normal">
                ({econ.trainingDays.toFixed(1)} Days • {Math.round(econ.trainingHours).toLocaleString()} Hours)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Elapsed Time</span>
            <span className="font-bold text-cyan-300">
              {((econ.trainingDays * progress) / 100).toFixed(1)} Days ({((econ.trainingHours * progress) / 100).toFixed(0)} hrs)
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Time Remaining</span>
            <span className="font-bold text-amber-300">
              {progress === 100 ? '0.0 Days (Done)' : `${(econ.trainingDays * (1 - progress / 100)).toFixed(1)} Days`}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Cluster Compute</span>
            <span className="font-bold text-purple-300">
              {econ.totalFlops.toExponential(2)} FLOPs
            </span>
          </div>
        </div>
      </div>

      {/* 4-Stage Pipeline Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((st) => {
          const stPct = Math.max(
            0,
            Math.min(100, ((progress - st.start) / (st.end - st.start)) * 100)
          );
          const isCurrent = progress >= st.start && progress < st.end;
          return (
            <div
              key={st.name}
              className={`p-3.5 rounded-xl border transition ${
                isCurrent
                  ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-slate-200">{st.name}</span>
                <span className="text-cyan-300 font-bold">{Math.round(stPct)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-200"
                  style={{ width: `${stPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Telemetry Readouts + Recharts Loss Curve + Token Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recharts Real-Time Training, Validation & Test Loss */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Real-Time Cross-Entropy Loss (Train / Validation / Test)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Active Stage: <strong className="text-cyan-300">{currentPoint.stage}</strong> • Progress:{' '}
                <strong className="text-white">{progress}%</strong> ({((config.totalTokensT * progress) / 100).toFixed(2)}T /{' '}
                {config.totalTokensT}T Tokens)
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
                Train: <strong>{currentPoint.trainLoss.toFixed(3)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                Val: <strong>{currentPoint.valLoss.toFixed(3)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
                Test: <strong>{currentPoint.testLoss.toFixed(3)}</strong>
              </span>
            </div>
          </div>

          <div className="relative h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="stepPct"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  domain={['auto', 'auto']}
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="trainLoss"
                  name="Training Loss"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="valLoss"
                  name="Validation Loss"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="testLoss"
                  name="Held-Out Test Loss"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cluster Hardware Telemetry Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                Train Time
              </span>
              <span className="text-base font-bold text-cyan-300">
                {econ.trainingDays >= 1 ? `${econ.trainingDays.toFixed(1)}d` : `${econ.trainingHours.toFixed(1)}h`}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {Math.round(econ.trainingHours).toLocaleString()} hrs
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Live Cluster MFU</span>
              <span className="text-base font-bold text-emerald-300">{currentPoint.mfu}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">GPU efficiency</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Gradient L2 Norm</span>
              <span className="text-base font-bold text-cyan-300">{currentPoint.gradNorm}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Norm stability</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Power Draw (PUE 1.2)</span>
              <span className="text-base font-bold text-amber-300">{currentPoint.mwDraw} MW</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round(econ.totalEnergyMWh).toLocaleString()} MWh</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Pred. AA Index</span>
              <span className="text-base font-bold text-white">{econ.predictedIntelligenceIndex}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Target rating</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Per-Category Token Ingestion & Telemetry Log */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2.5">
              Per-Category Token Ingestion ({((config.totalTokensT * progress) / 100).toFixed(2)}T Ingested)
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { label: 'Web Crawl', pct: config.domainMixture.webCrawl, cls: 'bg-slate-400' },
                { label: 'Code / GitHub', pct: config.domainMixture.code, cls: 'bg-cyan-400' },
                { label: 'Math / Proofs', pct: config.domainMixture.math, cls: 'bg-emerald-400' },
                { label: 'Science / ArXiv', pct: config.domainMixture.science, cls: 'bg-purple-400' },
                { label: 'Synthetic CoT', pct: config.domainMixture.syntheticCoT, cls: 'bg-amber-400' },
                { label: 'Multilingual', pct: config.domainMixture.multilingual, cls: 'bg-pink-400' },
                { label: 'Multimodal', pct: config.domainMixture.multimodal, cls: 'bg-indigo-400' },
              ].map((cat) => {
                const ingestedT = (
                  (config.totalTokensT * (cat.pct / 100) * progress) /
                  100
                ).toFixed(2);
                const totalCatT = (config.totalTokensT * (cat.pct / 100)).toFixed(2);
                return (
                  <div key={cat.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">{cat.label} ({cat.pct}%)</span>
                      <span className="text-slate-200 font-bold">
                        {ingestedT}T / {totalCatT}T
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`${cat.cls} h-full rounded-full transition-all duration-200`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase border-b border-slate-800 pb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Cluster Kernel Event Log</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px] text-slate-300">
              {logs.map((line, i) => (
                <div key={i} className="leading-snug text-slate-300">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
