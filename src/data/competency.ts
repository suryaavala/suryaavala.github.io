/**
 * Competency radar (spec §4.4 — /stack route).
 *
 * 8 axes, scores 0-100, each with `methodology` string for self-assessment
 * transparency. Rendered as inline SVG by RadarChart.svelte (no external libs).
 */

import type { CompetencyAxis } from './schemas';

export const competencyAxes: CompetencyAxis[] = [
  {
    label: 'Platform MLOps',
    score: 85,
    methodology: 'Production systems across 5+ orgs, upstream Kubeflow/TFx PRs'
  },
  {
    label: 'Dist. Systems (CAP)',
    score: 82,
    methodology: 'K8s StatefulSets, Kafka, event-driven at Amber/Montu scale'
  },
  {
    label: 'Privacy & Compliance',
    score: 80,
    methodology: '0.87+ F1 PII redaction, RBAC, Privacy-by-Design in healthcare'
  },
  {
    label: 'HPC Compute Opt.',
    score: 68,
    methodology: 'vLLM PagedAttention, FlashAttention, INT8/FP4 quantisation'
  },
  {
    label: 'FinOps & Strategy',
    score: 78,
    methodology: '40% cost reduction at Amber, Build vs Buy RFC authorship'
  },
  {
    label: 'DL Math & Internals',
    score: 65,
    methodology: 'Custom autograd/attention, SVD/PCA derivations, Causal Inference'
  },
  {
    label: 'Agentic Orchestration',
    score: 75,
    methodology: 'scaling-succotash production system, LangGraph/DSPy/MCP/A2A'
  },
  {
    label: 'SWE & Data Eng.',
    score: 83,
    methodology: 'O(1) stdlib optimisation, upstream dask PR, full-stack TS/Python'
  }
];
