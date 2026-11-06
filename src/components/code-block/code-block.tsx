import { useEffect, useRef, useState } from 'react'
import styles from './code-block.module.css'

export default function CodeBlock({
  label,
  code,
}: {
  label: string
  code: string
}) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    import('@folkehelseinstituttet/designsystem/fhi-button')
    import('@folkehelseinstituttet/designsystem/fhi-icon-copy')
    import('@folkehelseinstituttet/designsystem/fhi-icon-check')

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Kunne ikke kopiere kode:', error)
    }
  }

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeBlockHeader}>
        <span className={styles.codeLabel}>{label}</span>
        <fhi-button
          color="neutral"
          variant="subtle"
          size="small"
          type="button"
          onClick={handleCopy}
        >
          {copied ? <fhi-icon-check /> : <fhi-icon-copy />}
          <span>{copied ? 'Kopiert!' : 'Kopier kode'}</span>
        </fhi-button>
      </div>
      <pre className={styles.pre}>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  )
}
