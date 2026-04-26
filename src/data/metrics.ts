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
    narrative:
      'Replaced sprawling notebook-to-production pipeline with Kubeflow + GitOps, turning sprint-length deploys into same-day ships.',
    accent: 'impact'
  },
  {
    value: '93%',
    direction: '=',
    label: 'clinical NLP accuracy — outperforming Google Healthcare NLP by 14 points',
    context: 'Montu — Clinical Document Intelligence',
    methodology: 'Held-out clinician-labelled validation set, 5-fold cross-validation',
    narrative:
      'Built custom clinical NLP pipeline outperforming Google Healthcare NLP on domain-specific medical text extraction.',
    accent: 'impact'
  },
  {
    value: '40%',
    direction: '↓',
    label: 'average infrastructure cost reduction across 10k+ energy sites',
    context: 'Amber — Energy Forecasting Platform (2021–2023)',
    methodology: 'GCP billing diff over 6-month rolling window post-FinOps refactor',
    narrative:
      'Designed event-driven FinOps architecture for 10k+ energy sites, eliminating redundant compute and cold-path waste.',
    accent: 'impact'
  },
  {
    value: '71.3%',
    direction: '↑',
    label: 'clinician adoption of the prescription recommender (100k+ patients)',
    context: 'Montu — Two-Tower Recommender System',
    methodology: 'Active-user telemetry / total clinicians eligible, 90-day rolling window',
    narrative:
      'Hybrid two-tower recommender personalising prescriptions for 100k+ recurring patients with clinician-in-the-loop feedback.',
    confidenceBound: {
      lower: '68.1%',
      upper: '74.5%',
      note: '95% CI bootstrapped over weekly cohorts'
    },
    accent: 'impact'
  },
  {
    value: '70%',
    direction: '↑',
    label: 'clinician case reviews automated by the care quality assessment pipeline',
    context: 'Montu — Care Quality Assessment',
    methodology: 'Automated-review count / total reviews, monthly rolling',
    narrative:
      'Automated clinician case review pipeline combining structured extraction with quality scoring, freeing clinical hours.',
    accent: 'impact'
  },
  {
    value: '0.87+',
    direction: '↑',
    label: 'F1 PII redaction score on clinical log sanitisation',
    context: 'Montu — Privacy-by-Design Logging',
    methodology: 'Held-out clinician-annotated PII corpus, micro-averaged F1',
    narrative:
      'Privacy-by-Design log sanitisation with tuned NER model, ensuring clinical inputs never leak PII to downstream systems.',
    accent: 'impact'
  }
];
