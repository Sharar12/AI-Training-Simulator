import {
  SimulatorConfig,
  EconomicsBreakdown,
  PrecisionType,
  OptimizerType,
  RlvrEffortType,
  DomainMixture,
} from '../types/simulator';
import { GPU_SPECS } from '../data/constants';

export function normalizeDomainMixture(
  mixture: DomainMixture,
  fallbackTotalTokensT: number
): {
  tokens: DomainMixture;
  pcts: DomainMixture;
  totalTokensT: number;
} {
  const keys: (keyof DomainMixture)[] = [
    'webCrawl',
    'code',
    'math',
    'science',
    'syntheticCoT',
    'multilingual',
    'multimodal',
  ];

  const rawSum = keys.reduce((acc, k) => acc + (Number(mixture[k]) || 0), 0);

  // If rawSum is ~100 (legacy percentage scale) and differs substantially from fallback total, adapt legacy
  const isLegacyPercentage =
    rawSum >= 95 && rawSum <= 105 && Math.abs(rawSum - fallbackTotalTokensT) > 2.0;

  let tokens: DomainMixture;
  let totalTokensT: number;

  if (isLegacyPercentage) {
    tokens = {
      webCrawl: Number(((mixture.webCrawl / rawSum) * fallbackTotalTokensT).toFixed(2)),
      code: Number(((mixture.code / rawSum) * fallbackTotalTokensT).toFixed(2)),
      math: Number(((mixture.math / rawSum) * fallbackTotalTokensT).toFixed(2)),
      science: Number(((mixture.science / rawSum) * fallbackTotalTokensT).toFixed(2)),
      syntheticCoT: Number(((mixture.syntheticCoT / rawSum) * fallbackTotalTokensT).toFixed(2)),
      multilingual: Number(((mixture.multilingual / rawSum) * fallbackTotalTokensT).toFixed(2)),
      multimodal: Number(((mixture.multimodal / rawSum) * fallbackTotalTokensT).toFixed(2)),
    };
    totalTokensT = fallbackTotalTokensT;
  } else {
    tokens = {
      webCrawl: Math.max(0, Number(mixture.webCrawl) || 0),
      code: Math.max(0, Number(mixture.code) || 0),
      math: Math.max(0, Number(mixture.math) || 0),
      science: Math.max(0, Number(mixture.science) || 0),
      syntheticCoT: Math.max(0, Number(mixture.syntheticCoT) || 0),
      multilingual: Math.max(0, Number(mixture.multilingual) || 0),
      multimodal: Math.max(0, Number(mixture.multimodal) || 0),
    };
    const sum = keys.reduce((acc, k) => acc + tokens[k], 0);
    totalTokensT = sum > 0 ? Number(sum.toFixed(2)) : fallbackTotalTokensT;
  }

  const effectiveSum = keys.reduce((acc, k) => acc + tokens[k], 0);

  const pcts: DomainMixture = {
    webCrawl: effectiveSum > 0 ? Number(((tokens.webCrawl / effectiveSum) * 100).toFixed(1)) : 0,
    code: effectiveSum > 0 ? Number(((tokens.code / effectiveSum) * 100).toFixed(1)) : 0,
    math: effectiveSum > 0 ? Number(((tokens.math / effectiveSum) * 100).toFixed(1)) : 0,
    science: effectiveSum > 0 ? Number(((tokens.science / effectiveSum) * 100).toFixed(1)) : 0,
    syntheticCoT: effectiveSum > 0 ? Number(((tokens.syntheticCoT / effectiveSum) * 100).toFixed(1)) : 0,
    multilingual: effectiveSum > 0 ? Number(((tokens.multilingual / effectiveSum) * 100).toFixed(1)) : 0,
    multimodal: effectiveSum > 0 ? Number(((tokens.multimodal / effectiveSum) * 100).toFixed(1)) : 0,
  };

  return { tokens, pcts, totalTokensT: totalTokensT > 0 ? totalTokensT : fallbackTotalTokensT };
}

export function formatMoney(usd: number): string {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(2)}M`;
  if (usd >= 1e3) return `$${(usd / 1e3).toFixed(1)}K`;
  return `$${usd.toFixed(2)}`;
}

export function formatMemoryGB(gb: number): string {
  if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB (${Math.round(gb).toLocaleString()} GB)`;
  return `${gb.toFixed(1)} GB`;
}

