import { useEffect } from 'react'
import styles from './header.module.css'

export default function Header() {
  useEffect(() => {
    import('@folkehelseinstituttet/designsystem/fhi-tag')
    import('@folkehelseinstituttet/designsystem/fhi-display')
  }, [])
  return (
    <header>
      <div className={styles.headerContent}>
        <fhi-tag variant="bordered">FHI Utvikling</fhi-tag>
        <fhi-display level={2}>
          Veiledninger og oppgaver for lærlinger og praksiselever
        </fhi-display>
      </div>
    </header>
  )
}
