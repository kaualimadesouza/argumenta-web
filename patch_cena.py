import sys
content = open("src/pages/cena/Cena.tsx").read()
if "Ver minhas tentativas anteriores" not in content:
    content = content.replace(
        "const { state, reload } = useResource(useCallback(() => api.chapter(chapterId), [api, chapterId]))",
        """const { state, reload } = useResource(useCallback(async () => {
    const [chapter, submissions] = await Promise.all([
      api.chapter(chapterId),
      api.chapterSubmissions(chapterId).catch(() => [])
    ])
    return { chapter, submissions }
  }, [api, chapterId]))"""
    )
    content = content.replace(
        "{(chapter) => {",
        "{({ chapter, submissions }) => {"
    )
    content = content.replace(
        "          {WRITABLE.includes(chapter.status) ? (",
        """          {submissions.length > 1 ? (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link to={`/capitulos/${chapter.id}/historico`} className={styles.back} style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>
                Ver minhas tentativas anteriores
              </Link>
            </div>
          ) : null}
          {WRITABLE.includes(chapter.status) ? ("""
    )
    open("src/pages/cena/Cena.tsx", "w").write(content)
