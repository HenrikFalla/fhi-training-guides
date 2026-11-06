import { useEffect } from 'react'
import styles from './step-tracker.module.css'

export interface Step {
  title: string
  order: number
  optional: boolean
  completed: boolean
}

export interface ExtraLink {
  href: string
  label: string
}

export default function StepTracker({
  steps,
  title = 'Steg i guiden',
  reset,
  extraLinks = [],
}: {
  steps: Step[]
  title?: string
  reset: () => void
  extraLinks?: ExtraLink[]
}) {
  useEffect(() => {
    import('@folkehelseinstituttet/designsystem/fhi-headline')
    import('@folkehelseinstituttet/designsystem/fhi-tag')
    import('@folkehelseinstituttet/designsystem/fhi-button')
  }, [])

  const completedCount = steps.filter((step) => step.completed).length
  const totalCount = steps.length
  const allCompleted = totalCount > 0 && completedCount === totalCount
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  return (
    <aside className={styles.stepTracker} aria-label={title}>
      <div className={styles.sidebarCard}>
        <div className={styles.cardHeader}>
          <fhi-headline level={2} size="medium">
            {title}
          </fhi-headline>
          <fhi-tag
            color={allCompleted ? 'success' : 'neutral'}
            variant="bordered"
          >
            {completedCount} / {totalCount} fullført
          </fhi-tag>
        </div>

        <nav aria-label="Stegnavigasjon">
          <ol className={styles.sidebarSteps}>
            {sortedSteps.map((step) => (
              <li
                key={step.order}
                className={`${styles.sidebarStepItem} ${
                  step.completed ? styles.isCompleted : ''
                }`}
              >
                <a
                  className={styles.sidebarStepLink}
                  href={`#steg-${step.order}`}
                >
                  <span className={styles.stepNumber}>{step.order}.</span>
                  <span className={styles.stepTitle}>
                    {step.title}
                    {step.optional ? ' (Valgfritt)' : ''}
                  </span>
                </a>
              </li>
            ))}
            {extraLinks.map((link) => (
              <li
                key={link.href}
                className={`${styles.sidebarStepItem} ${styles.sidebarRefItem}`}
              >
                <a className={styles.sidebarStepLink} href={link.href}>
                  <span className={styles.stepTitle}>{link.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.sidebarActions}>
          <fhi-button
            color="neutral"
            variant="outlined"
            size="small"
            type="button"
            onClick={reset}
          >
            Nullstill fremgang
          </fhi-button>
        </div>
      </div>
    </aside>
  )
}
