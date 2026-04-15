/**
 * Top-line impact metrics (spec §4.1, item 2 — Impact Cluster).
 *
 * Six animated count-up numbers anchoring the homepage Bento grid.
 * Sourced verbatim from spec §4.1 + persona/README impact tables.
 *
 * Each metric carries:
 *   - value: display string (with units/sign)
 *   - direction: arrow tag for visual grammar
 *   - label: what the number measured
 *   - context: which company/project + timeframe
 *   - methodology: how it was measured (transparency for executive readers)
 *   - accent: Dracula-palette hex (orange = quantified impact)
 */

import type { Metric } from './schemas';

export const metrics: Metric[] = [
  {
    value: '67%',
    direction: '↓',
    label: 'reduction in feature lead times across the GCP ML platform',
    context: 'Montu — Healthcare ML Platform (2023–2025)',
    methodology: 'DORA metrics, measured pre/post Kubeflow + GitOps platform migration',
    accent: '#ffb86c'
  },
  {
    value: '93%',
    direction: '=',
    label: 'clinical NLP accuracy — outperforming Google Healthcare NLP by 14 points',
    context: 'Montu — Clinical Document Intelligence',
    methodology: 'Held-out clinician-labelled validation set, 5-fold cross-validation',
    accent: '#ffb86c'
  },
  {
    value: '40%',
    direction: '↓',
    label: 'average infrastructure cost reduction across 10k+ energy sites',
    context: 'Amber — Energy Forecasting Platform (2021–2023)',
    methodology: 'GCP billing diff over 6-month rolling window post-FinOps refactor',
    accent: '#ffb86c'
  },
  {
    value: '71.3%',
    direction: '↑',
    label: 'clinician adoption of the prescription recommender (100k+ patients)',
    context: 'Montu — Two-Tower Recommender System',
    methodology: 'Active-user telemetry / total clinicians eligible, 90-day rolling window',
    confidenceBound: {
      lower: '68.1%',
      upper: '74.5%',
      note: '95% CI bootstrapped over weekly cohorts'
    },
    accent: '#ffb86c'
  },
  {
    value: '70%',
    direction: '↑',
    label: 'clinician case reviews automated by the care quality assessment pipeline',
    context: 'Montu — Care Quality Assessment',
    methodology: 'Automated-review count / total reviews, monthly rolling',
    accent: '#ffb86c'
  },
  {
    value: '0.87+',
    direction: '↑',
    label: 'F1 PII redaction score on clinical log sanitisation',
    context: 'Montu — Privacy-by-Design Logging',
    methodology: 'Held-out clinician-annotated PII corpus, micro-averaged F1',
    accent: '#ffb86c'
  }
];
