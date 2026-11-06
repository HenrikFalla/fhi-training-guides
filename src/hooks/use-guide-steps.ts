import { useEffect, useState } from 'react'
import type { Step } from '#/components/step-tracker/step-tracker'

function isObligatoryComplete(steps: Step[], completedOrders: number[]) {
  const obligatorySteps = steps.filter((s) => !s.optional)
  return (
    obligatorySteps.length > 0 &&
    obligatorySteps.every((s) => completedOrders.includes(s.order))
  )
}

function isAllComplete(steps: Step[], completedOrders: number[]) {
  return (
    steps.length > 0 && steps.every((s) => completedOrders.includes(s.order))
  )
}

export function useGuideSteps(guideKey: string, initialSteps: Step[]) {
  const storageKey = `fhi-guide-progress:${guideKey}`
  const [completedOrders, setCompletedOrders] = useState<number[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [celebrationCount, setCelebrationCount] = useState(0)

  // 1. Load saved progress from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCompletedOrders(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to read step progress from localStorage:', error)
    }
    setIsHydrated(true)
  }, [storageKey])

  // 2. Sync changes back to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedOrders))
    } catch (error) {
      console.error('Failed to save step progress to localStorage:', error)
    }
  }, [completedOrders, storageKey, isHydrated])

  // 3. Keep multiple open tabs in sync
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        try {
          setCompletedOrders(event.newValue ? JSON.parse(event.newValue) : [])
        } catch (error) {
          console.error('Failed to sync storage change:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [storageKey])

  const updateWithCelebrationCheck = (
    computeNext: (prev: number[]) => number[],
  ) => {
    setCompletedOrders((prev) => {
      const next = computeNext(prev)
      const wasObligatoryDone = isObligatoryComplete(initialSteps, prev)
      const wasAllDone = isAllComplete(initialSteps, prev)
      const nowObligatoryDone = isObligatoryComplete(initialSteps, next)
      const nowAllDone = isAllComplete(initialSteps, next)

      if (
        (nowObligatoryDone && !wasObligatoryDone) ||
        (nowAllDone && !wasAllDone)
      ) {
        setCelebrationCount((c) => c + 1)
      }

      return next
    })
  }

  // Derive the full Step[] list from initialSteps + completedOrders
  const steps: Step[] = initialSteps.map((step) => ({
    ...step,
    completed: completedOrders.includes(step.order),
  }))

  const toggleStep = (order: number) => {
    updateWithCelebrationCheck((prev) =>
      prev.includes(order) ? prev.filter((o) => o !== order) : [...prev, order],
    )
  }

  const setStepCompleted = (order: number, completed: boolean) => {
    updateWithCelebrationCheck((prev) => {
      if (completed && !prev.includes(order)) return [...prev, order]
      if (!completed) return prev.filter((o) => o !== order)
      return prev
    })
  }

  const resetSteps = () => {
    setCompletedOrders([])
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Failed to clear step progress from localStorage:', error)
    }
  }

  return {
    steps,
    isHydrated,
    celebrationCount,
    toggleStep,
    setStepCompleted,
    resetSteps,
  }
}