export function formatTrainingDuration(hours: number): string {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} Minutes`;
  if (hours < 24) return `${hours.toFixed(1)} Hours`;
  const days = hours / 24;
  if (days < 30) return `${days.toFixed(1)} Days (${Math.round(hours).toLocaleString()} hrs)`;
  const months = days / 30.417;
  return `${months.toFixed(1)} Months (${days.toFixed(0)} Days / ${Math.round(hours).toLocaleString()} hrs)`;
}

export function formatContextWindow(contextK: number): string {
  if (contextK >= 1000) {
    const m = contextK / 1000;
    return `${m % 1 === 0 ? m.toFixed(1) : m.toFixed(2)}M`;
  }
  return `${contextK}K`;
}

export function calculateHardwareAndEconomics(
  config: SimulatorConfig,
  eventBonusIndex: number = 0
): EconomicsBreakdown {
  const gpu = GPU_SPECS[config.gpuType];

  const { tokens: dTokens, pcts: dPcts, totalTokensT: activeTokensT } = normalizeDomainMixture(
    config.domainMixture,
    config.totalTokensT
  );

  // 1. Effective Active Parameters
  const effectiveRatio =
    config.paradigm === 'Dense'
      ? 1.0
      : config.paradigm === 'Sparse MoE'
        ? Math.max(0.02, Math.min(1.0, config.activeParamRatio))
        : Math.max(0.15, Math.min(1.0, config.activeParamRatio * 0.85));

  const activeParamsB = Number((config.totalParamsB * effectiveRatio).toFixed(2));
  const totalParamsB = config.totalParamsB;

  // 2. Bytes per Parameter for Training & Inference
  const weightBytesMap: Record<PrecisionType, number> = {
    FP32: 4.0,
    BF16: 2.0,
    FP16: 2.0,
    FP8: 1.0,
    INT8: 1.0,
    INT4: 0.5,
  };
  const gradBytesMap: Record<PrecisionType, number> = {
    FP32: 4.0,
    BF16: 2.0,
    FP16: 2.0,
    FP8: 2.0, // Master gradients in BF16
    INT8: 2.0,
    INT4: 2.0,
  };
  const optBytesMap: Record<OptimizerType, number> = {
    AdamW: 12.0, // FP32 master weights (4B) + m (4B) + v (4B)
    Muon: 8.0,   // Orthogonalized momentum + master state
    Lion: 8.0,   // Sign-momentum state + master copy
  };

  const weightBytesPerParam = weightBytesMap[config.precision];
  const gradBytesPerParam = gradBytesMap[config.precision];
  const optBytesPerParam = optBytesMap[config.optimizer];

  // Attention KV & Activation scaling factor
  const attnMemoryFactor =
    config.attention === 'MHA' ? 1.0 : config.attention === 'GQA' ? 0.32 : 0.16;
  const paradigmKvFactor = config.paradigm === 'Hybrid Mamba-Transformer' ? 0.55 : 1.0;

  // B. Hardware Required TO TRAIN
  const rawModelStateGB =
    totalParamsB * (weightBytesPerParam + gradBytesPerParam + optBytesPerParam);
  const activationBufferGB =
    Math.pow(activeParamsB, 0.72) *
    (config.contextWindowK / 32) *
    attnMemoryFactor *
    paradigmKvFactor *
    1.8;

  const trainingVramGB = Math.max(16, rawModelStateGB + activationBufferGB);
  const trainingVramTB = trainingVramGB / 1024;

  // Usable VRAM per GPU with ZeRO-3 / FSDP + 15% NCCL/CUDA buffer headroom
  const usableGpuVram = gpu.vramGB * 0.84;
  const rawMinGpus = Math.ceil(trainingVramGB / usableGpuVram);
  const minGpusToFitMemory = Math.max(8, Math.ceil(rawMinGpus / 8) * 8);
  const clusterFitsMemory = config.gpuCount >= minGpusToFitMemory;

  const trainingSystemRamTB = Number((trainingVramTB * 1.5).toFixed(2));
  const trainingCpuCores = config.gpuCount * 16; // 128 cores per 8-GPU node

  // Dataset storage: ~2.8 TB per Trillion tokens + multimodal multiplier (comfortably scales up to 1000 TB+)
  const tbPerTrillion = 2.6 + (dPcts.multimodal / 100) * 1.8;
  const datasetStorageTB = activeTokensT * tbPerTrillion;
  // Rolling NVMe Checkpoint Storage: 5x full model + optimizer state snapshots
  const singleCheckpointTB = (totalParamsB * (weightBytesPerParam + optBytesPerParam)) / 1024;
  const checkpointStorageTB = singleCheckpointTB * 5;
  const trainingTotalStorageTB = datasetStorageTB + checkpointStorageTB;
  const trainingTotalStoragePB = trainingTotalStorageTB / 1024;

  // A. Total Cost to Make (Build CapEx / OpEx Breakdown)
  const effectiveTrainTokensT = activeTokensT * (config.trainSplitPct / 100);
  // Long-context annealing adds ~8% to 25% extra FLOPs for >128K windows
  const contextFlopMultiplier =
    1.0 + Math.max(0, Math.log10(Math.max(1, config.contextWindowK / 64))) * 0.12 * attnMemoryFactor;
  const totalFlops =
    6 * (activeParamsB * 1e9) * (effectiveTrainTokensT * 1e12) * contextFlopMultiplier;

  // Effective GPU TFLOPs based on precision
  const peakGpuTflops =
    config.precision === 'FP8' || config.precision === 'INT4' || config.precision === 'INT8'
      ? gpu.fp8Tflops
      : config.precision === 'FP32'
        ? gpu.bf16Tflops * 0.5
        : gpu.bf16Tflops;

  // Model FLOPs Utilization (MFU %)
  let baseMfu = 0.46;
  if (config.gpuType === 'B200') baseMfu += 0.05;
  if (config.paradigm === 'Sparse MoE') baseMfu -= 0.035; // All-to-All EP dispatch overhead
  if (config.attention === 'MLA') baseMfu += 0.025;
  if (config.optimizer === 'Muon') baseMfu += 0.015;
  if (config.gpuCount > 32768) baseMfu -= 0.03;
  const mfuPct = Math.min(62, Math.max(28, Number((baseMfu * 100).toFixed(1))));

  const achievedFlopsPerGpuSec = peakGpuTflops * 1e12 * (mfuPct / 100);
  const totalGpuSeconds = totalFlops / achievedFlopsPerGpuSec;
  const totalGpuHours = totalGpuSeconds / 3600;
  const trainingHours = totalGpuHours / Math.max(1, config.gpuCount);
  const trainingDays = trainingHours / 24;

  const preTrainingComputeCostUSD = totalGpuHours * gpu.hourlyRateUSD;

  // Data Acquisition & Synthetic Generation Cost ($)
  const stemShare =
    (dPcts.code + dPcts.math + dPcts.science) / 100;
  const synthShare = dPcts.syntheticCoT / 100;
  const multimodalShare = dPcts.multimodal / 100;

  const baseDataCost = activeTokensT * 42000;
  const stemDataCost = activeTokensT * stemShare * 185000;
  const synthDataCost = activeTokensT * synthShare * 860000;
  const mmDataCost = activeTokensT * multimodalShare * 210000;
  const decontamCost = config.decontaminationFilter ? 120000 + activeTokensT * 14000 : 0;
  const dataAcquisitionCostUSD =
    baseDataCost + stemDataCost + synthDataCost + mmDataCost + decontamCost;

  // Post-Training (SFT + RLHF + RLVR) Cost ($)
  const rlvrMultiplierMap: Record<RlvrEffortType, number> = {
    Low: 1.0,
    Medium: 2.3,
    High: 4.8,
    Xhigh: 8.6,
    Max: 14.5,
  };
  const rlvrMult = rlvrMultiplierMap[config.rlvrEffort];
  const sftCost = (activeParamsB * 1800 + 85000) * config.sftRounds;
  const rlhfCost = (activeParamsB * 2400 + 140000) * config.rlhfAlignment;
  const rlvrCost = (activeParamsB * 5200 + 220000) * rlvrMult;
  const postTrainingCostUSD = sftCost + rlhfCost + rlvrCost;

  // Power & Cooling Overhead ($ & Megawatt-Hours): GPU TDP * Training Hours * PUE (1.2)
  const pue = 1.2;
  const powerMegawatts = (config.gpuCount * gpu.tdpWatts * pue) / 1e6;
  const totalEnergyMWh = powerMegawatts * trainingHours;
  const powerCoolingCostUSD = totalEnergyMWh * 85; // $85 / MWh industrial datacenter tariff

  const grandTotalBuildCostUSD =
    preTrainingComputeCostUSD +
    dataAcquisitionCostUSD +
    postTrainingCostUSD +
    powerCoolingCostUSD;

  // C. Hardware Required TO RUN / INFERENCE (Deployment & Self-Hosting Specs)
  const inferenceWeightGB = totalParamsB * weightBytesPerParam;
  // KV-Cache VRAM scales with Context Window & MHA/GQA/MLA
  const kvCacheVramGB =
    (config.contextWindowK / 100) *
    (Math.pow(totalParamsB, 0.58) * 0.85) *
    attnMemoryFactor *
    paradigmKvFactor *
    (weightBytesPerParam / 2.0);

  const inferenceVramGB = Number((inferenceWeightGB * 1.15 + kvCacheVramGB).toFixed(1));
  const inferenceSystemRamGB = Number((inferenceWeightGB * 1.25).toFixed(1));
  const inferenceCpuCores = Math.min(
    128,
    Math.max(8, Math.ceil(inferenceVramGB / 24) * 8)
  );
  const inferenceDiskSpaceGB = Number((inferenceWeightGB + 1.4).toFixed(1));

  // "Can It Run On?" Badge
  let canRunOnBadge = '';
  let canRunTierColor: 'emerald' | 'cyan' | 'amber' | 'rose' = 'emerald';
  if (inferenceVramGB <= 16) {
    canRunOnBadge = 'Fits on Laptop / Edge GPU (RTX 4080 16GB / MacBook M4)';
    canRunTierColor = 'emerald';
  } else if (inferenceVramGB <= 32) {
    canRunOnBadge = 'Fits on 1x RTX 5090 (32GB)';
    canRunTierColor = 'emerald';
  } else if (inferenceVramGB <= 80) {
    canRunOnBadge = 'Fits on 1x H100 (80GB) or Mac Studio M4 Max (128GB)';
    canRunTierColor = 'cyan';
  } else if (inferenceVramGB <= 141) {
    canRunOnBadge = 'Fits on 1x H200 (141GB) or Mac Studio M4 Ultra (192GB)';
    canRunTierColor = 'cyan';
  } else if (inferenceVramGB <= 192) {
    canRunOnBadge = 'Fits on 1x B200 Blackwell (192GB)';
    canRunTierColor = 'cyan';
  } else if (inferenceVramGB <= 512) {
    canRunOnBadge = 'Requires 2x Mac Studio M4 Ultra (512GB Unified)';
    canRunTierColor = 'amber';
  } else if (inferenceVramGB <= 1128) {
    canRunOnBadge = 'Requires 1x 8xH200 Node (1,128GB VRAM)';
    canRunTierColor = 'amber';
  } else if (inferenceVramGB <= 1536) {
    canRunOnBadge = 'Requires 1x 8xB200 Node (1,536GB VRAM)';
    canRunTierColor = 'rose';
  } else {
    const nodes = Math.ceil(inferenceVramGB / 1128);
    canRunOnBadge = `Datacenter Multi-Node Cluster Required (${nodes}x 8xH200 Nodes)`;
    canRunTierColor = 'rose';
  }

  // D. API Token Pricing & Task Cost Calculator
  const quantPriceFactor =
    config.precision === 'FP32'
      ? 2.1
      : config.precision === 'BF16' || config.precision === 'FP16'
        ? 1.0
        : config.precision === 'FP8' || config.precision === 'INT8'
          ? 0.58
          : 0.36;
  const contextPriceFactor = 1.0 + Math.max(0, (config.contextWindowK - 128) / 2000) * attnMemoryFactor;
  const rawInputPrice =
    (0.04 + Math.pow(activeParamsB, 0.78) * 0.026) * quantPriceFactor * contextPriceFactor;
  const inputTokenPricePer1M = Number(Math.max(0.04, rawInputPrice).toFixed(2));

  const decodeMultiplier =
    config.paradigm === 'Sparse MoE'
      ? 3.8 + (totalParamsB / Math.max(1, activeParamsB)) * 0.04
      : config.paradigm === 'Hybrid Mamba-Transformer'
        ? 3.4
        : 4.5;
  const outputTokenPricePer1M = Number(
    Math.max(0.15, inputTokenPricePer1M * Math.min(5.2, decodeMultiplier)).toFixed(2)
  );

  // Standard 3:1 Input-to-Output ratio
  const blendedPricePer1M = Number(
    ((3 * inputTokenPricePer1M + 1 * outputTokenPricePer1M) / 4).toFixed(2)
  );

  // Reasoning tokens per task
  const effortTokensMap: Record<RlvrEffortType, number> = {
    Low: 650,
    Medium: 1450,
    High: 2800,
    Xhigh: 4600,
    Max: 6900,
  };
  const avgOutputTokensPerTask = effortTokensMap[config.rlvrEffort];
  const avgInputTokensPerTask = 1250;
  const costPerTaskUSD = Number(
    (
      (avgInputTokensPerTask / 1e6) * inputTokenPricePer1M +
      (avgOutputTokensPerTask / 1e6) * outputTokenPricePer1M
    ).toFixed(4)
  );

  // E. Chinchilla Optimality & Intelligence Index Prediction
  // E. Chinchilla Optimality & Intelligence Index Prediction
  // Optimal tokens:
  // For Dense: 20 tokens per parameter
  // For MoE: 20 tokens per active parameter + 5 tokens per total parameter (for expert coverage)
  const chinchillaOptimalTokensT = Number(
    Math.max(
      0.2,
      config.paradigm === 'Dense'
        ? (totalParamsB * 20) / 1000
        : (activeParamsB * 20 + totalParamsB * 5) / 1000
    ).toFixed(2)
  );
  const chinchillaRatio = Number((effectiveTrainTokensT / chinchillaOptimalTokensT).toFixed(2));

  let chinchillaStatus: EconomicsBreakdown['chinchillaStatus'] = 'Chinchilla Optimal Zone';
  if (chinchillaRatio < 0.65) {
    chinchillaStatus = 'Under-Trained (Compute Deficit)';
  } else if (chinchillaRatio > 1.8) {
    chinchillaStatus = 'Over-Trained (Inference-Optimized)';
  }

  // Intelligence Index calculation (Calibrated accurately to modern Artificial Analysis scale)
  // Active parameters determine deep per-token reasoning capacity & multi-step algorithmic coherence
  // Total parameters determine factual knowledge retention & encyclopedic recall
  const activeCapScore = 5.5 * Math.log10(Math.max(0.01, activeParamsB));
  const totalKnowledgeScore = 3.2 * Math.log10(Math.max(0.01, totalParamsB));
  const paramScore = 10.5 + activeCapScore + totalKnowledgeScore;

  // Architecture Paradigm bonus / trade-off:
  // - Dense Transformer: +1.6 bonus (full parameter update per token, zero routing noise, peak representation density)
  // - Sparse MoE: 0.0 baseline (heavily conditioned on active parameter ratio)
  // - Hybrid Mamba-Attn: -0.9 on complex multi-hop reasoning due to linear state compression, but gives +32% tok/s boost
  const paradigmDelta =
    config.paradigm === 'Dense'
      ? 1.6
      : config.paradigm === 'Sparse MoE'
        ? 0.0
        : -0.9;

  // Token scaling contribution
  let tokenDelta = 0;
  if (chinchillaRatio < 1.0) {
    tokenDelta = -6.5 * Math.pow(1.0 - chinchillaRatio, 1.35);
  } else {
    tokenDelta = Math.min(5.8, 3.1 * Math.log2(chinchillaRatio));
  }

  // Model reasoning capacity factor: Sub-16B active models cannot hold complex multi-step RLVR reasoning
  const reasoningCapacityFactor = Math.min(1.0, Math.max(0.08, Math.pow(Math.max(0.01, activeParamsB) / 16, 0.65)));

  // Domain mixture quality bonus
  const stemBalance = Math.min(4.2, (dPcts.code * 0.08 + dPcts.math * 0.09 + dPcts.science * 0.07));
  const synthBonus = Math.min(4.5, Math.pow(dPcts.syntheticCoT, 0.78) * 0.36) * reasoningCapacityFactor;
  const webPenalty = dPcts.webCrawl < 8 ? -2.2 : dPcts.webCrawl > 70 ? -1.8 : 0.4;

  // Precision & Optimizer & Attention deltas
  const precisionDelta =
    config.precision === 'FP32'
      ? 0.2
      : config.precision === 'BF16' || config.precision === 'FP16'
        ? 0.0
        : config.precision === 'FP8' || config.precision === 'INT8'
          ? -0.6
          : -3.5; // INT4 quantization degradation
  const optimizerDelta =
    config.optimizer === 'Muon' ? 0.85 : config.optimizer === 'Lion' ? 0.35 : 0.0;
  const attnDelta =
    config.attention === 'MLA' ? 0.45 : config.attention === 'GQA' ? 0.15 : 0.0;

  // Post-training & RLVR Thinking Effort delta (gated by parametric capacity)
  const rlvrIndexBonusMap: Record<RlvrEffortType, number> = {
    Low: 0.0,
    Medium: 3.5,
    High: 7.2,
    Xhigh: 10.8,
    Max: 14.5,
  };
  const gatedRlvrBonus = rlvrIndexBonusMap[config.rlvrEffort] * reasoningCapacityFactor;

  const postTrainDelta =
    config.sftRounds * 0.45 * reasoningCapacityFactor +
    config.rlhfAlignment * 0.35 * reasoningCapacityFactor +
    gatedRlvrBonus;

  const contaminationPenalty = config.decontaminationFilter ? 0.0 : -2.5;

  const rawIndex =
    paramScore +
    paradigmDelta +
    tokenDelta +
    stemBalance +
    synthBonus +
    webPenalty +
    precisionDelta +
    optimizerDelta +
    attnDelta +
    postTrainDelta +
    contaminationPenalty +
    eventBonusIndex;

  // Calibrated accurately: Top frontier models score ~57-58.5, compact sub-1B edge models score ~4-8, ultra 1000T models scale up to ~65
  const predictedIntelligenceIndex = Number(
    Math.min(65.0, Math.max(4.0, rawIndex)).toFixed(1)
  );

  // Output Speed (tok/s)
  const quantSpeedBoost =
    config.precision === 'INT4'
      ? 2.15
      : config.precision === 'FP8' || config.precision === 'INT8'
        ? 1.68
        : config.precision === 'BF16' || config.precision === 'FP16'
          ? 1.0
          : 0.52;
  const paradigmSpeedBoost =
    config.paradigm === 'Hybrid Mamba-Transformer'
      ? 1.32
      : config.paradigm === 'Sparse MoE'
        ? 1.18
        : 1.0;
  const attnSpeedBoost =
    config.attention === 'MLA' ? 1.22 : config.attention === 'GQA' ? 1.08 : 0.88;
  const bwFactor = gpu.bandwidthTBps / 3.35;

  const baseTokPerSec =
    (2850 / Math.pow(Math.max(2, activeParamsB), 0.64)) *
    quantSpeedBoost *
    paradigmSpeedBoost *
    attnSpeedBoost *
    Math.pow(bwFactor, 0.55);

  const predictedOutputSpeedTokPerSec = Math.round(
    Math.min(850, Math.max(18, baseTokPerSec))
  );

  // TTFT latency (seconds)
  const effortTtftAdd: Record<RlvrEffortType, number> = {
    Low: 0.0,
    Medium: 0.22,
    High: 0.54,
    Xhigh: 0.92,
    Max: 1.45,
  };
  const predictedTtftSec = Number(
    Math.max(
      0.18,
      0.22 +
      (activeParamsB / 450) * 0.55 +
      (config.contextWindowK / 2000) * 0.18 * attnMemoryFactor +
      effortTtftAdd[config.rlvrEffort]
    ).toFixed(2)
  );

  // Stability Score (0-100)
  let stability = 88;
  if (config.precision === 'FP32') stability += 8;
  if (config.precision === 'FP8') stability -= 7;
  if (config.precision === 'INT4') stability -= 16;
  if (config.paradigm === 'Sparse MoE') stability -= 5;
  if (config.optimizer === 'Muon') stability += 4;
  const stabilityScore = Math.min(99, Math.max(42, stability));

  // Sub-scores (0-100 scale, realistically conditioned on domain token exposure)
  // If a model has 0.0T training data in a specialized domain, its performance in that domain collapses.
  const mathDataTokens = dTokens.math + dTokens.syntheticCoT * 0.65 + dTokens.science * 0.12 + dTokens.webCrawl * 0.03;
  const mathExposure = Math.min(1.0, mathDataTokens / 2.5);

  const codeDataTokens = dTokens.code + dTokens.syntheticCoT * 0.45 + dTokens.webCrawl * 0.04;
  const codeExposure = Math.min(1.0, codeDataTokens / 3.5);

  const scienceDataTokens = dTokens.science + dTokens.syntheticCoT * 0.45 + dTokens.math * 0.2 + dTokens.webCrawl * 0.15;
  const scienceExposure = Math.min(1.0, scienceDataTokens / 2.0);

  // Even without dedicated multilingual data, English/web models have slight cross-lingual transfer (~6%)
  const multiDataTokens = dTokens.multilingual + dTokens.webCrawl * 0.25;
  const multiExposure = Math.min(1.0, (dTokens.multilingual > 0 ? 0.15 : 0.06) + multiDataTokens / 3.0);

  // Multimodal Vision strictly requires interleaved multimodal visual tokens (images/videos)
  // Text-only models without vision tokens cannot process visual inputs (0.0% vision capability)
  const mmExposure = dTokens.multimodal > 0 ? Math.min(1.0, Math.pow(dTokens.multimodal / 2.0, 0.75)) : 0.0;

  // Long-context scales with sequence window size (8K baseline up to 1M+)
  const contextExposure = Math.min(
    1.0,
    Math.max(0.12, (Math.log10(Math.max(8, config.contextWindowK)) - Math.log10(8)) / (Math.log10(1000) - Math.log10(8)))
  );

  // Theoretical ceiling based on model capacity and overall Intelligence Index
  const potentialCeiling = Math.min(99.0, Math.max(25.0, 28.0 + predictedIntelligenceIndex * 1.2));

  // RLVR reasoning bonus requires baseline exposure to the domain's syntax/logic to be effective
  const mathScore = mathExposure > 0.01
    ? Math.min(99.2, potentialCeiling * Math.pow(mathExposure, 1.15) + gatedRlvrBonus * 0.65 * mathExposure)
    : 0.0;

  const codeScore = codeExposure > 0.01
    ? Math.min(99.0, potentialCeiling * Math.pow(codeExposure, 1.15) + gatedRlvrBonus * 0.55 * codeExposure)
    : 0.0;

  const scienceScore = scienceExposure > 0.01
    ? Math.min(98.5, potentialCeiling * Math.pow(scienceExposure, 1.1))
    : 0.0;

  const longContextScore = Math.min(
    99.0,
    Math.max(
      8.0,
      potentialCeiling * (0.35 + contextExposure * 0.65) +
      (config.attention === 'MLA' ? 5.5 : config.attention === 'GQA' ? 2.5 : -3.0)
    )
  );

  const multilingualScore = Math.min(
    98.0,
    potentialCeiling * multiExposure
  );

  const multimodalScore = mmExposure > 0
    ? Math.min(98.5, potentialCeiling * mmExposure)
    : 0.0;

  const subScores = {
    math: Number(mathScore.toFixed(1)),
    coding: Number(codeScore.toFixed(1)),
    science: Number(scienceScore.toFixed(1)),
    longContext: Number(longContextScore.toFixed(1)),
    multilingual: Number(multilingualScore.toFixed(1)),
    multimodal: Number(multimodalScore.toFixed(1)),
  };

  return {
    totalParamsB,
    activeParamsB,
    contextWindowLabel: formatContextWindow(config.contextWindowK),
    totalFlops,
    mfuPct,
    trainingHours,
    trainingDays,
    preTrainingComputeCostUSD,
    dataAcquisitionCostUSD,
    postTrainingCostUSD,
    powerMegawatts,
    totalEnergyMWh,
    powerCoolingCostUSD,
    grandTotalBuildCostUSD,
    weightBytesPerParam,
    gradBytesPerParam,
    optBytesPerParam,
    activationBufferGB,
    trainingVramGB,
    trainingVramTB,
    minGpusToFitMemory,
    clusterFitsMemory,
    trainingSystemRamTB,
    trainingCpuCores,
    datasetStorageTB,
    checkpointStorageTB,
    trainingTotalStorageTB,
    trainingTotalStoragePB,
    inferenceWeightGB,
    kvCacheVramGB,
    inferenceVramGB,
    canRunOnBadge,
    canRunTierColor,
    inferenceSystemRamGB,
    inferenceCpuCores,
    inferenceDiskSpaceGB,
    inputTokenPricePer1M,
    outputTokenPricePer1M,
    blendedPricePer1M,
    avgOutputTokensPerTask,
    costPerTaskUSD,
    chinchillaOptimalTokensT,
    chinchillaRatio,
    chinchillaStatus,
    predictedIntelligenceIndex,
    predictedOutputSpeedTokPerSec,
    predictedTtftSec,
    stabilityScore,
    subScores,
  };
}
