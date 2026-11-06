import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to TanStack Start</h1>
      <p className="home-description">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
