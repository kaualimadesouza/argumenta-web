import sys
content = open("src/api/client.ts").read()
content = content.replace("  PastSubmissionResponse,\n}", "  PastSubmissionResponse,\n  SubmissionResponse,\n}")
open("src/api/client.ts", "w").write(content)
