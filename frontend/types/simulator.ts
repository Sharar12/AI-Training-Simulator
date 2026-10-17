export type ParadigmType =
  | 'Dense'
  | 'Sparse MoE'
  | 'DeepSeek-V3 MoE'
  | 'Hybrid Mamba-Transformer';
export type AttentionType = 'MLA' | 'GQA' | 'MHA';
export type PrecisionType =
  | 'FP8'
  | 'BF16'
  | 'FP16'
  | 'INT8'
  | 'INT4'
  | 'FP32'
  | 'Ternary 1.58b'
  | 'Bonsai 1-bit';
export type OptimizerType = 'Muon' | 'AdamW' | 'Lion';
export type GpuType = 'H100' | 'H200' | 'B200' | 'TPUv6e' | 'Ascend910C';
export type RlvrEffortType = 'Low' | 'Medium' | 'High' | 'Xhigh' | 'Max';

export interface DomainMixture {
  webCrawl: number;
  code: number;
  math: number;
  science: number;
  booksHistory: number;
  syntheticCoT: number;
  multilingual: number;
  multimodal: number;
}

export interface DomainQuickPick {
  label: string;
  tokensT: number;
}

export interface DomainMetadata {
  key: keyof DomainMixture;
  label: string;
  datasets: string;
  tooltipId: string;
  color: string;
  barClass: string;
  maxTokensT: number;
  humanArchiveMaxT: number;
  archiveNote: string;
  stepTokensT: number;
  tbMultiplier: number;
  quickPicks: DomainQuickPick[];
}

export interface SimulatorConfig {
  modelName: string;
  license: 'Proprietary' | 'Open Weights';
  paradigm: ParadigmType;
  totalParamsB: number; // 1 to 1000000 (1B to 1,000T)
  activeParamRatio: number; // 0.02 to 1.0 (2% to 100%)
  attention: AttentionType;
  contextWindowK: number; // 8 to 10000 (8K to 10M)
  precision: PrecisionType;
  optimizer: OptimizerType;
  gpuType: GpuType;
  gpuCount: number;
  totalTokensT: number; // 0.5 to 100 Trillion tokens
  trainSplitPct: number; // e.g. 96
  valSplitPct: number; // e.g. 2
  testSplitPct: number; // e.g. 2
  decontaminationFilter: boolean;
  domainMixture: DomainMixture;
  sftRounds: number; // 1 to 5
  rlhfAlignment: number; // 1 to 5
  rlvrEffort: RlvrEffortType;
}

export interface GpuHardwareSpec {
  id: GpuType;
  name: string;
  vramGB: number;
  bf16Tflops: number;
  fp8Tflops: number;
  bandwidthTBps: number;
  tdpWatts: number;
  hourlyRateUSD: number;
  purchaseCostUSD: number;
  interconnect: string;
}

export interface HardwareProcurementBreakdown {
  cloudRentalHourlyUSD: number;
  cloudRentalTotalUSD: number;
  ownedHardwareCapExUSD: number;
  ownedDepreciatedHourlyUSD: number;
  ownedHardwareTotalUSD: number;
  ownedSavingsUSD: number;
  breakevenTrainingHours: number;
  breakevenMonths: number;
}

export interface EconomicsBreakdown {
  totalParamsB: number;
  activeParamsB: number;
  contextWindowLabel: string;
  totalFlops: number;
  mfuPct: number;
  trainingHours: number;
  trainingDays: number;
  preTrainingComputeCostUSD: number;
  dataAcquisitionCostUSD: number;
  postTrainingCostUSD: number;
  powerMegawatts: number;
  totalEnergyMWh: number;
  powerCoolingCostUSD: number;
  grandTotalBuildCostUSD: number;
  procurement: HardwareProcurementBreakdown;
  weightBytesPerParam: number;
  gradBytesPerParam: number;
  optBytesPerParam: number;
  activationBufferGB: number;
  trainingVramGB: number;
  trainingVramTB: number;
  minGpusToFitMemory: number;
  clusterFitsMemory: boolean;
  trainingSystemRamTB: number;
  trainingCpuCores: number;
  datasetStorageTB: number;
  checkpointStorageTB: number;
  trainingTotalStorageTB: number;
  trainingTotalStoragePB: number;
  inferenceWeightGB: number;
  kvCacheVramGB: number;
  inferenceVramGB: number;
  canRunOnBadge: string;
  canRunTierColor: 'emerald' | 'cyan' | 'amber' | 'rose';
  inferenceSystemRamGB: number;
  inferenceCpuCores: number;
  inferenceDiskSpaceGB: number;
  inputTokenPricePer1M: number;
  outputTokenPricePer1M: number;
  blendedPricePer1M: number;
  avgOutputTokensPerTask: number;
  costPerTaskUSD: number;
  chinchillaOptimalTokensT: number;
  chinchillaRatio: number;
  chinchillaStatus:
    | 'Chinchilla Optimal Zone'
    | 'Under-Trained (Compute Deficit)'
    | 'Over-Trained (Inference-Optimized)';
  predictedIntelligenceIndex: number;
  predictedOutputSpeedTokPerSec: number;
  predictedTtftSec: number;
  stabilityScore: number;
  subScores: {
    math: number;
    coding: number;
    science: number;
    humanities: number;
    longContext: number;
    multilingual: number;
    multimodal: number;
  };
}

export interface CompetitorModel {
  rank: number | null;
  id: string;
  name: string;
  creator: string;
  license: 'Proprietary' | 'Open Weights';
  intelligenceIndex: number;
  outputSpeed: number; // tok/s
  ttft: number; // seconds
  inputPrice: number; // $/1M
  outputPrice: number; // $/1M
  blendedPrice: number; // $/1M (3:1 ratio)
  costPerTask: number; // $ USD per task
  contextWindow: string;
  contextTokens: number;
  archSummary: string;
  paradigm: ParadigmType;
  totalParamsB: number;
  activeParamsB: number;
  inferenceVramGB: number;
  inferenceDiskGB: number;
  canRunOnBadge: string;
  isUserModel?: boolean;
  isOutlier?: boolean;
  contaminWarning?: boolean;
  subScores: {
    math: number;
    coding: number;
    science: number;
    humanities?: number;
    longContext: number;
    multilingual: number;
    multimodal: number;
  };
}

export interface TrainingEventOption {
  label: string;
  effectDesc: string;
  indexDelta: number;
  lossDelta?: number;
}

export interface TrainingEventAlert {
  id: string;
  stepPct: number;
  title: string;
  description: string;
  options: TrainingEventOption[];
}

export interface TelemetryPoint {
  stepPct: number;
  stage: string;
  trainLoss: number;
  valLoss: number;
  testLoss: number;
  gradNorm: number;
  mfu: number;
  mwDraw: number;
}

export interface DeltaTag {
  label: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface TooltipSpec {
  id: string;
  title: string;
  whatItIs: string;
  increasingEffect: string;
  increasingTags: DeltaTag[];
  decreasingEffect: string;
  decreasingTags: DeltaTag[];
}
