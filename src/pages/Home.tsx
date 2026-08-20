import styles from './Home.module.css'

export function Home() {
  return (
    <main className={styles.hero}>
      <h1 className={styles.title}>
        <mark className={styles.highlight}>Argumenta</mark>
      </h1>
      <p className={styles.tagline}>
        Vença a discussão dentro da história. Passe no vestibular fora dela.
      </p>
      <button type="button" className={styles.cta}>
        Começar a treinar
      </button>
      <p className={styles.note}>Só pedimos e-mail, apelido e os seus vestibulares alvo.</p>
    </main>
  )
}
