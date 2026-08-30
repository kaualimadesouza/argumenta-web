import sys
content = open("src/api/types.ts").read()
if "export interface PastSubmissionResponse" not in content:
    content += """
export interface PastSubmissionResponse {
  submission_id: string
  attempt_number: number
  body: string
  verdict: Verdict
  average_score: number
  floor_value: number
  lens: LensResponse
  created_at: string
}
"""
    open("src/api/types.ts", "w").write(content)
