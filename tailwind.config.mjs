import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dracula / GitHub-Dark primary base (Dark theme)
        'bg-base': 'rgb(var(--bg-base) / <alpha-value>)',
        'bg-surface': 'rgb(var(--bg-surface) / <alpha-value>)',
        'bg-surface-alt': 'rgb(var(--bg-surface-alt) / <alpha-value>)',
        'border-base': 'rgb(var(--border-base) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',

        // Theme-aware semantic accents (CSS vars switch in global.css)
        brand: {
          DEFAULT: 'rgb(var(--accent-brand) / <alpha-value>)',
          body: 'rgb(var(--accent-brand-body) / <alpha-value>)'
        },
        status: 'rgb(var(--accent-status) / <alpha-value>)',
        infra: 'rgb(var(--accent-infra) / <alpha-value>)',
        impact: 'rgb(var(--accent-impact) / <alpha-value>)',
        human: 'rgb(var(--accent-human) / <alpha-value>)',
        stack: 'rgb(var(--accent-stack) / <alpha-value>)',
        danger: 'rgb(var(--accent-danger) / <alpha-value>)'
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      gridTemplateColumns: {
        bento: 'repeat(3, minmax(0, 1fr))',
        'bento-md': 'repeat(2, minmax(0, 1fr))'
      },
      gridAutoRows: {
        bento: 'minmax(220px, auto)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--border-base) / 0.6), 0 0 32px -8px rgb(var(--accent-brand) / 0.25)',
        'glow-brand':
          '0 0 0 1px rgb(var(--accent-brand)), 0 0 32px -8px rgb(var(--accent-brand) / 0.45)',
        'glow-infra':
          '0 0 0 1px rgb(var(--accent-infra)), 0 0 32px -8px rgb(var(--accent-infra) / 0.45)',
        'glow-impact':
          '0 0 0 1px rgb(var(--accent-impact)), 0 0 32px -8px rgb(var(--accent-impact) / 0.45)',
        'glow-human':
          '0 0 0 1px rgb(var(--accent-human)), 0 0 32px -8px rgb(var(--accent-human) / 0.45)',
        'glow-status':
          '0 0 0 1px rgb(var(--accent-status)), 0 0 32px -8px rgb(var(--accent-status) / 0.45)'
      },
      animation: {
        'typing-caret': 'caret 1s steps(2) infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
      },
      keyframes: {
        caret: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.33)', opacity: '1' },
          '80%, 100%': { transform: 'scale(2.5)', opacity: '0' }
        }
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--text-primary))',
            '--tw-prose-headings': 'rgb(var(--text-primary))',
            '--tw-prose-links': 'rgb(var(--accent-brand-body))',
            '--tw-prose-bold': 'rgb(var(--text-primary))',
            '--tw-prose-code': 'rgb(var(--accent-stack))',
            '--tw-prose-pre-bg': 'rgb(var(--bg-surface))',
            '--tw-prose-pre-code': 'rgb(var(--text-primary))',
            '--tw-prose-quotes': 'rgb(var(--text-muted))',
            '--tw-prose-hr': 'rgb(var(--border-base))',
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.9em',
              padding: '0.15em 0.35em',
              borderRadius: '0.25rem',
              backgroundColor: 'rgb(var(--bg-surface-alt))'
            }
          }
        }
      })
    }
  },
  plugins: [typography]
};
