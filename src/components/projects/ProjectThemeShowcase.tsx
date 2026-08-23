'use client'

import { useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import type { ProjectTheme } from '@/data/projects'

const ProjectThemeShowcase = ({ themes }: { themes: ProjectTheme[] }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const shouldReduceMotion = useReducedMotion()
  const isDark = mode === 'dark'
  const ModeIcon = isDark ? Moon : Sun

  return (
    <section className="project-page__block">
      <div className="project-page__theme-heading">
        <div>
          <h2 className="project-page__section-title">Theme system</h2>
          <p>Every identity includes both a light and dark version. Switch all four previews at once.</p>
        </div>

        <div className="project-page__mode-control">
          <span id="theme-mode-label">Preview all themes</span>
          <button
            type="button"
            className="project-page__mode-toggle"
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch every theme preview to ${isDark ? 'light' : 'dark'} mode`}
            title={`${isDark ? 'Dark' : 'Light'} mode`}
            data-mode={mode}
            onClick={() => setMode(isDark ? 'light' : 'dark')}
          >
            <motion.span
              className="project-page__mode-thumb"
              layout="position"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 520, damping: 32, mass: 0.72 }
              }
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={mode}
                  className="project-page__mode-icon"
                  initial={shouldReduceMotion ? false : { opacity: 0, rotate: isDark ? -70 : 70, scale: 0.55 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, rotate: isDark ? 70 : -70, scale: 0.55 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
                >
                  <ModeIcon aria-hidden="true" />
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </button>
        </div>
      </div>

      <div className="project-page__themes">
        {themes.map((theme) => {
          const colors = theme[mode]

          return (
            <article
              key={theme.name}
              className="project-page__theme"
              style={
                {
                  '--theme-bg': colors.background,
                  '--theme-surface': colors.surface,
                  '--theme-surface-2': colors.surface2,
                  '--theme-ink': colors.ink,
                  '--theme-muted': colors.muted,
                  '--theme-accent': colors.accent,
                  '--theme-accent-soft': colors.accentSoft,
                  '--theme-ring': colors.ring,
                } as CSSProperties
              }
            >
              <div className="project-page__theme-preview">
                <div className="project-page__theme-date">Today, 23 Aug</div>

                <div className="project-page__theme-gauge-row">
                  <div className="project-page__theme-side-stat">
                    <span>Protein</span>
                    <strong>42</strong>
                    <small>g</small>
                  </div>

                  <div className="project-page__theme-gauge">
                    <svg viewBox="0 0 120 100" aria-hidden="true">
                      <path pathLength="100" d="M16 76 A47 47 0 1 1 104 76" />
                      <path pathLength="100" d="M16 76 A47 47 0 1 1 104 76" />
                    </svg>
                    <div>
                      <span>Remaining</span>
                      <strong>138</strong>
                      <small>Goal 250 g</small>
                    </div>
                  </div>

                  <div className="project-page__theme-side-stat">
                    <span>Fibre</span>
                    <strong>16</strong>
                    <small>g</small>
                  </div>
                </div>

                <div className="project-page__theme-macros" aria-hidden="true">
                  <i><span /><span /></i>
                  <i><span /><span /></i>
                  <i><span /><span /></i>
                </div>
              </div>

              <div className="project-page__theme-meta">
                <h3>{theme.name}</h3>
                <div aria-label={`${theme.name} ${mode} theme colours`}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectThemeShowcase
