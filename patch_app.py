import sys
content = open("src/App.tsx").read()
content = content.replace("import { Consequencia } from './pages/consequencia/Consequencia'", "import { Consequencia } from './pages/consequencia/Consequencia'\nimport { Historico } from './pages/historico/Historico'")
content = content.replace("<Route path=\"/capitulos/:chapterId/consequencia\" element={<Consequencia />} />", "<Route path=\"/capitulos/:chapterId/consequencia\" element={<Consequencia />} />\n          <Route path=\"/capitulos/:chapterId/historico\" element={<Historico />} />")
open("src/App.tsx", "w").write(content)
