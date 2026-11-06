import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import styles from './step-card.module.css'

export default function StepCard({
  id,
  title,
  badgeText,
  badgeColor = 'accent',
  completed,
  checkboxLabel,
  onToggleComplete,
  children,
}: {
  id: string
  title: string
  badgeText: string
  badgeColor?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  completed?: boolean
  checkboxLabel?: string
  onToggleComplete?: (completed: boolean) => void
  children: ReactNode
}) {
  const checkboxRef = useRef<(HTMLElement & { checked?: boolean }) | null>(null)
  const headingId = `${id}-heading`

  useEffect(() => {
    import('@folkehelseinstituttet/designsystem/fhi-tag')
    import('@folkehelseinstituttet/designsystem/fhi-headline')
    if (checkboxLabel) {
      import('@folkehelseinstituttet/designsystem/fhi-checkbox').then(() => {
        if (checkboxRef.current) {
          checkboxRef.current.checked = Boolean(completed)
        }
      })
    }
  }, [checkboxLabel])

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = Boolean(completed)
    }
  }, [completed])

  useEffect(() => {
    const el = checkboxRef.current
    if (!el || !onToggleComplete) return

    const handleChange = (event: Event) => {
      const target = event.currentTarget as HTMLElement & { checked?: boolean }
      onToggleComplete(Boolean(target.checked))
    }

    el.addEventListener('change', handleChange)
    return () => {
      el.removeEventListener('change', handleChange)
    }
  }, [onToggleComplete])

  return (
    <section id={id} className={styles.stepCard} aria-labelledby={headingId}>
      <div className={styles.cardHeader}>
        <h2 id={headingId} className={styles.heading}>
          {title}
        </h2>
        <fhi-tag color={badgeColor} variant="bordered">
          {badgeText}
        </fhi-tag>
      </div>

      <div className={styles.cardBody}>{children}</div>

      {checkboxLabel && onToggleComplete && (
        <div className={styles.stepCompletion}>
          <fhi-checkbox
            ref={checkboxRef}
            checked={Boolean(completed)}
            label={checkboxLabel}
          />
        </div>
      )}
    </section>
  )
}
