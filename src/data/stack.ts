/**
 * Full infrastructure stack (spec §4.4 — /stack route).
 *
 * Grouped by category, matching the README badge surface. Each category gets
 * a Dracula accent for visual grouping; the items render as TechBadge tiles.
 */

import type { StackCategory } from './schemas';

export const stackCategories: StackCategory[] = [
  {
    name: 'Languages & CS Primitives',
    accent: '#8be9fd',
    items: [
      'Python (Asyncio, Metaprogramming)',
      'C / C++',
      'TypeScript',
      'Advanced SQL (Window Functions, CTEs)',
      'Bash / Shell',
      'Perl'
    ]
  },
  {
    name: 'AI/ML & HPC',
    accent: '#ffb86c',
    items: [
      'PyTorch',
      'TensorFlow',
      'Keras',
      'Scikit-Learn',
      'XGBoost / LightGBM',
      'vLLM',
      'FlashAttention',
      'Quantisation (INT8 / FP4)',
      'GPU Profiling (torch.profiler)'
    ]
  },
  {
    name: 'Agentic & GenAI',
    accent: '#bd93f9',
    items: [
      'LangChain',
      'LangGraph',
      'DSPy',
      'MCP',
      'A2A (Agent-to-Agent)',
      'RAG',
      'GraphRAG',
      'Guardrails',
      'Prompt Engineering',
      'Evals',
      'Federated Learning',
      'Differential Privacy'
    ]
  },
  {
    name: 'MLOps & Data Engineering',
    accent: '#50fa7b',
    items: [
      'Kubeflow',
      'ClearML',
      'TFx',
      'MLflow',
      'DVC',
      'Airflow / Prefect',
      'Feast / Tecton',
      'Kafka',
      'BigQuery',
      'Snowflake',
      'PostgreSQL',
      'Redis',
      'Dask'
    ]
  },
  {
    name: 'Cloud & Infrastructure',
    accent: '#8be9fd',
    items: [
      'GCP (GKE, Cloud Run, VertexAI, Pub/Sub)',
      'AWS (EKS, SageMaker, Lambda, DynamoDB)',
      'Docker',
      'Kubernetes (StatefulSets, Operators, CRDs)',
      'Terraform',
      'Helm',
      'CloudWatch',
      'Datadog'
    ]
  },
  {
    name: 'Advanced DL Paradigms',
    accent: '#ff79c6',
    items: [
      'PEFT (LoRA / QLoRA)',
      'RLHF (PPO / DPO)',
      'Transformer Architectures',
      'Custom Autograd / Attention'
    ]
  },
  {
    name: 'Systems Architecture & Theory',
    accent: '#f1fa8c',
    items: [
      'Distributed Systems Theory (CAP, PACELC, Paxos / Raft)',
      'Event-Driven Architecture',
      'Domain-Driven Design (DDD)',
      'Gang of Four Design Patterns',
      'LSM / B-Trees'
    ]
  }
];
