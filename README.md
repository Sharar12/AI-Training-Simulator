# 🧠 A.I. Training Simulator (Frontier Lab)

An interactive, full-stack **Frontier AI Model Training & Hardware Economics Simulator** built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Recharts**.

Simulate large language model training runs, compute budgets, Chinchilla scaling dynamics, GPU cluster topologies, inference footprint, and benchmark your custom model against state-of-the-art frontier models in real time.

---

## ✨ Key Features

- **⚡ Architecture & Scaling Simulator**
  - Choose between **Dense Transformers**, **Sparse Mixture-of-Experts (MoE)**, and **Hybrid Mamba-Transformer** architectures.
  - Scale parameters from sub-billion edge models up to multi-trillion frontier systems.
  - Dynamic Chinchilla-optimal compute budget calculations (FLOPs, dataset token sizing, compute-to-data ratios).

- **🖥️ Hardware Topology & Datacenter Economics**
  - Select accelerator clusters: NVIDIA H100 SXM5, H200, B200 NVL, Blackwell, and custom topologies.
  - Model Training FLOPs Utilization (MFU), interconnect overhead (NVLink / InfiniBand), and cluster scaling efficiency.
  - Power consumption (MW), datacenter cooling overhead (PUE), total energy consumption (MWh), and overall training run expenditure in USD.

- **💾 Inference Footprint & Serving Economics Dock**
  - Live calculations for weights VRAM, KV cache footprint across batch sizes, context window lengths, and activation memory.
  - Real-time token economics: Input/Output price per 1M tokens, time-to-first-token (TTFT), and generation throughput (tokens/sec).
  - Target hardware badges: see if your model fits on a single consumer GPU, 8x H100 node, or requires multi-node distributed serving.

- **📊 Live Competitor Leaderboard & Radar Benchmarks**
  - Live Artificial Analysis style Intelligence Index and benchmark radar visualizations.
  - Directly compare your simulated model against industry standards: GPT-4o, Claude 3.5 Sonnet, DeepSeek V3 / R1, Llama 3.1 405B, Gemini 1.5 Pro, and Mistral Large.
  - Sub-scores breakdown across Math, Coding, Reasoning, Science, Multilingual, and Long-Context capabilities.

- **🔍 Interactive Hyperparameter Trade-Off Matrix**
  - Built-in encyclopedia detailing the real-world trade-offs of learning rates, context windows, batch sizes, weight decay, quantization precisions (FP8, BF16, INT4), and architectural choices.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or newer recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sharar12/AI-Training-Simulator.git
   cd AI-Training-Simulator/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start the simulation.

---

## 📦 Project Structure

```
AI-Training-Simulator/
├── frontend/                  # Next.js 16 web application
│   ├── app/
│   │   ├── globals.css        # Global Tailwind styles
│   │   ├── layout.tsx         # Root layout & metadata
│   │   └── page.tsx           # Frontier Lab Simulator UI & calculation engine
│   ├── public/                # Static assets & icons
│   ├── package.json           # Dependencies and scripts
│   ├── tsconfig.json          # TypeScript configuration
│   └── next.config.ts         # Next.js Turbopack configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

---

## 📜 Available Scripts

Inside the `frontend` directory:

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Runs the Next.js dev server with Turbopack |
| Type Check | `npx tsc --noEmit` | Validates TypeScript types across the project |
| Build | `npm run build` | Builds the production bundle |
| Start | `npm run start` | Runs the built production server |
| Lint | `npm run lint` | Runs ESLint |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
