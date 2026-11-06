import { useEffect } from 'react'
import styles from './guide-banner.module.css'

export default function GuideBanner({
  tag,
  title,
  lead,
}: {
  tag: string
  title: string
  lead: string
}) {
  useEffect(() => {
    import('@folkehelseinstituttet/designsystem/fhi-tag')
  }, [])

  return (
    <div className={styles.guideBanner}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <fhi-tag color="accent" variant="bordered">
            {tag}
          </fhi-tag>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
        </div>
      </div>
    </div>
  )
}
