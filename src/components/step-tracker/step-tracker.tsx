import styles from './step-tracker.module.css'

import '@folkehelseinstituttet/designsystem/fhi-body'
import '@folkehelseinstituttet/designsystem/fhi-headline'
import '@folkehelseinstituttet/designsystem/fhi-tag'
import '@folkehelseinstituttet/designsystem/fhi-button'

import { useState } from 'react'

export interface Step {
  title: string
  order: number
  optional: boolean
  completed: boolean
}

export default function StepTracker({
  steps,
  title,
  reset,
}: {
  steps: Step[]
  title: string
  reset: () => void
}) {
  return (
    <aside className={styles.stepTracker}>
      <fhi-headline level={2}>{title}</fhi-headline>
      <fhi-tag variant="bordered">
        {steps.filter((step) => step.completed).length} steg av {steps.length}
      </fhi-tag>
      <ol className={styles.stepTrackerList}>
        {steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <li key={step.order}>
              <fhi-body class={step.completed ? styles.completed : ''}>
                <span className={styles.stepNumber}>{step.order}. </span>
                <span className={styles.stepTitle}>{step.title}</span>
              </fhi-body>
            </li>
          ))}
      </ol>
      <fhi-button variant="outlined" onClick={reset}>
        Nullstill
      </fhi-button>
    </aside>
  )
}
