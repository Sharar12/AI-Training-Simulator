'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Cpu,
  Database,
  DollarSign,
  Download,
  FastForward,
  FileText,
  Flame,
  HardDrive,
  HelpCircle,
  Layers,
  Pause,
  Play,
  PlusCircle,
  Radar as RadarIcon,
  RefreshCw,
  RotateCcw,
  ScatterChart as ScatterIcon,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';


// --- MODULE: competitor-models.ts ---
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
  costPerTask: number; // $ USD per AA Index task
  contextWindow: string;
  contextTokens: number;
  archSummary: string;
  paradigm: 'Dense' | 'Sparse MoE' | 'Hybrid Mamba-Transformer';
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
    longContext: number;
    multilingual: number;
    multimodal: number;
  };
}

export const COMPETITOR_MODELS: CompetitorModel[] = [
  {
    rank: 1,
    id: 'gpt-5-6-sol',
    name: 'GPT-5.6 Sol',
    creator: 'OpenAI',
    license: 'Proprietary',
    intelligenceIndex: 58.9,
    outputSpeed: 75,
    ttft: 1.45,
    inputPrice: 3.00,
    outputPrice: 15.00,
    blendedPrice: 6.00,
    costPerTask: 0.068,
    contextWindow: '1.05M',
    contextTokens: 1050000,
    archSummary: 'MoE (~1.8T / 1,100 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 1800,
    activeParamsB: 220,
    inferenceVramGB: 1100,
    inferenceDiskGB: 920,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 94.2, coding: 91.8, science: 89.5, longContext: 93.0, multilingual: 92.4, multimodal: 91.0 },
  },
  {
    rank: 2,
    id: 'claude-opus-5-5-max',
    name: 'Claude Opus 5.5 (Max)',
    creator: 'Anthropic',
    license: 'Proprietary',
    intelligenceIndex: 57.6,
    outputSpeed: 98,
    ttft: 1.32,
    inputPrice: 4.00,
    outputPrice: 20.00,
    blendedPrice: 8.00,
    costPerTask: 0.089,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Dense/Hybrid (~1.2T / 960 GB VRAM)',
    paradigm: 'Hybrid Mamba-Transformer',
    totalParamsB: 1200,
    activeParamsB: 480,
    inferenceVramGB: 960,
    inferenceDiskGB: 810,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 91.8, coding: 94.6, science: 90.2, longContext: 92.5, multilingual: 90.8, multimodal: 89.4 },
  },
  {
    rank: 3,
    id: 'claude-sonnet-5-5-max',
    name: 'Claude Sonnet 5.5 (Max)',
    creator: 'Anthropic',
    license: 'Proprietary',
    intelligenceIndex: 56.0,
    outputSpeed: 147,
    ttft: 0.84,
    inputPrice: 3.00,
    outputPrice: 15.00,
    blendedPrice: 6.00,
    costPerTask: 0.058,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'MoE (~400B / 320 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 400,
    activeParamsB: 65,
    inferenceVramGB: 320,
    inferenceDiskGB: 265,
    canRunOnBadge: 'Requires 2x Mac Studio M4 Ultra (512GB Unified)',
    subScores: { math: 89.5, coding: 93.8, science: 87.4, longContext: 90.1, multilingual: 88.9, multimodal: 88.2 },
  },
  {
    rank: 4,
    id: 'muse-wonder-full-max',
    name: 'Muse Wonder Full (Max)',
    creator: 'Meta',
    license: 'Proprietary',
    intelligenceIndex: 55.8,
    outputSpeed: 162,
    ttft: 0.79,
    inputPrice: 2.50,
    outputPrice: 10.00,
    blendedPrice: 4.38,
    costPerTask: 0.044,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'MoE (~1.5T / 900 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 1500,
    activeParamsB: 140,
    inferenceVramGB: 900,
    inferenceDiskGB: 760,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 90.1, coding: 89.7, science: 86.8, longContext: 89.5, multilingual: 91.2, multimodal: 90.4 },
  },
  {
    rank: 5,
    id: 'gpt-5-6-terra',
    name: 'GPT-5.6 Terra',
    creator: 'OpenAI',
    license: 'Proprietary',
    intelligenceIndex: 55.0,
    outputSpeed: 135,
    ttft: 0.92,
    inputPrice: 2.50,
    outputPrice: 10.50,
    blendedPrice: 4.50,
    costPerTask: 0.046,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'MoE (~900B / 640 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 900,
    activeParamsB: 110,
    inferenceVramGB: 640,
    inferenceDiskGB: 520,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 89.8, coding: 89.2, science: 86.5, longContext: 90.4, multilingual: 89.7, multimodal: 88.9 },
  },
  {
    rank: 6,
    id: 'claude-fable-5-1-max',
    name: 'Claude Fable 5.1 (Max)',
    creator: 'Anthropic',
    license: 'Proprietary',
    intelligenceIndex: 53.4,
    outputSpeed: 71,
    ttft: 1.65,
    inputPrice: 5.00,
    outputPrice: 25.00,
    blendedPrice: 10.00,
    costPerTask: 0.112,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Dense Reasoning (~800B / 720 GB VRAM)',
    paradigm: 'Dense',
    totalParamsB: 800,
    activeParamsB: 800,
    inferenceVramGB: 720,
    inferenceDiskGB: 640,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 90.4, coding: 91.2, science: 88.9, longContext: 87.2, multilingual: 86.5, multimodal: 84.0 },
  },
  {
    rank: 7,
    id: 'deepseek-v4-pro-0813',
    name: 'DeepSeek V4 Pro (0813)',
    creator: 'DeepSeek',
    license: 'Open Weights',
    intelligenceIndex: 53.2,
    outputSpeed: 115,
    ttft: 0.88,
    inputPrice: 0.28,
    outputPrice: 1.10,
    blendedPrice: 0.49,
    costPerTask: 0.0058,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Sparse MoE (1T Total, MLA / 680 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 1000,
    activeParamsB: 42,
    inferenceVramGB: 680,
    inferenceDiskGB: 540,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 93.5, coding: 91.4, science: 87.2, longContext: 88.6, multilingual: 85.4, multimodal: 81.2 },
  },
  {
    rank: 8,
    id: 'gpt-6-astra-max',
    name: 'GPT-6 Astra (Max)',
    creator: 'OpenAI',
    license: 'Proprietary',
    intelligenceIndex: 52.7,
    outputSpeed: 89,
    ttft: 1.50,
    inputPrice: 10.00,
    outputPrice: 50.00,
    blendedPrice: 20.00,
    costPerTask: 0.215,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Frontier MoE (~2.4T / 1,600 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 2400,
    activeParamsB: 320,
    inferenceVramGB: 1600,
    inferenceDiskGB: 1350,
    canRunOnBadge: 'Datacenter Multi-Node Cluster Required',
    subScores: { math: 88.9, coding: 87.8, science: 89.4, longContext: 91.0, multilingual: 90.2, multimodal: 89.5 },
  },
  {
    rank: 9,
    id: 'gemini-4-argon-high',
    name: 'Gemini 4 Argon (High)',
    creator: 'Google',
    license: 'Proprietary',
    intelligenceIndex: 52.6,
    outputSpeed: 99,
    ttft: 0.95,
    inputPrice: 2.00,
    outputPrice: 10.00,
    blendedPrice: 4.00,
    costPerTask: 0.041,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Multimodal MoE (~1.2T / 800 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 1200,
    activeParamsB: 130,
    inferenceVramGB: 800,
    inferenceDiskGB: 660,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 87.6, coding: 86.9, science: 88.1, longContext: 95.2, multilingual: 91.8, multimodal: 94.6 },
  },
  {
    rank: 10,
    id: 'muse-wonder-max',
    name: 'Muse Wonder (Max)',
    creator: 'Meta',
    license: 'Proprietary',
    intelligenceIndex: 52.4,
    outputSpeed: 181,
    ttft: 0.64,
    inputPrice: 1.80,
    outputPrice: 7.20,
    blendedPrice: 3.15,
    costPerTask: 0.032,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'MoE (~600B / 420 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 600,
    activeParamsB: 75,
    inferenceVramGB: 420,
    inferenceDiskGB: 340,
    canRunOnBadge: 'Requires 2x Mac Studio M4 Ultra (512GB Unified)',
    subScores: { math: 86.8, coding: 87.2, science: 84.9, longContext: 88.0, multilingual: 88.4, multimodal: 87.5 },
  },
  {
    rank: 11,
    id: 'gpt-6-1-sol-max',
    name: 'GPT-6.1 Sol (Max)',
    creator: 'OpenAI',
    license: 'Proprietary',
    intelligenceIndex: 51.8,
    outputSpeed: 340,
    ttft: 0.42,
    inputPrice: 1.50,
    outputPrice: 6.00,
    blendedPrice: 2.63,
    costPerTask: 0.025,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Fast MoE (~500B / 360 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 500,
    activeParamsB: 45,
    inferenceVramGB: 360,
    inferenceDiskGB: 290,
    canRunOnBadge: 'Requires 2x Mac Studio M4 Ultra (512GB Unified)',
    subScores: { math: 86.4, coding: 87.9, science: 84.2, longContext: 88.5, multilingual: 87.1, multimodal: 86.8 },
  },
  {
    rank: 12,
    id: 'gpt-5-6-luna',
    name: 'GPT-5.6 Luna',
    creator: 'OpenAI',
    license: 'Proprietary',
    intelligenceIndex: 51.2,
    outputSpeed: 190,
    ttft: 0.55,
    inputPrice: 1.20,
    outputPrice: 4.80,
    blendedPrice: 2.10,
    costPerTask: 0.020,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Compact MoE (~300B / 240 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 300,
    activeParamsB: 38,
    inferenceVramGB: 240,
    inferenceDiskGB: 190,
    canRunOnBadge: 'Requires 2x Mac Studio M4 Ultra (512GB Unified)',
    subScores: { math: 85.2, coding: 86.4, science: 83.8, longContext: 87.4, multilingual: 86.2, multimodal: 85.9 },
  },
  {
    rank: 13,
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    creator: 'Anthropic',
    license: 'Proprietary',
    intelligenceIndex: 50.8,
    outputSpeed: 88,
    ttft: 1.18,
    inputPrice: 4.00,
    outputPrice: 20.00,
    blendedPrice: 8.00,
    costPerTask: 0.076,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Dense/Hybrid (~1.0T / 850 GB VRAM)',
    paradigm: 'Hybrid Mamba-Transformer',
    totalParamsB: 1000,
    activeParamsB: 420,
    inferenceVramGB: 850,
    inferenceDiskGB: 710,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 84.9, coding: 88.5, science: 85.6, longContext: 88.2, multilingual: 86.4, multimodal: 85.0 },
  },
  {
    rank: 14,
    id: 'gemini-3-5-flash',
    name: 'Gemini 3.5 Flash',
    creator: 'Google',
    license: 'Proprietary',
    intelligenceIndex: 50.2,
    outputSpeed: 265,
    ttft: 0.38,
    inputPrice: 0.30,
    outputPrice: 1.20,
    blendedPrice: 0.53,
    costPerTask: 0.0052,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Ultra-Fast MoE (~180B / 140 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 180,
    activeParamsB: 22,
    inferenceVramGB: 140,
    inferenceDiskGB: 108,
    canRunOnBadge: 'Fits on 1x H200 (141GB) or Mac Studio M4 Ultra',
    subScores: { math: 84.1, coding: 83.8, science: 82.9, longContext: 92.4, multilingual: 87.5, multimodal: 90.2 },
  },
  {
    rank: 15,
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    creator: 'Anthropic',
    license: 'Proprietary',
    intelligenceIndex: 49.6,
    outputSpeed: 78,
    ttft: 1.40,
    inputPrice: 4.00,
    outputPrice: 20.00,
    blendedPrice: 8.00,
    costPerTask: 0.082,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Reasoning (~700B / 600 GB VRAM)',
    paradigm: 'Dense',
    totalParamsB: 700,
    activeParamsB: 700,
    inferenceVramGB: 600,
    inferenceDiskGB: 520,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 86.2, coding: 87.4, science: 84.5, longContext: 84.0, multilingual: 83.2, multimodal: 81.5 },
  },
  {
    rank: 16,
    id: 'muse-spark-1-3-xhigh',
    name: 'Muse Spark 1.3 (Xhigh)',
    creator: 'Meta',
    license: 'Proprietary',
    intelligenceIndex: 48.1,
    outputSpeed: 376,
    ttft: 0.35,
    inputPrice: 1.00,
    outputPrice: 4.00,
    blendedPrice: 1.75,
    costPerTask: 0.018,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'High-Speed MoE (~250B / 192 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 250,
    activeParamsB: 28,
    inferenceVramGB: 192,
    inferenceDiskGB: 150,
    canRunOnBadge: 'Fits on 1x B200 Blackwell (192GB)',
    subScores: { math: 83.4, coding: 84.1, science: 80.8, longContext: 85.2, multilingual: 84.6, multimodal: 83.9 },
  },
  {
    rank: 17,
    id: 'gpt-6-sol-max',
    name: 'GPT-6 Sol (Max)',
    creator: 'OpenAI',
    license: 'Proprietary',
    intelligenceIndex: 47.6,
    outputSpeed: 160,
    ttft: 0.68,
    inputPrice: 2.00,
    outputPrice: 8.00,
    blendedPrice: 3.50,
    costPerTask: 0.036,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'MoE (~550B / 400 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 550,
    activeParamsB: 64,
    inferenceVramGB: 400,
    inferenceDiskGB: 330,
    canRunOnBadge: 'Requires 2x Mac Studio M4 Ultra (512GB Unified)',
    subScores: { math: 82.8, coding: 83.5, science: 81.2, longContext: 86.0, multilingual: 84.1, multimodal: 83.4 },
  },
  {
    rank: 18,
    id: 'grok-4-7-xhigh',
    name: 'Grok 4.7 (Xhigh)',
    creator: 'xAI',
    license: 'Proprietary',
    intelligenceIndex: 46.5,
    outputSpeed: 86,
    ttft: 1.12,
    inputPrice: 1.50,
    outputPrice: 6.00,
    blendedPrice: 2.63,
    costPerTask: 0.029,
    contextWindow: '500K',
    contextTokens: 500000,
    archSummary: 'MoE (~1.0T / 720 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 1000,
    activeParamsB: 140,
    inferenceVramGB: 720,
    inferenceDiskGB: 580,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 84.5, coding: 82.6, science: 81.9, longContext: 79.4, multilingual: 80.5, multimodal: 81.8 },
  },
  {
    rank: 19,
    id: 'mimo-v2-6-pro',
    name: 'MiMo-V2.6-Pro',
    creator: 'Xiaomi',
    license: 'Open Weights',
    intelligenceIndex: 46.3,
    outputSpeed: 196,
    ttft: 0.51,
    inputPrice: 0.25,
    outputPrice: 1.00,
    blendedPrice: 0.44,
    costPerTask: 0.0045,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Open MoE (~230B / 160 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 230,
    activeParamsB: 24,
    inferenceVramGB: 160,
    inferenceDiskGB: 128,
    canRunOnBadge: 'Fits on 1x B200 Blackwell (192GB)',
    subScores: { math: 83.9, coding: 84.2, science: 79.8, longContext: 83.5, multilingual: 82.9, multimodal: 80.4 },
  },
  {
    rank: 20,
    id: 'qwen3-8-max-0902',
    name: 'Qwen3.8 Max (0902)',
    creator: 'Alibaba',
    license: 'Proprietary',
    intelligenceIndex: 45.4,
    outputSpeed: 38,
    ttft: 1.85,
    inputPrice: 1.50,
    outputPrice: 6.00,
    blendedPrice: 2.63,
    costPerTask: 0.028,
    contextWindow: '984K',
    contextTokens: 984000,
    archSummary: 'Dense/MoE (~800B / 640 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 800,
    activeParamsB: 160,
    inferenceVramGB: 640,
    inferenceDiskGB: 510,
    canRunOnBadge: 'Requires 1x 8xH200 Node (1,128GB VRAM)',
    subScores: { math: 84.2, coding: 83.1, science: 80.5, longContext: 82.0, multilingual: 86.8, multimodal: 81.2 },
  },
  // High-speed / open-weight Pareto reference outliers
  {
    rank: 21,
    id: 'glm-5-3',
    name: 'GLM-5.3',
    creator: 'Zhipu AI',
    license: 'Open Weights',
    intelligenceIndex: 44.8,
    outputSpeed: 678,
    ttft: 0.21,
    inputPrice: 0.50,
    outputPrice: 2.38,
    blendedPrice: 0.97,
    costPerTask: 0.0088,
    contextWindow: '500K',
    contextTokens: 500000,
    archSummary: 'Ultra-Fast MoE (~160B / 112 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 160,
    activeParamsB: 12,
    inferenceVramGB: 112,
    inferenceDiskGB: 88,
    canRunOnBadge: 'Fits on 1x H200 (141GB) or Mac Studio M4 Ultra',
    isOutlier: true,
    subScores: { math: 81.4, coding: 82.8, science: 78.5, longContext: 80.2, multilingual: 83.6, multimodal: 77.9 },
  },
  {
    rank: 22,
    id: 'kimi-k3',
    name: 'Kimi K3',
    creator: 'Moonshot AI',
    license: 'Open Weights',
    intelligenceIndex: 43.6,
    outputSpeed: 154,
    ttft: 0.62,
    inputPrice: 0.22,
    outputPrice: 0.88,
    blendedPrice: 0.39,
    costPerTask: 0.0041,
    contextWindow: '2.0M',
    contextTokens: 2000000,
    archSummary: 'Long-Context MLA MoE (~240B / 168 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 240,
    activeParamsB: 26,
    inferenceVramGB: 168,
    inferenceDiskGB: 132,
    canRunOnBadge: 'Fits on 1x B200 Blackwell (192GB)',
    isOutlier: true,
    subScores: { math: 80.8, coding: 80.2, science: 77.9, longContext: 93.8, multilingual: 82.1, multimodal: 76.5 },
  },
  {
    rank: 23,
    id: 'claude-haiku-5-5',
    name: 'Claude Haiku 5.5',
    creator: 'Anthropic',
    license: 'Proprietary',
    intelligenceIndex: 43.4,
    outputSpeed: 174,
    ttft: 0.34,
    inputPrice: 0.10,
    outputPrice: 0.50,
    blendedPrice: 0.20,
    costPerTask: 0.0019,
    contextWindow: '500K',
    contextTokens: 500000,
    archSummary: 'Compact Fast (~70B / 48 GB VRAM)',
    paradigm: 'Dense',
    totalParamsB: 70,
    activeParamsB: 70,
    inferenceVramGB: 48,
    inferenceDiskGB: 38,
    canRunOnBadge: 'Fits on 1x H100 (80GB) or Mac Studio M4 Max',
    isOutlier: true,
    subScores: { math: 78.5, coding: 82.4, science: 77.2, longContext: 81.0, multilingual: 80.4, multimodal: 79.8 },
  },
  {
    rank: 24,
    id: 'deepseek-v4-1-flash',
    name: 'DeepSeek V4.1 Flash',
    creator: 'DeepSeek',
    license: 'Open Weights',
    intelligenceIndex: 39.5,
    outputSpeed: 176,
    ttft: 0.31,
    inputPrice: 0.07,
    outputPrice: 0.35,
    blendedPrice: 0.14,
    costPerTask: 0.0013,
    contextWindow: '1.0M',
    contextTokens: 1000000,
    archSummary: 'Distilled MLA MoE (~90B / 56 GB VRAM)',
    paradigm: 'Sparse MoE',
    totalParamsB: 90,
    activeParamsB: 9,
    inferenceVramGB: 56,
    inferenceDiskGB: 46,
    canRunOnBadge: 'Fits on 1x H100 (80GB) or Mac Studio M4 Max',
    isOutlier: true,
    subScores: { math: 81.2, coding: 79.8, science: 74.5, longContext: 82.4, multilingual: 76.0, multimodal: 71.2 },
  },
];

// --- MODULE: tooltip-registry.ts ---
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

export const TOOLTIP_REGISTRY: Record<string, TooltipSpec> = {
  modelName: {
    id: 'modelName',
    title: 'Model Identifier & Build Tag',
    whatItIs: 'Unique registry codename used across telemetry logs, safetensor checkpoints, and Artificial Analysis leaderboard entries.',
    increasingEffect: 'Adding specific version/reasoning suffixes (e.g., "-Max", "-0813", "-Pro") clarifies build lineage across multi-run experiments.',
    increasingTags: [{ label: '+Traceability', tone: 'positive' }],
    decreasingEffect: 'Short, minimalist identifiers keep scatter-plot data labels compact on dense Pareto charts.',
    decreasingTags: [{ label: '+Chart Clarity', tone: 'positive' }],
  },
  license: {
    id: 'license',
    title: 'Weights & Distribution License',
    whatItIs: 'Determines whether the model is served exclusively via metered cloud API (Proprietary) or released as downloadable safetensors (Open Weights).',
    increasingEffect: 'Switching to Open Weights (Apache 2.0 / MIT) enables self-hosted vLLM deployment and places your model on the Open-Weights Pareto frontier.',
    increasingTags: [
      { label: '+Self-Hostable', tone: 'positive' },
      { label: '-API Margin', tone: 'negative' },
    ],
    decreasingEffect: 'Keeping weights Proprietary protects synthetic CoT distillation pipelines and allows higher commercial API token margins.',
    decreasingTags: [
      { label: '+IP Protection', tone: 'positive' },
      { label: 'Cloud Locked', tone: 'neutral' },
    ],
  },
  paradigm: {
    id: 'paradigm',
    title: 'Architecture Paradigm (Dense vs. Sparse MoE vs. Hybrid)',
    whatItIs: 'Defines how token representations route through feed-forward layers and sequence state blocks during prefill and decoding.',
    increasingEffect: 'Switching to Sparse MoE or Hybrid Mamba-Transformer decouples total knowledge capacity from per-token FLOPs, boosting Output Speed (tok/s) by 2.2x–4.5x and slashing API cost.',
    increasingTags: [
      { label: '+150% to +320% tok/s', tone: 'positive' },
      { label: '-65% FLOPs/tok', tone: 'positive' },
      { label: '+Router Instability', tone: 'negative' },
    ],
    decreasingEffect: 'Using a monolithic Dense Transformer maximizes per-parameter utilization and training stability, but activates 100% of weights on every token.',
    decreasingTags: [
      { label: '+Dense Reasoning', tone: 'positive' },
      { label: '+Max Stability', tone: 'positive' },
      { label: '-70% Output Speed', tone: 'negative' },
      { label: '+4x Inference Cost', tone: 'negative' },
    ],
  },
  totalParamsB: {
    id: 'totalParamsB',
    title: 'Total Parameters (1B – 10T)',
    whatItIs: 'Total learnable weight matrices stored in model checkpoints across all attention projections and routed feed-forward experts.',
    increasingEffect: 'Raises Intelligence Index ceiling (+log scale), increases Training Cost linearly, increases Inference & Training VRAM footprint, lowers Output Speed (tok/s) if Dense.',
    increasingTags: [
      { label: '+AA Index Ceiling', tone: 'positive' },
      { label: '+World Knowledge', tone: 'positive' },
      { label: '+Linear Train Cost', tone: 'negative' },
      { label: '+VRAM Footprint', tone: 'negative' },
    ],
    decreasingEffect: 'Lowers VRAM & Disk footprint (enables local/edge deployment), boosts tok/s, lowers API Input/Output cost, caps maximum reasoning ceiling unless heavily over-trained.',
    decreasingTags: [
      { label: '-VRAM & Disk', tone: 'positive' },
      { label: '+Edge Deployable', tone: 'positive' },
      { label: '+Output tok/s', tone: 'positive' },
      { label: '-Reasoning Ceiling', tone: 'negative' },
    ],
  },
  activeParamRatio: {
    id: 'activeParamRatio',
    title: 'MoE Active Parameter Ratio (Sparse MoE)',
    whatItIs: 'Percentage of total parameters activated per token by the Top-K softmax router (plus shared experts) during forward/backward passes.',
    increasingEffect: 'Improves per-token knowledge synthesis and dense reasoning, but increases FLOPs per token, lowers tok/s, and raises API Input/Output cost.',
    increasingTags: [
      { label: '+Per-Token Reasoning', tone: 'positive' },
      { label: '+FLOPs/Token', tone: 'negative' },
      { label: '-Output tok/s', tone: 'negative' },
      { label: '+API Token Price', tone: 'negative' },
    ],
    decreasingEffect: 'Dramatically boosts Output Speed (tok/s) and slashes Input/Output token pricing, while keeping total parameter knowledge capacity high (at the cost of high VRAM to hold all inactive experts).',
    decreasingTags: [
      { label: '++Output Speed (tok/s)', tone: 'positive' },
      { label: '--API Token Cost', tone: 'positive' },
      { label: 'High Static VRAM', tone: 'negative' },
    ],
  },
  attention: {
    id: 'attention',
    title: 'Attention Mechanism (MHA vs. GQA vs. MLA)',
    whatItIs: 'Controls how Key-Value (KV) states are projected and cached in HBM memory across long sequence contexts.',
    increasingEffect: 'Switching to MLA (Multi-Head Latent Attention) compresses KV-Cache VRAM by ~75%–82%, drastically reduces long-context memory explosion at 1M+ tokens, and boosts high-concurrency throughput.',
    increasingTags: [
      { label: '-78% KV-Cache VRAM', tone: 'positive' },
      { label: '+1M+ Context Scaling', tone: 'positive' },
      { label: '+Decode Throughput', tone: 'positive' },
    ],
    decreasingEffect: 'Reverting to standard MHA (Multi-Head Attention) preserves uncompressed per-head expressivity but causes severe KV-Cache VRAM explosion at >128K context.',
    decreasingTags: [
      { label: '+0.3 Expressivity', tone: 'positive' },
      { label: '+4x KV-Cache VRAM', tone: 'negative' },
      { label: '-Long-Context OOM Risk', tone: 'negative' },
    ],
  },
  contextWindow: {
    id: 'contextWindow',
    title: 'Context Window Length (8K – 10M Tokens)',
    whatItIs: 'Maximum sequence length the model can attend to in a single forward pass via RoPE / YaRN frequency scaling and context annealing.',
    increasingEffect: 'Unlocks whole-codebase comprehension and 1M+ RULER retrieval scores, but increases KV-Cache Inference VRAM, Training Activation Buffer, and prefill TTFT latency.',
    increasingTags: [
      { label: '+RULER Long-Context', tone: 'positive' },
      { label: '+KV-Cache VRAM', tone: 'negative' },
      { label: '+Activation Memory', tone: 'negative' },
    ],
    decreasingEffect: 'Minimizes KV-Cache VRAM and activation checkpointing overhead, enabling ultra-low-latency serving on smaller GPU nodes.',
    decreasingTags: [
      { label: '-KV-Cache Overhead', tone: 'positive' },
      { label: '+Faster Prefill', tone: 'positive' },
      { label: '-Repo-Scale Context', tone: 'negative' },
    ],
  },
  precision: {
    id: 'precision',
    title: 'Precision / Quantization (FP32 / BF16 / FP8 / INT4)',
    whatItIs: 'Numerical bit-width used to represent weights, activations, and KV caches during training and deployment.',
    increasingEffect: 'Higher Precision (BF16/FP32) gives maximum numerical stability and zero quantization degradation, but requires 2x–4x more VRAM, Disk Space, and cluster cost.',
    increasingTags: [
      { label: '+Max Stability', tone: 'positive' },
      { label: '0.0 Quant Penalty', tone: 'positive' },
      { label: '+2x–4x VRAM & Disk', tone: 'negative' },
      { label: '+2x Compute Cost', tone: 'negative' },
    ],
    decreasingEffect: 'Lower Precision (FP8/INT4) cuts Inference VRAM and Disk Space by 50%–75%, increases Output Speed by 1.5x–2.2x, reduces Input/Output API price, with a minor -0.4 to -1.5 point Intelligence penalty and higher gradient spike risk during training.',
    decreasingTags: [
      { label: '-50% to -75% VRAM', tone: 'positive' },
      { label: '+1.5x–2.2x tok/s', tone: 'positive' },
      { label: '-0.4 to -1.5 AA Index', tone: 'negative' },
      { label: '+Grad Spike Risk', tone: 'negative' },
    ],
  },
  optimizer: {
    id: 'optimizer',
    title: 'Optimizer Algorithm (AdamW vs. Muon vs. Lion)',
    whatItIs: 'Update rule that transforms backward-pass gradients into weight updates and dictates per-parameter optimizer state memory.',
    increasingEffect: 'Switching to Muon (Newton-Schulz Orthogonalized Momentum) accelerates token convergence (+0.85 AA Index) and cuts optimizer VRAM from 12B/param (AdamW) to 8B/param.',
    increasingTags: [
      { label: '+0.85 Token Efficiency', tone: 'positive' },
      { label: '-33% Optimizer VRAM', tone: 'positive' },
    ],
    decreasingEffect: 'Standard AdamW provides well-understood hyperparameter transfer across scales, but consumes 12 Bytes per parameter in FP32 master + first/second moment states.',
    decreasingTags: [
      { label: '+Proven Stability', tone: 'positive' },
      { label: '+12B/Param VRAM', tone: 'negative' },
    ],
  },
  gpuType: {
    id: 'gpuType',
    title: 'Datacenter Accelerator Architecture',
    whatItIs: 'Hardware accelerator node defining per-chip HBM capacity, memory bandwidth, TFLOPs throughput, thermal TDP, and hourly cloud rental rate.',
    increasingEffect: 'Upgrading to NVIDIA B200 Blackwell (192GB HBM3e, 2,250 BF16 TFLOPs) slashes wall-clock training time and fewer nodes needed, at a higher $5.20/hr rental & 1,000W TDP.',
    increasingTags: [
      { label: '+2.3x Compute Speed', tone: 'positive' },
      { label: '192GB HBM3e/GPU', tone: 'positive' },
      { label: '1000W TDP Power', tone: 'negative' },
    ],
    decreasingEffect: 'Using H100 (80GB), TPU v6e (32GB), or Ascend 910C (64GB) lowers per-chip hourly rate, but requires higher tensor/pipeline parallelism and more nodes to fit frontier models.',
    decreasingTags: [
      { label: '-Hourly Node Rate', tone: 'positive' },
      { label: '+Interconnect Overhead', tone: 'negative' },
      { label: '+More Nodes Needed', tone: 'negative' },
    ],
  },
  gpuCount: {
    id: 'gpuCount',
    title: 'Cluster GPU Count (128 – 131,072 GPUs)',
    whatItIs: 'Total number of interconnected accelerators allocated to the training job across InfiniBand / RoCEv2 fabric.',
    increasingEffect: 'Compresses wall-clock training duration linearly and provides ample aggregate HBM VRAM for ZeRO-3 sharding, but increases simultaneous Megawatt power draw and communication overhead.',
    increasingTags: [
      { label: '--Wall-Clock Days', tone: 'positive' },
      { label: '+Cluster VRAM Pool', tone: 'positive' },
      { label: '+Peak MW Draw', tone: 'negative' },
      { label: '-AllReduce MFU Penalty', tone: 'negative' },
    ],
    decreasingEffect: 'Improves per-GPU Model FLOPs Utilization (MFU %) and lowers peak datacenter power draw, but stretches training duration and can trigger OOM if below minimum VRAM threshold.',
    decreasingTags: [
      { label: '+Higher MFU %', tone: 'positive' },
      { label: '-Peak Power MW', tone: 'positive' },
      { label: '++Training Duration', tone: 'negative' },
    ],
  },
  totalTokensT: {
    id: 'totalTokensT',
    title: 'Pre-Training Dataset Volume (Trillions of Tokens)',
    whatItIs: 'Total token budget streamed through the model during pre-training and long-context annealing (measured against the 20 tokens/active-param Chinchilla baseline).',
    increasingEffect: 'Drives lower validation cross-entropy loss and raises AA Intelligence Index (enabling compact models to punch above their weight), while scaling Compute Cost, Power MWh, and NVMe Dataset Storage linearly.',
    increasingTags: [
      { label: '+AA Intelligence Index', tone: 'positive' },
      { label: '+Over-Train Generalization', tone: 'positive' },
      { label: '+Linear Compute Cost', tone: 'negative' },
      { label: '+NVMe Dataset TB', tone: 'negative' },
    ],
    decreasingEffect: 'Slashes pre-training compute budget, power consumption, and wall-clock time, but risks severe under-training (Chinchilla deficit) if tokens fall below 20x Active Parameters.',
    decreasingTags: [
      { label: '--Compute CapEx', tone: 'positive' },
      { label: '--Training Hours', tone: 'positive' },
      { label: '-Under-Trained Penalty', tone: 'negative' },
    ],
  },
  trainValTestSplit: {
    id: 'trainValTestSplit',
    title: 'Training / Validation / Test Split (%)',
    whatItIs: 'Partitioning of the curated token corpus into gradient-descent Training shards, held-out Validation checkpoints, and locked Test evaluation sets.',
    increasingEffect: 'Allocating a larger Validation/Test split (e.g. 94/3/3%) improves early overfitting detection and lowers generalization variance, slightly reducing raw training tokens.',
    increasingTags: [
      { label: '+Overfit Detection', tone: 'positive' },
      { label: '+Eval Statistical Power', tone: 'positive' },
      { label: '-2% Train Tokens', tone: 'neutral' },
    ],
    decreasingEffect: 'Maximizing Training allocation (99.0/0.5/0.5%) feeds virtually every token into weight updates, but increases validation noise on niche domain benchmarks.',
    decreasingTags: [
      { label: '+Max Gradient Tokens', tone: 'positive' },
      { label: '+Eval Variance', tone: 'negative' },
    ],
  },
  decontaminationFilter: {
    id: 'decontaminationFilter',
    title: 'Strict Benchmark Decontamination Filter (N-Gram + Embedding)',
    whatItIs: 'Automated pipeline that purges AIME, GPQA, SWE-Bench, and MMLU-Pro test overlaps from pre-training web crawls and synthetic sets.',
    increasingEffect: 'Enabling guarantees true out-of-distribution generalization and earns a Verified Clean badge on Artificial Analysis, adding minor data curation overhead.',
    increasingTags: [
      { label: '+Verified Clean Eval', tone: 'positive' },
      { label: '+True Generalization', tone: 'positive' },
      { label: '+$120K Data Curation', tone: 'negative' },
    ],
    decreasingEffect: 'Disabling artificially flatters in-run validation loss via benchmark memorization, but triggers a -2.5 pt Contamination Penalty on held-out private AA evaluations.',
    decreasingTags: [
      { label: '-Fake Low Val Loss', tone: 'neutral' },
      { label: '-2.5 AA Clean Penalty', tone: 'negative' },
    ],
  },
  mixWebCrawl: {
    id: 'mixWebCrawl',
    title: 'Web Crawl Corpus Share (FineWeb-Edu / CommonCrawl %)',
    whatItIs: 'Broad filtered internet text providing foundational world knowledge, linguistic fluency, and common-sense priors.',
    increasingEffect: 'Boosts broad trivia and general fluency and lowers per-token data acquisition cost, but dilutes dense STEM, coding, and mathematical reasoning.',
    increasingTags: [
      { label: '+Broad World Knowledge', tone: 'positive' },
      { label: '--Data Cost/Token', tone: 'positive' },
      { label: '-STEM Density', tone: 'negative' },
    ],
    decreasingEffect: 'Frees token budget for high-density Code, Math, and Synthetic CoT, but going below 15% causes brittle conversational grounding.',
    decreasingTags: [
      { label: '+STEM Slot Capacity', tone: 'positive' },
      { label: '-World Knowledge', tone: 'negative' },
    ],
  },
  mixCode: {
    id: 'mixCode',
    title: 'Code & Software Engineering Share (GitHub / CommitPack %)',
    whatItIs: 'Source code, pull requests, execution traces, and CI logs across 80+ programming languages.',
    increasingEffect: 'Directly boosts LiveCodeBench, SWE-Bench Verified, and structured algorithmic planning across all tasks.',
    increasingTags: [
      { label: '++Coding & SWE Score', tone: 'positive' },
      { label: '+Logical Structuring', tone: 'positive' },
      { label: '+Curation Cost', tone: 'negative' },
    ],
    decreasingEffect: 'Reduces software engineering agency and tool-use reliability.',
    decreasingTags: [
      { label: '--Coding Score', tone: 'negative' },
      { label: '-Data Licensing Cost', tone: 'positive' },
    ],
  },
  mixMath: {
    id: 'mixMath',
    title: 'Mathematics & Formal Proofs Share (Lean4 / Olympiad %)',
    whatItIs: 'Competition mathematics, symbolic derivations, and formal theorem-proving corpora.',
    increasingEffect: 'Strongly elevates AIME, MATH-500, and FrontierMath benchmark scores and sharpens multi-step symbolic deduction.',
    increasingTags: [
      { label: '++Math & Olympiad', tone: 'positive' },
      { label: '+Symbolic Rigor', tone: 'positive' },
    ],
    decreasingEffect: 'Caps formal deduction performance even when post-training RLVR is high.',
    decreasingTags: [
      { label: '--Math Ceiling', tone: 'negative' },
    ],
  },
  mixScience: {
    id: 'mixScience',
    title: 'Scientific Literature Share (ArXiv / PubMed / Textbooks %)',
    whatItIs: 'Peer-reviewed physics, chemistry, biology, and graduate-level STEM monographs.',
    increasingEffect: 'Drives higher GPQA Diamond and domain-expert scientific synthesis.',
    increasingTags: [
      { label: '++GPQA Science Score', tone: 'positive' },
      { label: '+Domain Depth', tone: 'positive' },
    ],
    decreasingEffect: 'Weakens graduate-level scientific reasoning on GPQA Diamond.',
    decreasingTags: [
      { label: '-GPQA Diamond Score', tone: 'negative' },
    ],
  },
  mixSyntheticCoT: {
    id: 'mixSyntheticCoT',
    title: 'Synthetic Chain-of-Thought Share (Verified Reasoning Traces %)',
    whatItIs: 'High-purity step-by-step reasoning traces generated by frontier teacher models and filtered by code/math verifiers.',
    increasingEffect: 'Massively accelerates reasoning sample efficiency and boosts overall AA Intelligence Index (+2 to +6 pts), but significantly increases Data Generation Cost ($850K/T tokens).',
    increasingTags: [
      { label: '++AA Intelligence Index', tone: 'positive' },
      { label: '+RLVR Cold-Start Base', tone: 'positive' },
      { label: '++$850K/T Data Cost', tone: 'negative' },
    ],
    decreasingEffect: 'Slashes synthetic generation CapEx, but leaves the base model weaker on multi-hop reasoning before RLVR.',
    decreasingTags: [
      { label: '--Data Gen Cost', tone: 'positive' },
      { label: '-Reasoning Base', tone: 'negative' },
    ],
  },
  mixMultilingual: {
    id: 'mixMultilingual',
    title: 'Multilingual Global Corpus Share (%)',
    whatItIs: 'High-quality native corpora across 100+ non-English languages (CJK, European, Indic, Arabic,Cyrillic).',
    increasingEffect: 'Boosts Global MMLU-Pro and cross-lingual transfer.',
    increasingTags: [
      { label: '++Multilingual Score', tone: 'positive' },
      { label: '+Global Transfer', tone: 'positive' },
    ],
    decreasingEffect: 'Concentrates vocabulary capacity on English/Code at the expense of global language fluency.',
    decreasingTags: [
      { label: '-Multilingual MMLU', tone: 'negative' },
    ],
  },
  mixMultimodal: {
    id: 'mixMultimodal',
    title: 'Multimodal Native Interleaved Tokens (Vision / Audio / Video %)',
    whatItIs: 'Interleaved image-text, document OCR, chart reasoning, and audio/video spatiotemporal tokens.',
    increasingEffect: 'Unlocks native MMMU-Pro vision-language understanding and UI computer-use capability.',
    increasingTags: [
      { label: '++MMMU-Pro Multimodal', tone: 'positive' },
      { label: '+Storage TB/Trillion', tone: 'negative' },
    ],
    decreasingEffect: 'Keeps model text-only or weak on visual document/chart analysis, while saving dataset disk storage.',
    decreasingTags: [
      { label: '-Dataset Storage TB', tone: 'positive' },
      { label: '--Vision Score', tone: 'negative' },
    ],
  },
  sftRounds: {
    id: 'sftRounds',
    title: 'Supervised Fine-Tuning (SFT) Curated Intensity',
    whatItIs: 'Post-training epochs over high-purity human and synthetic instruction-following demonstrations.',
    increasingEffect: 'Improves formatting compliance, multi-turn instruction adherence, and cold-start stability for RLVR.',
    increasingTags: [
      { label: '+Instruction Following', tone: 'positive' },
      { label: '+Post-Train Cost', tone: 'negative' },
    ],
    decreasingEffect: 'Saves post-training compute but leaves raw base model behavior erratic in chat.',
    decreasingTags: [
      { label: '-Post-Train Cost', tone: 'positive' },
      { label: '-Chat Formatting', tone: 'negative' },
    ],
  },
  rlhfAlignment: {
    id: 'rlhfAlignment',
    title: 'RLHF / DPO Alignment & Safety Passes',
    whatItIs: 'Direct Preference Optimization and reward-modeled policy gradients aligning tone, helpfulness, and safety boundaries.',
    increasingEffect: 'Reduces hallucination rate and improves human arena preference, with a slight "alignment tax" on raw creative entropy if over-tuned.',
    increasingTags: [
      { label: '+Arena Win-Rate', tone: 'positive' },
      { label: '-Hallucination Rate', tone: 'positive' },
      { label: '+Human Data Cost', tone: 'negative' },
    ],
    decreasingEffect: 'Eliminates alignment compute cost and preserves raw pre-trained entropy, but increases refusal errors or unsafe outputs.',
    decreasingTags: [
      { label: '-Alignment Cost', tone: 'positive' },
      { label: '+Hallucination Risk', tone: 'negative' },
    ],
  },
  rlvrEffort: {
    id: 'rlvrEffort',
    title: 'RLVR / Thinking Effort (Low / Medium / High / Xhigh / Max)',
    whatItIs: 'Reinforcement Learning with Verifiable Rewards (GRPO math/code/logic rollouts) and inference-time test-time compute budget.',
    increasingEffect: 'Massively boosts Math, Coding, and AA Intelligence Index (+5 to +14 pts), but multiplies Output Tokens per Task (raising total Cost per Task) and increases Time-to-First-Token (TTFT) latency.',
    increasingTags: [
      { label: '+5 to +14 AA Index', tone: 'positive' },
      { label: '++Math & Coding', tone: 'positive' },
      { label: '+3x–8x Cost/Task', tone: 'negative' },
      { label: '+TTFT Latency', tone: 'negative' },
    ],
    decreasingEffect: 'Produces immediate, concise responses with minimal reasoning token overhead and lowest Cost per Task, at a lower peak reasoning score.',
    decreasingTags: [
      { label: '--Cost per Task ($)', tone: 'positive' },
      { label: '--TTFT Latency', tone: 'positive' },
      { label: '-Peak Reasoning Index', tone: 'negative' },
    ],
  },
  simSpeed: {
    id: 'simSpeed',
    title: 'Telemetry Simulation Speed (1x / 5x / 20x / Instant)',
    whatItIs: 'Controls the tick rate of the multi-stage training loop (Pre-Training -> Context Annealing -> SFT -> RLVR).',
    increasingEffect: 'Accelerates epoch progression or jumps straight to final convergence so you can rapidly iterate on leaderboard benchmarks.',
    increasingTags: [
      { label: '+Rapid Iteration', tone: 'positive' },
    ],
    decreasingEffect: 'Runs at 1x real-time telemetry cadence so you can closely inspect live loss curves and manually intervene in cluster anomalies.',
    decreasingTags: [
      { label: '+Granular Inspection', tone: 'positive' },
    ],
  },
  autoMitigateEvents: {
    id: 'autoMitigateEvents',
    title: 'Automated Cluster Anomaly Mitigation',
    whatItIs: 'Watchdog daemon that automatically applies gradient clipping, LR warmup rollback, or expert load-balancing when training spikes occur.',
    increasingEffect: 'Automatically resolves mid-training Gradient Spikes and Math Loss Plateaus with optimal recovery, preventing unmitigated loss divergence.',
    increasingTags: [
      { label: '+Zero Unattended Crash', tone: 'positive' },
      { label: '+Stable Convergence', tone: 'positive' },
    ],
    decreasingEffect: 'Pauses or flags anomalies for manual chief-scientist intervention so you can choose custom recovery trade-offs.',
    decreasingTags: [
      { label: '+Manual Control', tone: 'positive' },
    ],
  },
  scatterAxisMode: {
    id: 'scatterAxisMode',
    title: 'Pareto Frontier X-Axis Metric Selector',
    whatItIs: 'Switches the horizontal dimension of the Artificial Analysis Pareto scatter plot to evaluate throughput vs. unit economics.',
    increasingEffect: 'Viewing Output Speed (tok/s) highlights latency/throughput leaders; viewing Blended Price ($/1M) or Cost per Task ($) reveals economic efficiency.',
    increasingTags: [
      { label: '+Multi-Angle Pareto', tone: 'positive' },
    ],
    decreasingEffect: 'Switching to Inference VRAM (GB) highlights self-hosting hardware efficiency for open-weight deployments.',
    decreasingTags: [
      { label: '+Hardware Pareto', tone: 'positive' },
    ],
  },
};

// --- MODULE: hardware-economics.ts ---
export type ParadigmType = 'Dense' | 'Sparse MoE' | 'Hybrid Mamba-Transformer';
export type AttentionType = 'MHA' | 'GQA' | 'MLA';
export type PrecisionType = 'FP32' | 'BF16' | 'FP8' | 'INT4';
export type OptimizerType = 'AdamW' | 'Muon' | 'Lion';
export type GpuType = 'H100' | 'H200' | 'B200' | 'TPUv6e' | 'Ascend910C';
export type RlvrEffortType = 'Low' | 'Medium' | 'High' | 'Xhigh' | 'Max';

export interface DomainMixture {
  webCrawl: number;
  code: number;
  math: number;
  science: number;
  syntheticCoT: number;
  multilingual: number;
  multimodal: number;
}

export interface SimulatorConfig {
  modelName: string;
  license: 'Proprietary' | 'Open Weights';
  paradigm: ParadigmType;
  totalParamsB: number; // 1 to 10000 (1B to 10T)
  activeParamRatio: number; // 0.03 to 1.0 (3% to 100%)
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
  interconnect: string;
}

export const GPU_SPECS: Record<GpuType, GpuHardwareSpec> = {
  H100: {
    id: 'H100',
    name: 'NVIDIA H100 SXM5 (80GB)',
    vramGB: 80,
    bf16Tflops: 989,
    fp8Tflops: 1979,
    bandwidthTBps: 3.35,
    tdpWatts: 700,
    hourlyRateUSD: 2.65,
    interconnect: 'NVLink 4 (900 GB/s)',
  },
  H200: {
    id: 'H200',
    name: 'NVIDIA H200 SXM (141GB)',
    vramGB: 141,
    bf16Tflops: 989,
    fp8Tflops: 1979,
    bandwidthTBps: 4.8,
    tdpWatts: 700,
    hourlyRateUSD: 3.45,
    interconnect: 'NVLink 4 (900 GB/s)',
  },
  B200: {
    id: 'B200',
    name: 'NVIDIA B200 Blackwell (192GB)',
    vramGB: 192,
    bf16Tflops: 2250,
    fp8Tflops: 4500,
    bandwidthTBps: 8.0,
    tdpWatts: 1000,
    hourlyRateUSD: 5.10,
    interconnect: 'NVLink 5 (1.8 TB/s)',
  },
  TPUv6e: {
    id: 'TPUv6e',
    name: 'Google TPU v6e Trillium (32GB)',
    vramGB: 32,
    bf16Tflops: 918,
    fp8Tflops: 1836,
    bandwidthTBps: 1.6,
    tdpWatts: 450,
    hourlyRateUSD: 1.85,
    interconnect: 'ICI Optical 3D Torus',
  },
  Ascend910C: {
    id: 'Ascend910C',
    name: 'Huawei Ascend 910C (64GB)',
    vramGB: 64,
    bf16Tflops: 780,
    fp8Tflops: 1560,
    bandwidthTBps: 2.4,
    tdpWatts: 650,
    hourlyRateUSD: 2.05,
    interconnect: 'HCCS Mesh',
  },
};

export interface EconomicsBreakdown {
  // Active / Total Params
  totalParamsB: number;
  activeParamsB: number;
  contextWindowLabel: string;

  // A. Total Cost to Make (Build CapEx / OpEx Breakdown)
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

  // B. Hardware Required TO TRAIN (Datacenter Cluster Specs)
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

  // C. Hardware Required TO RUN / INFERENCE (Deployment & Self-Hosting Specs)
  inferenceWeightGB: number;
  kvCacheVramGB: number;
  inferenceVramGB: number;
  canRunOnBadge: string;
  canRunTierColor: 'emerald' | 'cyan' | 'amber' | 'rose';
  inferenceSystemRamGB: number;
  inferenceCpuCores: number;
  inferenceDiskSpaceGB: number;

  // D. API Token Pricing & Task Cost Calculator
  inputTokenPricePer1M: number;
  outputTokenPricePer1M: number;
  blendedPricePer1M: number;
  avgOutputTokensPerTask: number;
  costPerTaskUSD: number;

  // E. Simulated Performance & Chinchilla Metrics
  chinchillaOptimalTokensT: number;
  chinchillaRatio: number;
  chinchillaStatus: 'Under-Trained (Compute Deficit)' | 'Chinchilla Optimal Zone' | 'Over-Trained (Inference-Optimized)';
  predictedIntelligenceIndex: number;
  predictedOutputSpeedTokPerSec: number;
  predictedTtftSec: number;
  stabilityScore: number; // 0-100
  subScores: {
    math: number;
    coding: number;
    science: number;
    longContext: number;
    multilingual: number;
    multimodal: number;
  };
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
    FP8: 1.0,
    INT4: 0.5,
  };
  const gradBytesMap: Record<PrecisionType, number> = {
    FP32: 4.0,
    BF16: 2.0,
    FP8: 2.0, // Master gradients in BF16
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

  // Dataset storage: ~2.8 TB per Trillion tokens + multimodal multiplier
  const tbPerTrillion = 2.6 + (config.domainMixture.multimodal / 100) * 1.8;
  const datasetStorageTB = config.totalTokensT * tbPerTrillion;
  // Rolling NVMe Checkpoint Storage: 5x full model + optimizer state snapshots
  const singleCheckpointTB = (totalParamsB * (weightBytesPerParam + optBytesPerParam)) / 1024;
  const checkpointStorageTB = singleCheckpointTB * 5;
  const trainingTotalStorageTB = datasetStorageTB + checkpointStorageTB;
  const trainingTotalStoragePB = trainingTotalStorageTB / 1024;

  // A. Total Cost to Make (Build CapEx / OpEx Breakdown)
  const effectiveTrainTokensT = config.totalTokensT * (config.trainSplitPct / 100);
  // Long-context annealing adds ~8% to 25% extra FLOPs for >128K windows
  const contextFlopMultiplier =
    1.0 + Math.max(0, Math.log10(Math.max(1, config.contextWindowK / 64))) * 0.12 * attnMemoryFactor;
  const totalFlops =
    6 * (activeParamsB * 1e9) * (effectiveTrainTokensT * 1e12) * contextFlopMultiplier;

  // Effective GPU TFLOPs based on precision
  const peakGpuTflops =
    config.precision === 'FP8' || config.precision === 'INT4'
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
    (config.domainMixture.code + config.domainMixture.math + config.domainMixture.science) / 100;
  const synthShare = config.domainMixture.syntheticCoT / 100;
  const multimodalShare = config.domainMixture.multimodal / 100;

  const baseDataCost = config.totalTokensT * 42000;
  const stemDataCost = config.totalTokensT * stemShare * 185000;
  const synthDataCost = config.totalTokensT * synthShare * 860000;
  const mmDataCost = config.totalTokensT * multimodalShare * 210000;
  const decontamCost = config.decontaminationFilter ? 120000 + config.totalTokensT * 14000 : 0;
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
      : config.precision === 'BF16'
        ? 1.0
        : config.precision === 'FP8'
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
  // Optimal tokens: 20 tokens per active parameter (in Trillions: activeParamsB * 20 / 1000)
  const chinchillaOptimalTokensT = Number(Math.max(0.2, (activeParamsB * 20) / 1000).toFixed(2));
  const chinchillaRatio = Number((effectiveTrainTokensT / chinchillaOptimalTokensT).toFixed(2));

  let chinchillaStatus: EconomicsBreakdown['chinchillaStatus'] = 'Chinchilla Optimal Zone';
  if (chinchillaRatio < 0.65) {
    chinchillaStatus = 'Under-Trained (Compute Deficit)';
  } else if (chinchillaRatio > 1.8) {
    chinchillaStatus = 'Over-Trained (Inference-Optimized)';
  }

  // Intelligence Index calculation (modeled on AA v4.3.2 scale ~25 to 63)
  const effectiveCapacityB =
    config.paradigm === 'Dense'
      ? totalParamsB
      : config.paradigm === 'Sparse MoE'
        ? activeParamsB * 0.45 + Math.pow(totalParamsB, 0.88) * 0.65
        : activeParamsB * 0.6 + totalParamsB * 0.45;

  const paramScore = 18.5 + 8.1 * Math.log10(Math.max(1, effectiveCapacityB));

  // Token scaling contribution
  let tokenDelta = 0;
  if (chinchillaRatio < 1.0) {
    tokenDelta = -6.5 * Math.pow(1.0 - chinchillaRatio, 1.35);
  } else {
    tokenDelta = Math.min(5.8, 3.1 * Math.log2(chinchillaRatio));
  }

  // Domain mixture quality bonus
  const m = config.domainMixture;
  const stemBalance = Math.min(4.2, (m.code * 0.08 + m.math * 0.09 + m.science * 0.07));
  const synthBonus = Math.min(4.5, Math.pow(m.syntheticCoT, 0.78) * 0.36);
  const webPenalty = m.webCrawl < 12 ? -2.2 : m.webCrawl > 65 ? -1.8 : 0.4;

  // Precision & Optimizer & Attention deltas
  const precisionDelta =
    config.precision === 'FP32'
      ? 0.2
      : config.precision === 'BF16'
        ? 0.0
        : config.precision === 'FP8'
          ? -0.4
          : -1.5;
  const optimizerDelta =
    config.optimizer === 'Muon' ? 0.85 : config.optimizer === 'Lion' ? 0.35 : 0.0;
  const attnDelta =
    config.attention === 'MLA' ? 0.45 : config.attention === 'GQA' ? 0.15 : 0.0;

  // Post-training & RLVR Thinking Effort delta (+5 to +14 pts at High/Xhigh/Max)
  const rlvrIndexBonusMap: Record<RlvrEffortType, number> = {
    Low: 0.0,
    Medium: 3.4,
    High: 6.8,
    Xhigh: 10.2,
    Max: 13.5,
  };
  const postTrainDelta =
    config.sftRounds * 0.45 +
    config.rlhfAlignment * 0.35 +
    rlvrIndexBonusMap[config.rlvrEffort];

  const contaminationPenalty = config.decontaminationFilter ? 0.0 : -2.5;

  const rawIndex =
    paramScore +
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

  const predictedIntelligenceIndex = Number(
    Math.min(64.5, Math.max(22.0, rawIndex)).toFixed(1)
  );

  // Output Speed (tok/s)
  const quantSpeedBoost =
    config.precision === 'INT4'
      ? 2.15
      : config.precision === 'FP8'
        ? 1.68
        : config.precision === 'BF16'
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

  // Sub-scores (0-100 scale)
  const baseSub = Math.min(92, 42 + predictedIntelligenceIndex * 0.82);
  const subScores = {
    math: Number(
      Math.min(
        99.2,
        Math.max(35, baseSub + (m.math - 14) * 0.55 + rlvrIndexBonusMap[config.rlvrEffort] * 0.65)
      ).toFixed(1)
    ),
    coding: Number(
      Math.min(
        99.0,
        Math.max(35, baseSub + (m.code - 18) * 0.52 + rlvrIndexBonusMap[config.rlvrEffort] * 0.55)
      ).toFixed(1)
    ),
    science: Number(
      Math.min(
        98.5,
        Math.max(35, baseSub + (m.science - 12) * 0.58 + m.syntheticCoT * 0.25)
      ).toFixed(1)
    ),
    longContext: Number(
      Math.min(
        99.0,
        Math.max(
          30,
          baseSub -
          6 +
          Math.log10(Math.max(8, config.contextWindowK)) * 4.5 +
          (config.attention === 'MLA' ? 5.5 : config.attention === 'GQA' ? 2.5 : -3.0)
        )
      ).toFixed(1)
    ),
    multilingual: Number(
      Math.min(98.0, Math.max(35, baseSub + (m.multilingual - 10) * 0.62)).toFixed(1)
    ),
    multimodal: Number(
      Math.min(98.5, Math.max(25, baseSub - 4 + (m.multimodal - 8) * 0.85)).toFixed(1)
    ),
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

export const PRESET_BLUEPRINTS: { label: string; badge: string; config: SimulatorConfig }[] = [
  {
    label: 'Chronos-V2 Ultra (Frontier MoE)',
    badge: 'Balanced #1 Contender',
    config: {
      modelName: 'Chronos-V2 Ultra (Max)',
      license: 'Open Weights',
      paradigm: 'Sparse MoE',
      totalParamsB: 1000,
      activeParamRatio: 0.08,
      attention: 'MLA',
      contextWindowK: 1000,
      precision: 'FP8',
      optimizer: 'Muon',
      gpuType: 'B200',
      gpuCount: 16384,
      totalTokensT: 24,
      trainSplitPct: 96,
      valSplitPct: 2,
      testSplitPct: 2,
      decontaminationFilter: true,
      domainMixture: {
        webCrawl: 24,
        code: 22,
        math: 16,
        science: 12,
        syntheticCoT: 12,
        multilingual: 7,
        multimodal: 7,
      },
      sftRounds: 4,
      rlhfAlignment: 4,
      rlvrEffort: 'Max',
    },
  },
  {
    label: 'Aether-32B Edge (RTX 5090 Local)',
    badge: 'Fits 1x RTX 5090',
    config: {
      modelName: 'Aether-32B-INT4 (High)',
      license: 'Open Weights',
      paradigm: 'Sparse MoE',
      totalParamsB: 36,
      activeParamRatio: 0.18,
      attention: 'MLA',
      contextWindowK: 256,
      precision: 'INT4',
      optimizer: 'Muon',
      gpuType: 'H200',
      gpuCount: 2048,
      totalTokensT: 18,
      trainSplitPct: 96,
      valSplitPct: 2,
      testSplitPct: 2,
      decontaminationFilter: true,
      domainMixture: {
        webCrawl: 22,
        code: 24,
        math: 18,
        science: 12,
        syntheticCoT: 14,
        multilingual: 5,
        multimodal: 5,
      },
      sftRounds: 3,
      rlhfAlignment: 3,
      rlvrEffort: 'High',
    },
  },
  {
    label: 'Hyperion-2T Colossus (GPT-5.6 Scale)',
    badge: 'Max Intelligence Ceiling',
    config: {
      modelName: 'Hyperion-2T Sol (Max)',
      license: 'Proprietary',
      paradigm: 'Sparse MoE',
      totalParamsB: 2000,
      activeParamRatio: 0.12,
      attention: 'MLA',
      contextWindowK: 2000,
      precision: 'BF16',
      optimizer: 'Muon',
      gpuType: 'B200',
      gpuCount: 32768,
      totalTokensT: 35,
      trainSplitPct: 96,
      valSplitPct: 2,
      testSplitPct: 2,
      decontaminationFilter: true,
      domainMixture: {
        webCrawl: 20,
        code: 22,
        math: 18,
        science: 14,
        syntheticCoT: 14,
        multilingual: 6,
        multimodal: 6,
      },
      sftRounds: 5,
      rlhfAlignment: 4,
      rlvrEffort: 'Max',
    },
  },
  {
    label: 'MambaNova-400B Hybrid (Ultra Speed)',
    badge: 'Sub-Second TTFT',
    config: {
      modelName: 'MambaNova-400B Flash',
      license: 'Open Weights',
      paradigm: 'Hybrid Mamba-Transformer',
      totalParamsB: 400,
      activeParamRatio: 0.14,
      attention: 'MLA',
      contextWindowK: 1000,
      precision: 'FP8',
      optimizer: 'Lion',
      gpuType: 'B200',
      gpuCount: 8192,
      totalTokensT: 20,
      trainSplitPct: 96,
      valSplitPct: 2,
      testSplitPct: 2,
      decontaminationFilter: true,
      domainMixture: {
        webCrawl: 26,
        code: 22,
        math: 14,
        science: 12,
        syntheticCoT: 12,
        multilingual: 7,
        multimodal: 7,
      },
      sftRounds: 3,
      rlhfAlignment: 3,
      rlvrEffort: 'Xhigh',
    },
  },
];

// --- MODULE: SettingTooltip.tsx ---
interface SettingTooltipProps {
  id: string;
  customSpec?: TooltipSpec;
}

export const SettingTooltip: React.FC<SettingTooltipProps> = ({ id, customSpec }) => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const spec = customSpec || TOOLTIP_REGISTRY[id];

  useEffect(() => {
    if (!pinned) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPinned(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pinned]);

  if (!spec) return null;

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center ml-1.5 align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!pinned) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={`What-If info for ${spec.title}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPinned((prev) => !prev);
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-mono transition-all border ${open || pinned
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
            : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-cyan-300 hover:border-cyan-500/60'
          }`}
      >
        <HelpCircle className="w-3 h-3" />
      </button>

      {open && (
        <div
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 left-0 sm:left-auto sm:right-0 top-6 w-80 sm:w-96 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-2xl text-left text-xs text-slate-200 animate-in fade-in duration-150"
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                Interactive What-If Telemetry
              </span>
              <h4 className="font-semibold text-white text-xs mt-0.5">{spec.title}</h4>
            </div>
            {pinned && (
              <button
                type="button"
                onClick={() => {
                  setPinned(false);
                  setOpen(false);
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded"
                aria-label="Close tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed mb-3 text-[11px]">
            <span className="font-semibold text-slate-100">What it is: </span>
            {spec.whatItIs}
          </p>

          <div className="space-y-2.5">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/90">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>🔼 Increasing (▲ Effect)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug mb-1.5">
                {spec.increasingEffect}
              </p>
              <div className="flex flex-wrap gap-1">
                {spec.increasingTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${tag.tone === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : tag.tone === 'negative'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/90">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase tracking-wider font-semibold mb-1">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>🔽 Decreasing (▼ Effect)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug mb-1.5">
                {spec.decreasingEffect}
              </p>
              <div className="flex flex-wrap gap-1">
                {spec.decreasingTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${tag.tone === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : tag.tone === 'negative'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

// --- MODULE: HardwareEconomicsDock.tsx ---
interface HardwareEconomicsDockProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
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
                State: {econ.weightBytesPerParam}B Wt + {econ.gradBytesPerParam}B Grad + {econ.optBytesPerParam}B Opt
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
                  <span className="text-slate-400">Cost per AA Index Task:</span>
                  <span className="text-emerald-300 font-semibold">
                    ${econ.costPerTaskUSD.toFixed(4)} / task
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Speed: {econ.predictedOutputSpeedTokPerSec} tok/s (TTFT {econ.predictedTtftSec}s)</span>
              <span>~{econ.avgOutputTokensPerTask.toLocaleString()} out tok/task</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

// --- MODULE: Module1Architecture.tsx ---
interface Module1ArchitectureProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  onChange: (updater: (prev: SimulatorConfig) => SimulatorConfig) => void;
  onNextStage: () => void;
}

const PARAM_STOPS = [1, 7, 14, 32, 70, 180, 400, 671, 1000, 1800, 3500, 10000];
const CONTEXT_STOPS = [8, 32, 128, 256, 500, 1000, 2000, 5000, 10000];
const GPU_COUNT_STOPS = [128, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072];

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
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition ${config.license === lic
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
                    className={`p-3 rounded-xl text-left border transition ${config.paradigm === item.id
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
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${config.totalParamsB === stop
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                  >
                    {stop >= 1000 ? `${stop / 1000}T` : `${stop}B`}
                  </button>
                ))}
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
                    className={`p-2.5 rounded-xl text-left border transition ${config.attention === attn.id
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
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${config.contextWindowK === stop
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
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition ${config.precision === prec
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
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition ${config.optimizer === opt
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
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${selected
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
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${config.gpuCount === cnt
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

// --- MODULE: Module2DataPipeline.tsx ---
interface Module2DataPipelineProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  onChange: (updater: (prev: SimulatorConfig) => SimulatorConfig) => void;
  onPrevStage: () => void;
  onNextStage: () => void;
}

const DOMAIN_META: {
  key: keyof DomainMixture;
  label: string;
  tooltipId: string;
  color: string;
  barClass: string;
}[] = [
    {
      key: 'webCrawl',
      label: 'Web Crawl (FineWeb-Edu / CommonCrawl)',
      tooltipId: 'mixWebCrawl',
      color: 'text-slate-300',
      barClass: 'bg-slate-400',
    },
    {
      key: 'code',
      label: 'Code & SWE (GitHub / StarCoder / PRs)',
      tooltipId: 'mixCode',
      color: 'text-cyan-300',
      barClass: 'bg-cyan-400',
    },
    {
      key: 'math',
      label: 'Math & Formal Proofs (Lean4 / AIME)',
      tooltipId: 'mixMath',
      color: 'text-emerald-300',
      barClass: 'bg-emerald-400',
    },
    {
      key: 'science',
      label: 'Scientific Research (ArXiv / PubMed)',
      tooltipId: 'mixScience',
      color: 'text-purple-300',
      barClass: 'bg-purple-400',
    },
    {
      key: 'syntheticCoT',
      label: 'Synthetic CoT (Verified Reasoning Traces)',
      tooltipId: 'mixSyntheticCoT',
      color: 'text-amber-300',
      barClass: 'bg-amber-400',
    },
    {
      key: 'multilingual',
      label: 'Multilingual Global Corpus (100+ Langs)',
      tooltipId: 'mixMultilingual',
      color: 'text-pink-300',
      barClass: 'bg-pink-400',
    },
    {
      key: 'multimodal',
      label: 'Multimodal Tokens (Vision / Audio / Video)',
      tooltipId: 'mixMultimodal',
      color: 'text-indigo-300',
      barClass: 'bg-indigo-400',
    },
  ];

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
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${econ.chinchillaStatus.includes('Optimal')
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
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
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
                        className={`py-2 px-2 rounded-xl font-mono text-[11px] font-semibold border transition ${active
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
                  className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-semibold border flex items-center justify-between transition ${config.decontaminationFilter
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
                      className={`py-2.5 px-1.5 rounded-xl font-mono text-xs font-bold border transition text-center ${config.rlvrEffort === effort
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
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">{b.label}</span>
                    <span className="text-white font-bold">{b.val}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`${b.color} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(100, b.val)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE: Module3LiveTraining.tsx ---
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

export interface TrainingEventAlert {
  id: string;
  stepPct: number;
  title: string;
  description: string;
  options: {
    label: string;
    effectDesc: string;
    indexDelta: number;
    lossDelta: number;
  }[];
}

interface Module3LiveTrainingProps {
  config: SimulatorConfig;
  econ: EconomicsBreakdown;
  eventBonusIndex: number;
  onUpdateEventBonus: (delta: number) => void;
  onCompleteRun: () => void;
  onPrevStage: () => void;
}

const TRAINING_EVENTS: TrainingEventAlert[] = [
  {
    id: 'grad-spike-28',
    stepPct: 28,
    title: 'Gradient Norm Spike Detected (||g|| = 6.84)',
    description:
      'High-kurtosis activations in attention projection layers caused a sudden gradient spike during FP8/BF16 mixed-precision accumulation.',
    options: [
      {
        label: 'Rollback 200 Steps & Clip Grad (1.0 -> 0.5) + QK-Norm',
        effectDesc: 'Stabilizes convergence & preserves +0.6 AA Index',
        indexDelta: 0.6,
        lossDelta: -0.04,
      },
      {
        label: 'Push Through Without Rollback',
        effectDesc: 'Saves compute hours but degrades final weights (-0.8 AA Index)',
        indexDelta: -0.8,
        lossDelta: 0.08,
      },
    ],
  },
  {
    id: 'math-plateau-62',
    stepPct: 62,
    title: 'Math & Symbolic Loss Plateau During Context Annealing',
    description:
      'Validation perplexity on formal Lean4 / AIME shards has stalled as RoPE base frequency scales to long context.',
    options: [
      {
        label: 'Inject 15% Verified Synthetic CoT Curriculum + Cosine Anneal',
        effectDesc: 'Breaks plateau & boosts reasoning (+0.9 AA Index)',
        indexDelta: 0.9,
        lossDelta: -0.06,
      },
      {
        label: 'Maintain Static Mixture Schedule',
        effectDesc: 'No extra data cost, minor reasoning stagnation (-0.3 AA Index)',
        indexDelta: -0.3,
        lossDelta: 0.02,
      },
    ],
  },
];

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
  const [simSpeed, setSimSpeed] = useState<1 | 5 | 20 | 100>(5);
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
  const telemetryData: TelemetryPoint[] = React.useMemo(() => {
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

      // Realistic exponential decay + slight noise
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
                className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition ${simSpeed === spd
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
              className={`p-3.5 rounded-xl border transition ${isCurrent
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
                Active Stage: <strong className="text-cyan-300">{currentPoint.stage}</strong> • Progress: <strong className="text-white">{progress}%</strong> ({((config.totalTokensT * progress) / 100).toFixed(2)}T / {config.totalTokensT}T Tokens)
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
              <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
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

// --- MODULE: TrainingSettingsDossier.tsx ---
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
      pct: config.domainMixture.webCrawl,
      tokensT: Number(((config.totalTokensT * config.domainMixture.webCrawl) / 100).toFixed(2)),
      fill: '#94a3b8',
    },
    {
      name: 'Code',
      pct: config.domainMixture.code,
      tokensT: Number(((config.totalTokensT * config.domainMixture.code) / 100).toFixed(2)),
      fill: '#06b6d4',
    },
    {
      name: 'Math',
      pct: config.domainMixture.math,
      tokensT: Number(((config.totalTokensT * config.domainMixture.math) / 100).toFixed(2)),
      fill: '#10b981',
    },
    {
      name: 'Science',
      pct: config.domainMixture.science,
      tokensT: Number(((config.totalTokensT * config.domainMixture.science) / 100).toFixed(2)),
      fill: '#a855f7',
    },
    {
      name: 'Synth CoT',
      pct: config.domainMixture.syntheticCoT,
      tokensT: Number(((config.totalTokensT * config.domainMixture.syntheticCoT) / 100).toFixed(2)),
      fill: '#f59e0b',
    },
    {
      name: 'Multilingual',
      pct: config.domainMixture.multilingual,
      tokensT: Number(((config.totalTokensT * config.domainMixture.multilingual) / 100).toFixed(2)),
      fill: '#ec4899',
    },
    {
      name: 'Multimodal',
      pct: config.domainMixture.multimodal,
      tokensT: Number(((config.totalTokensT * config.domainMixture.multimodal) / 100).toFixed(2)),
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
      totalTokensTrillion: config.totalTokensT,
      effectiveTrainTokensT: Number((config.totalTokensT * (config.trainSplitPct / 100)).toFixed(2)),
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${activeTab === 'budget'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              1. Training Budget Breakdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${activeTab === 'data'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              2. Data Pipeline Mixture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('memory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${activeTab === 'memory'
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
              <span>Total Build Investment: <strong className="text-emerald-400">{formatMoney(econ.grandTotalBuildCostUSD)}</strong></span>
              <span>Total Wall-Clock Training Duration: <strong className="text-cyan-300">{formatTrainingDuration(econ.trainingHours)}</strong></span>
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
              <span>Total Dataset Volume: <strong className="text-cyan-300">{config.totalTokensT} Trillion Tokens</strong></span>
              <span>Effective Training Split: <strong className="text-white">{(config.totalTokensT * (config.trainSplitPct / 100)).toFixed(2)}T ({config.trainSplitPct}%)</strong></span>
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
              <span>Cluster Hardware: <strong className="text-white">{config.gpuCount.toLocaleString()}x {gpu.name}</strong></span>
              <span>Serving Footprint: <strong className="text-amber-300">{econ.canRunOnBadge}</strong></span>
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
                <span className="text-slate-200">{config.totalTokensT} Trillion</span>
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
                      (config.precision === 'FP8' || config.precision === 'INT4'
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
            RLVR Multiplier: {config.rlvrEffort === 'Max' ? '14.5x (+13.5 pts)' : config.rlvrEffort === 'Xhigh' ? '8.6x (+10.2 pts)' : config.rlvrEffort === 'High' ? '4.8x (+6.8 pts)' : config.rlvrEffort === 'Medium' ? '2.3x (+3.4 pts)' : '1.0x (+0.0 pts)'}
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

// --- MODULE: Module4Leaderboard.tsx ---
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
  const [radarOpponentId, setRadarOpponentId] = useState<string>('gpt-5-6-sol');
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
        const diff = a[sortBy] - b[sortBy];
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

  // Top 14 models for Horizontal Ranked Bar Chart (always includes liveUserModel)
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
    COMPETITOR_MODELS.find((m) => m.id === 'deepseek-v4-pro-0813') ||
    COMPETITOR_MODELS[6];

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
            <span>Stage 04 // Artificial Analysis Leaderboard (v4.3.2 Evaluation Suite)</span>
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
            {liveUserModel.intelligenceIndex > 58.9
              ? 'New #1 World Record!'
              : `${(58.9 - liveUserModel.intelligenceIndex).toFixed(1)} pts behind GPT-5.6 Sol`}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-cyan-400 uppercase block flex items-center gap-1">
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

      {/* Row 1 Charts: Pareto Scatter Plot + Horizontal Ranked Bar Chart */}
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
                Y-Axis: AA Intelligence Index • Cyan Star = Your Model
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
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition ${scatterXMetric === axis.key
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
                  domain={[36, 65]}
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
                Compare against Top 20 Competitors
              </p>
            </div>

            <select
              aria-label="Select radar opponent model"
              value={radarOpponentId}
              onChange={(e) => setRadarOpponentId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
            >
              {COMPETITOR_MODELS.map((m) => (
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
                  domain={[40, 100]}
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
                  name="DeepSeek V4 Pro"
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
            v4.3.2 Composite Evaluation (AIME, GPQA, SWE-Bench, LiveCodeBench, MMMU-Pro)
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
                domain={[35, 65]}
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
                className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition ${licenseFilter === lic
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
              <span>Include Speed/Price Outliers (GLM-5.3, Kimi K3, Haiku 5.5, V4.1 Flash)</span>
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
                      className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] ${m.license === 'Open Weights'
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

// --- MODULE: page.tsx ---
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
      title: '4. AA Leaderboard v4.3.2',
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
                  AA v4.3.2 SIMULATOR
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
                className={`px-2.5 py-1.5 rounded-xl font-mono text-xs border transition ${config.modelName === preset.config.modelName
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
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-3 ${isActive
                    ? 'bg-slate-900 border-cyan-500/70 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/60 border-slate-800/90 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                  }`}
              >
                <div
                  className={`p-2 rounded-lg ${isActive
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