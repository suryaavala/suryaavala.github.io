/**
 * Portfolio projects (spec §4.2 — /architecture route).
 *
 * Categorised strictly by domain (NOT chronologically). Featured projects
 * surface as Bento cards on the homepage; the full set populates /architecture
 * grouped by domain.
 */

import type { Project, UpstreamPR } from './schemas';

export const projects: Project[] = [
  // ── GenAI & Agentic Systems ────────────────────────────────────────────────
  {
    slug: 'scaling-succotash',
    title: 'scaling-succotash',
    description:
      'Production agentic search engine — GraphRAG, Celery DLQ, Circuit Breakers, Kubernetes. Featured on the homepage as the flagship agentic system.',
    domain: 'GenAI & Agentic Systems',
    repoUrl: 'https://github.com/suryaavala/scaling-succotash',
    tags: ['GraphRAG', 'LangGraph', 'Kubernetes', 'Celery', 'Circuit Breakers'],
    accentColor: '#8be9fd',
    featured: true,
    badgeLabel: 'Featured'
  },
  {
    slug: 'openclaude',
    title: 'openclaude',
    description:
      'Multi-model orchestration mesh for routing prompts across LLM providers with guardrails.',
    domain: 'GenAI & Agentic Systems',
    repoUrl: 'https://github.com/suryaavala/openclaude',
    tags: ['Multi-Agent', 'LangChain', 'Guardrails'],
    accentColor: '#bd93f9',
    featured: false
  },

  // ── Systems & Infrastructure ───────────────────────────────────────────────
  {
    slug: 'traffic_counter',
    title: 'traffic_counter',
    description:
      'O(1) stdlib optimisation — zero GC thrashing, pure CPython heap/deque. Demonstrates first-principles algorithmic thinking against real workloads.',
    domain: 'Systems & Infrastructure',
    repoUrl: 'https://github.com/suryaavala/traffic_counter',
    tags: ['Python', 'Systems', 'O(1)', 'CPython'],
    accentColor: '#8be9fd',
    featured: true,
    badgeLabel: 'Latest'
  },
  {
    slug: 'decloud',
    title: 'decloud',
    description:
      'FinOps tooling for visualising and reducing cloud spend across multi-cloud workloads.',
    domain: 'Systems & Infrastructure',
    repoUrl: 'https://github.com/suryaavala/decloud',
    tags: ['FinOps', 'Cloud', 'Cost Optimisation'],
    accentColor: '#ffb86c',
    featured: false
  },
  {
    slug: 'advancedcpp',
    title: 'advancedcpp',
    description: 'Advanced C++ patterns and template metaprogramming exercises.',
    domain: 'Systems & Infrastructure',
    repoUrl: 'https://github.com/suryaavala/advancedcpp',
    tags: ['C++', 'Templates', 'Systems'],
    accentColor: '#8be9fd',
    featured: false
  },

  // ── ML & Data Science ──────────────────────────────────────────────────────
  {
    slug: 'suncorp',
    title: 'suncorp',
    description: 'Insurance claims modelling — Suncorp data challenge.',
    domain: 'ML & Data Science',
    repoUrl: 'https://github.com/suryaavala/suncorp',
    tags: ['Insurance', 'Classification'],
    accentColor: '#f1fa8c',
    featured: false
  },
  {
    slug: 'stockprediction',
    title: 'stockprediction',
    description: 'Time-series forecasting experiments on equity data.',
    domain: 'ML & Data Science',
    repoUrl: 'https://github.com/suryaavala/stockprediction',
    tags: ['Time-Series', 'Forecasting'],
    accentColor: '#f1fa8c',
    featured: false
  },
  {
    slug: 'som',
    title: 'som',
    description: 'Kohonen Self-Organising Maps from scratch — unsupervised topology learning.',
    domain: 'ML & Data Science',
    repoUrl: 'https://github.com/suryaavala/som',
    tags: ['SOM', 'Unsupervised', 'Math'],
    accentColor: '#bd93f9',
    featured: false
  },
  {
    slug: 'prodr',
    title: 'prodr',
    description: 'Productionising R models behind a Python service boundary.',
    domain: 'ML & Data Science',
    repoUrl: 'https://github.com/suryaavala/prodr',
    tags: ['R', 'Production', 'Bridging'],
    accentColor: '#f1fa8c',
    featured: false
  },
  {
    slug: 'legimages',
    title: 'legimages',
    description: 'ML "legos" for images — composable computer-vision primitives.',
    domain: 'ML & Data Science',
    repoUrl: 'https://github.com/suryaavala/legimages',
    tags: ['Computer Vision', 'Composable'],
    accentColor: '#f1fa8c',
    featured: false
  },

  // ── Data Engineering & Tooling ─────────────────────────────────────────────
  {
    slug: 'zen_search',
    title: 'zen_search',
    description: 'High-performance ticketing search — composable indexers, low-latency lookup.',
    domain: 'Data Engineering & Tooling',
    repoUrl: 'https://github.com/suryaavala/zen_search',
    tags: ['Search', 'Indexing', 'Performance'],
    accentColor: '#8be9fd',
    featured: false
  },
  {
    slug: 'fwfparser',
    title: 'fwfparser',
    description: 'Fixed-width file parser optimised for streaming.',
    domain: 'Data Engineering & Tooling',
    repoUrl: 'https://github.com/suryaavala/fwfparser',
    tags: ['Parser', 'Streaming'],
    accentColor: '#8be9fd',
    featured: false
  },
  {
    slug: 'ah_chambers_of_law',
    title: 'ah_chambers_of_law',
    description: 'Legal document mining and extraction utilities.',
    domain: 'Data Engineering & Tooling',
    repoUrl: 'https://github.com/suryaavala/ah_chambers_of_law',
    tags: ['Legal NLP', 'Extraction'],
    accentColor: '#ff79c6',
    featured: false
  },
  {
    slug: 'template_cookiecutter',
    title: 'template_cookiecutter',
    description: 'Cookiecutter scaffolding for ML projects with opinionated CI/CD.',
    domain: 'Data Engineering & Tooling',
    repoUrl: 'https://github.com/suryaavala/template_cookiecutter',
    tags: ['Tooling', 'Scaffolding'],
    accentColor: '#8be9fd',
    featured: false
  },

  // ── Enterprise ML & Document Intelligence ──────────────────────────────────
  {
    slug: 'anz-fraud',
    title: 'ANZ Enterprise ID Fraud Detection',
    description:
      'Production identity fraud detection platform on Kubeflow / GKE across regulated business units.',
    domain: 'Enterprise ML & Document Intelligence',
    repoUrl: 'https://github.com/suryaavala/suryaavala.github.io',
    tags: ['Fraud', 'Kubeflow', 'GKE', 'Enterprise'],
    accentColor: '#ffb86c',
    featured: false
  },
  {
    slug: 'hammondcare-chatbot',
    title: 'HammondCare Triaging Chatbot',
    description: 'Customer-request triaging chatbot for clinical operations.',
    domain: 'Enterprise ML & Document Intelligence',
    repoUrl: 'https://github.com/suryaavala/suryaavala.github.io',
    tags: ['NLU', 'Healthcare', 'Chatbot'],
    accentColor: '#ff79c6',
    featured: false
  },
  {
    slug: 'nib-sagemaker',
    title: 'nib SageMaker Platform Extensions',
    description: 'SageMaker platform extensions powering claims ML workloads at nib Group.',
    domain: 'Enterprise ML & Document Intelligence',
    repoUrl: 'https://github.com/suryaavala/suryaavala.github.io',
    tags: ['SageMaker', 'AWS', 'Healthcare'],
    accentColor: '#8be9fd',
    featured: false
  },
  {
    slug: 'eliiza-thea',
    title: 'Eliiza "Thea" Document Mining',
    description:
      'Document mining framework adopted across consulting engagements (legal / clinical / unstructured).',
    domain: 'Enterprise ML & Document Intelligence',
    repoUrl: 'https://github.com/suryaavala/suryaavala.github.io',
    tags: ['Document Mining', 'NLP', 'Framework'],
    accentColor: '#bd93f9',
    featured: false
  },
  {
    slug: 'cricket-aus-datajam',
    title: 'Cricket Australia DataJam (2nd Place)',
    description:
      'Cross-functional ML competition — 2nd place finish, Cricket Australia DataJam 2020.',
    domain: 'Enterprise ML & Document Intelligence',
    repoUrl: 'https://github.com/suryaavala/suryaavala.github.io',
    tags: ['Sports Analytics', 'Competition'],
    accentColor: '#bd93f9',
    featured: false
  }
];

