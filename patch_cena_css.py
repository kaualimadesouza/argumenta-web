import sys
content = open("src/pages/cena/Cena.tsx").read()
content = content.replace("<div style={{ marginTop: '2rem', textAlign: 'center' }}>", "<div className={styles.history}>")
content = content.replace("<Link to={`/capitulos/${chapter.id}/historico`} className={styles.back} style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>", "<Link to={`/capitulos/${chapter.id}/historico`} className={styles.historyLink}>")
open("src/pages/cena/Cena.tsx", "w").write(content)
