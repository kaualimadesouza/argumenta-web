import sys
content = open("src/test/fakeApi.ts").read()
if "chapterSubmissions: (chapterId) => {" not in content:
    content = content.replace(
        "latestSubmission: (chapterId) => {",
        """chapterSubmissions: (chapterId) => {
      try {
        openChapter(chapterId)
      } catch (error) {
        return Promise.reject(error)
      }
      if (!queue && !seed.submission) return Promise.resolve([])
      const subs = queue ? [...queue] : [seed.submission!]
      return Promise.resolve(
        subs.map((sub, i) => ({
          submission_id: sub.submission_id,
          attempt_number: sub.attempt_number,
          body: 'Texto da tentativa ' + sub.attempt_number,
          verdict: sub.verdict,
          average_score: sub.average_score,
          floor_value: sub.floor_value,
          lens: sub.lens,
          created_at: '2026-08-30T00:00:00Z',
        }))
      )
    },
    latestSubmission: (chapterId) => {"""
    )
    open("src/test/fakeApi.ts", "w").write(content)