/**
 * Upstream OSS contributions (spec §4.2 — /architecture#oss anchor + Bento §7).
 */
export const upstreamPRs: UpstreamPR[] = [
  {
    repo: 'tensorflow/tfx',
    prNumber: 3813,
    title: 'Resolved strict dependency pinning conflicts for TF-Hub',
    url: 'https://github.com/tensorflow/tfx/pull/3813'
  },
  {
    repo: 'kubeflow/pipelines',
    prNumber: 4702,
    title: 'Fixed GCP inverse proxy URL routing priorities',
    url: 'https://github.com/kubeflow/pipelines/pull/4702'
  },
  {
    repo: 'kubeflow/pipelines',
    prNumber: 4706,
    title: 'Reconciled SDK linting conflicts between pylint and yapf',
    url: 'https://github.com/kubeflow/pipelines/pull/4706'
  },
  {
    repo: 'dask/dask',
    prNumber: 5828,
    title: 'Fixed multi-dimensional array ValueErrors in delayed map reductions',
    url: 'https://github.com/dask/dask/pull/5828'
  },
  {
    repo: 'iterative/katacoda-scenarios',
    prNumber: 'docs',
    title: 'DVC learning scenarios',
    url: 'https://github.com/iterative/katacoda-scenarios'
  }
];
