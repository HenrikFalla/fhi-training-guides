import { useEffect, useRef } from 'react'
import styles from './confetti.module.css'

const COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#4caf50',
  '#ffeb3b',
  '#ff9800',
]

export default function Confetti({ triggerKey }: { triggerKey: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (triggerKey <= 0) return
    const container = containerRef.current
    if (!container) return

    const particleCount = 750
    const timeouts: Array<ReturnType<typeof setTimeout>> = []

    for (let i = 0; i < particleCount; i++) {
      const confetti = document.createElement('div')
      confetti.classList.add(styles.confettiPiece)

      const fromLeft = i % 2 === 0
      const direction = fromLeft ? 1 : -1

      const size = Math.random() * 8 + 6
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const duration = Math.random() * 1.5 + 2.2
      const delay = Math.random() * 0.35

      const angleDeg = Math.random() * 40 + 35
      const angleRad = (angleDeg * Math.PI) / 180
      const distance = Math.random() * 55 + 35

      const peakX = Math.cos(angleRad) * distance * direction
      const peakY = -Math.sin(angleRad) * (distance * 1.2)
      const endX = peakX * 1.35
      const rotation = (Math.random() * 720 + 360) * direction

      confetti.style.width = `${size}px`
      confetti.style.height = `${size * 0.45}px`
      confetti.style.backgroundColor = color
      confetti.style.left = fromLeft ? '0%' : '100%'
      confetti.style.setProperty('--peak-x', `${peakX}vw`)
      confetti.style.setProperty('--peak-y', `${peakY}vh`)
      confetti.style.setProperty('--end-x', `${endX}vw`)
      confetti.style.setProperty('--rot', `${rotation}deg`)
      confetti.style.animationDuration = `${duration}s`
      confetti.style.animationDelay = `${delay}s`

      container.appendChild(confetti)

      const timeoutId = setTimeout(
        () => {
          confetti.remove()
        },
        (duration + delay) * 650,
      )
      timeouts.push(timeoutId)
    }

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [triggerKey])

  return (
    <div
      ref={containerRef}
      className={styles.confettiContainer}
      aria-hidden="true"
    />
  )
}
