/**
 * Career timeline data (spec §4.3 — /runtime route).
 *
 * Each entry maps directly to a Bento card on /runtime, with role + period +
 * industry + metrics + tech + leadership highlights. `lastVerified` is
 * surfaced as a CI warning when stale > CONTENT_STALE_DAYS (default 90).
 */

import type { Experience } from './schemas';

export const experiences: Experience[] = [
  {
    company: 'Montu',
    role: 'Staff Machine Learning Engineer · Privacy-by-Design Architect',
    period: '2023 – Present',
    industry: 'Healthcare',
    metrics: [
      {
        value: '67%',
        direction: '↓',
        label: 'reduction in feature lead times across the GCP ML platform',
        context: 'Montu — GCP ML Platform',
        methodology: 'DORA metrics, pre/post Kubeflow + GitOps migration',
        accent: '#ffb86c'
      },
      {
        value: '97%+',
        direction: '↓',
        label: 'reduction in change-failure rate after platform consolidation',
        context: 'Montu — DORA Outcomes',
        methodology: 'Incident DB diff, 6-month rolling',
        accent: '#ffb86c'
      },
      {
        value: '93%',
        label: 'clinical NLP accuracy (outperforming Google Healthcare NLP by 14 pts)',
        context: 'Montu — Clinical Document Intelligence',
        methodology: 'Held-out clinician-labelled validation set',
        accent: '#ffb86c'
      },
      {
        value: '0.87+',
        direction: '↑',
        label: 'F1 PII redaction score on clinical log sanitisation',
        context: 'Montu — Privacy-by-Design Logging',
        methodology: 'Held-out clinician-annotated PII corpus, micro-F1',
        accent: '#ffb86c'
      }
    ],
    techHighlights: [
      'GCP (GKE, VertexAI, Pub/Sub)',
      'Kubeflow + TFx + DVC pipelines',
      'PyTorch · vLLM · FlashAttention',
      'GraphRAG + LangGraph + DSPy',
      'Postgres · Snowflake · Redis · Kafka'
    ],
    leadershipHighlights: [
      'Hired & mentored Data Scientists and ML Engineers across multiple pods',
      'Authored RFCs for clinical NLP architecture and Privacy-by-Design logging',
      'Cross-functional Build vs Buy negotiation with Product/Compliance/Legal'
    ],
    lastVerified: '2026-04-15'
  },
  {
    company: 'Amber Electric',
    role: 'Senior Machine Learning Engineer · FinOps Strategist',
    period: '2021 – 2023',
    industry: 'Energy',
    metrics: [
      {
        value: '40%',
        direction: '↓',
        label: 'average infrastructure cost optimisation across 10k+ energy sites',
        context: 'Amber — Energy Forecasting Platform',
        methodology: 'GCP billing diff, 6-month rolling, post-FinOps refactor',
        accent: '#ffb86c'
      }
    ],
    techHighlights: [
      'GCP (GKE, Pub/Sub, BigQuery, Dataflow)',
      'Time-series forecasting (ARIMA · Prophet · DeepAR)',
      'Event-driven architecture · Kafka',
      'Terraform · Helm · Datadog'
    ],
    leadershipHighlights: [
      'Led event-driven architecture transition for grid-stability forecasting',
      'Authored FinOps strategy reducing cloud spend across 10k+ energy sites'
    ],
    lastVerified: '2026-04-15'
  },
  {
    company: 'Linktree',
    role: 'Machine Learning Engineer — Recommender Systems',
    period: '2020 – 2021',
    industry: 'Consumer Tech',
    metrics: [
      {
        value: '33%',
        direction: '↑',
        label: 'link adoption gains via the personalised link-recommender',
        context: 'Linktree — Two-Tower Recommender',
        methodology: 'A/B test, 30-day window, user-cohort holdout',
        accent: '#ffb86c'
      },
      {
        value: '18-23%',
        direction: '↑',
        label: 'profile subscription uplift across recommender experiments',
        context: 'Linktree — Profile Subscriptions',
        methodology: 'A/B uplift, 90-day cohort',
        accent: '#ffb86c'
      }
    ],
    techHighlights: [
      'Two-Tower Architecture · Collaborative Filtering',
      'Python · TensorFlow Recommenders',
      'AWS (SageMaker, Lambda, DynamoDB)',
      'Airflow · Feast feature store'
    ],
    leadershipHighlights: [
      'End-to-end recommender ownership from offline metrics to online A/B',
      'Cross-functional product negotiation on metric framing and guardrails'
    ],
    lastVerified: '2026-04-15'
  },
  {
    company: 'ANZ Bank',
    role: 'ML Engineer — Enterprise ID Fraud Detection Platform',
    period: '2019 – 2020',
    industry: 'Finance',
    metrics: [
      {
        value: 'Production',
        label: 'enterprise identity fraud detection on Kubeflow / GKE',
        context: 'ANZ — Enterprise ML Platform',
        methodology: 'Production deploy across multiple business units',
        accent: '#8be9fd'
      }
    ],
    techHighlights: [
      'Kubeflow Pipelines · GKE · Tekton',
      'XGBoost / LightGBM ensembles',
      'Compliance-grade RBAC + audit pipelines'
    ],
    leadershipHighlights: ['Enterprise ML platform architecture across regulated business units'],
    lastVerified: '2026-04-15'
  },
  {
    company: 'nib Group',
    role: 'ML Engineer — Health Insurance Platform',
    period: '2018 – 2019',
    industry: 'Healthcare',
    metrics: [
      {
        value: 'Platform',
        label: 'SageMaker platform extensions powering claims ML workloads',
        context: 'nib — ML Infrastructure',
        accent: '#8be9fd'
      }
    ],
    techHighlights: [
      'AWS SageMaker · Lambda · S3',
      'Clinical claims data engineering',
      'Schema validation · drift monitoring'
    ],
    lastVerified: '2026-04-15'
  },
  {
    company: 'HammondCare',
    role: 'ML Engineer — Customer Triaging',
    period: '2017 – 2018',
    industry: 'Healthcare',
    metrics: [
      {
        value: 'Live',
        label: 'customer-request triaging chatbot in clinical operations',
        context: 'HammondCare — Triaging Chatbot',
        accent: '#8be9fd'
      }
    ],
    techHighlights: [
      'NLU pipelines',
      'Customer-request classification',
      'Production chatbot integration'
    ],
    lastVerified: '2026-04-15'
  },
  {
    company: 'Eliiza',
    role: 'ML Engineer · ML Guild Mentor',
    period: '2016 – 2017',
    industry: 'Consulting',
    metrics: [
      {
        value: '2nd',
        label: 'place at Cricket Australia DataJam 2020 (cross-functional team lead)',
        context: 'Eliiza — Cricket Australia DataJam',
        accent: '#bd93f9'
      },
      {
        value: 'Framework',
        label: '"Thea" document mining framework adopted across consulting engagements',
        context: 'Eliiza — Thea Document Mining',
        accent: '#8be9fd'
      }
    ],
    techHighlights: [
      'Document mining (Thea framework)',
      'NLP pipelines for unstructured legal/clinical text',
      'Cross-functional consulting delivery'
    ],
    leadershipHighlights: ['ML Guild mentoring across the consulting practice'],
    lastVerified: '2026-04-15'
  }
];
