'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  BookOpen,
  Cpu,
  Database,
  Trophy,
  X,
} from 'lucide-react';
import {
  SimulatorConfig,
  CompetitorModel,
} from '../types/simulator';
import {
  PRESET_BLUEPRINTS,
  TOOLTIP_REGISTRY,
} from '../data/constants';
import { calculateHardwareAndEconomics } from '../lib/simulationEngine';
import { HardwareEconomicsDock } from '../components/HardwareEconomicsDock';
import { Module1Architecture } from '../components/Module1Architecture';
import { Module2DataPipeline } from '../components/Module2DataPipeline';
import { Module3LiveTraining } from '../components/Module3LiveTraining';
import { Module4Leaderboard } from '../components/Module4Leaderboard';

export default function App() {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);
  const [config, setConfig] = useState<SimulatorConfig>(
    PRESET_BLUEPRINTS[0].config
  );
  const [eventBonusIndex, setEventBonusIndex] = useState<number>(0);
  const [savedUserModels, setSavedUserModels] = useState<CompetitorModel[]>([]);
  const [showTooltipGuide, setShowTooltipGuide] = useState<boolean>(false);

  const econ = useMemo(
    () => calculateHardwareAndEconomics(config, eventBonusIndex),
    [config, eventBonusIndex]
  );

  const handleSaveCurrentModel = () => {
    const snapshot: CompetitorModel = {
      rank: null,
      id: `user-saved-${Date.now()}`,
      name: `${config.modelName} (Saved)`,
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
      archSummary: `${config.paradigm} (${econ.totalParamsB}B / ${econ.inferenceVramGB} GB VRAM)`,
      paradigm: config.paradigm,
      totalParamsB: econ.totalParamsB,
      activeParamsB: econ.activeParamsB,
      inferenceVramGB: econ.inferenceVramGB,
      inferenceDiskGB: econ.inferenceDiskSpaceGB,
      canRunOnBadge: econ.canRunOnBadge,
      isUserModel: true,
      contaminWarning: !config.decontaminationFilter,
      subScores: econ.subScores,
    };
    setSavedUserModels((prev) => [snapshot, ...prev]);
  };

  const navStages = [
    {
      id: 1 as const,
      title: '1. Architecture & Foundry',
      subtitle: `${config.paradigm} • ${econ.totalParamsB >= 1000 ? `${(econ.totalParamsB / 1000).toFixed(1)}T` : `${econ.totalParamsB}B`}`,
      icon: Cpu,
    },
    {
      id: 2 as const,
      title: '2. Data & Alignment',
      subtitle: `${config.totalTokensT}T Tok • RLVR ${config.rlvrEffort}`,
      icon: Database,
    },
    {
      id: 3 as const,
      title: '3. Live Training HUD',
      subtitle: `${econ.trainingDays.toFixed(1)}d • ${econ.mfuPct}% MFU`,
      icon: Activity,
    },
    {
      id: 4 as const,
      title: '4. AA Leaderboard',
      subtitle: `Index: ${econ.predictedIntelligenceIndex} • ${econ.predictedOutputSpeedTokPerSec} tok/s`,
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500/30">
      {/* Top Laboratory Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-mono font-black text-base shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              FL2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-bold text-sm sm:text-base text-white tracking-tight">
                  FRONTIER LAB v2.0
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  AA SIMULATOR
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                AI Model Training, Datacenter Hardware Economics &amp; Artificial Analysis Suite
              </p>
            </div>
          </div>

          {/* Preset Blueprint Quick-Loader & What-If Guide Button */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden xl:inline">
              Load Blueprint:
            </span>
            {PRESET_BLUEPRINTS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setConfig(preset.config);
                  setEventBonusIndex(0);
                }}
                className={`px-2.5 py-1.5 rounded-xl font-mono text-xs border transition ${
                  config.modelName === preset.config.modelName
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset.label.split(' (')[0]}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowTooltipGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-mono text-xs transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>What-If Matrix</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Workflow Stepper Bar */}
        <div className="max-w-[1600px] mx-auto px-4 pb-2.5 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {navStages.map((st) => {
            const Icon = st.icon;
            const isActive = activeStage === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStage(st.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-3 ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500/70 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/60 border-slate-800/90 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold truncate">
                    {st.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 truncate">
                    {st.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Stage Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-6">
        {activeStage === 1 && (
          <Module1Architecture
            config={config}
            econ={econ}
            onChange={setConfig}
            onNextStage={() => setActiveStage(2)}
          />
        )}
        {activeStage === 2 && (
          <Module2DataPipeline
            config={config}
            econ={econ}
            onChange={setConfig}
            onPrevStage={() => setActiveStage(1)}
            onNextStage={() => setActiveStage(3)}
          />
        )}
        {activeStage === 3 && (
          <Module3LiveTraining
            config={config}
            econ={econ}
            eventBonusIndex={eventBonusIndex}
            onUpdateEventBonus={(delta) =>
              setEventBonusIndex((prev) => Number((prev + delta).toFixed(2)))
            }
            onPrevStage={() => setActiveStage(2)}
            onCompleteRun={() => setActiveStage(4)}
          />
        )}
        {activeStage === 4 && (
          <Module4Leaderboard
            config={config}
            econ={econ}
            savedUserModels={savedUserModels}
            onSaveCurrentModel={handleSaveCurrentModel}
            onPrevStage={() => setActiveStage(3)}
          />
        )}
      </main>

      {/* Full What-If Hyperparameter Trade-Off Matrix Modal */}
      {showTooltipGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400">
                  Interactive Hyperparameter Trade-Off Encyclopedia
                </span>
                <h3 className="text-base font-bold text-white">
                  All &ldquo;What-If&rdquo; Hover Tooltip Specifications
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTooltipGuide(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {Object.values(TOOLTIP_REGISTRY).map((spec) => (
                <div
                  key={spec.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="font-mono font-bold text-cyan-300">
                    {spec.title}
                  </div>
                  <p className="text-slate-300 text-[11px]">{spec.whatItIs}</p>
                  <div className="text-[11px] text-emerald-300">
                    <strong>🔼 Increasing:</strong> {spec.increasingEffect}
                  </div>
                  <div className="text-[11px] text-amber-300">
                    <strong>🔽 Decreasing:</strong> {spec.decreasingEffect}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Hardware Footprint & Economics Dock */}
      <HardwareEconomicsDock config={config} econ={econ} />
    </div>
  );
}