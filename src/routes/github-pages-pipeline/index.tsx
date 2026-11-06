import type { Step } from '#/components/step-tracker/step-tracker'
import StepTracker from '#/components/step-tracker/step-tracker'
import { useGuideSteps } from '#/hooks/use-guide-steps'
import { createFileRoute } from '@tanstack/react-router'
import styles from './github-pages-pipeline.module.css'

export const Route = createFileRoute('/github-pages-pipeline/')({
  component: RouteComponent,
})

const initialSteps: Step[] = [
  {
    title: 'Klargjør ditt eget prosjekt',
    order: 1,
    optional: false,
    completed: false,
  },
  {
    title: 'Aktiver Github pages',
    order: 2,
    optional: false,
    completed: false,
  },
  {
    title: 'Opprett GitHub Actions-workflow',
    order: 3,
    optional: false,
    completed: false,
  },
  {
    title: 'Test automatisk publisering',
    order: 4,
    optional: false,
    completed: false,
  },
  {
    title: 'Byggesteg med npm/Vite',
    order: 5,
    optional: true,
    completed: false,
  },
]

function RouteComponent() {
  const { steps, toggleStep, resetSteps } = useGuideSteps(
    'github-pages-pipeline',
    initialSteps,
  )

  return (
    <div className={styles.githubPagesPipeline}>
      <StepTracker
        steps={steps}
        title="Github Pages Pipeline"
        reset={resetSteps}
      />
      <fhi-button variant="outlined" onClick={() => toggleStep(1)}>
        Fullfør steg 1
      </fhi-button>
    </div>
  )
}
