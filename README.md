# argumenta-web

Frontend do Argumenta: web app responsivo, mobile-first, onde o estudante vive
histórias interativas e treina argumentação escrita para o vestibular (FUVEST e
ENEM). O cliente móvel nativo é a fase 2, em
[argumenta-mobile](https://github.com/kaualimadesouza/argumenta-mobile).

## Stack

- Vite + React 19 + TypeScript (strict), rotas com react-router
- Design tokens em CSS variables (`src/styles/tokens.css`), CSS Modules por página
- Vitest + Testing Library
- Deploy via SSH para VPS com CI/CD no GitHub Actions (container nginx com o
  build estático, imagens em GHCR, blue/green com healthcheck e rollback)

## Setup

```bash
npm install
npm run dev        # app em http://localhost:5173
npm run lint       # eslint
npm run typecheck  # tsc -b
npm test           # vitest
npm run build      # tsc -b && vite build
```

Variáveis de ambiente (`.env.local`, nenhuma é obrigatória para o app subir):

| Variável | Para quê |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | client id do OAuth do Google. Vazio deixa o botão "Entrar com Google" desabilitado, com o aviso na tela; o cadastro por e-mail continua funcionando. |

## A API tem que ser same-origin

O backend escopa o cookie de refresh em `path=/auth`, então o navegador só o
envia se a API responder **na mesma origem** do app. Por isso não existe
`VITE_API_BASE_URL`: um endereço cross-origin não quebraria o login, quebraria a
renovação da sessão 15 minutos depois, silenciosamente.

Em desenvolvimento o `vite.config.ts` faz proxy dos prefixos da API
(`/auth`, `/me`, `/track`, `/chapters`, `/progress`, `/telemetry`, `/health`) para
`http://localhost:8000`. Em produção o nginx faz o mesmo (card #2). Consequência
prática: **nenhuma rota do SPA pode começar com esses prefixos** (é por isso que
a tela de conta é `/conta`, e não `/me`).

## Releases

Versionamento e changelog automáticos via
[Release Please](https://github.com/googleapis/release-please): merges na main
com conventional commits alimentam um PR de release; mergear esse PR cria a tag
semver, a GitHub Release e o `CHANGELOG.md`, propagando a versão para
`package.json`. PRs são squash-merged com título convencional (validado pelo
workflow de título).

## Design system

Fonte da verdade visual: [design/ui-mockups.html](design/ui-mockups.html)
(design system v2 "papel e caneta" e as 7 telas do MVP). Os tokens de cor,
tipografia e forma vivem em `src/styles/tokens.css`; componentes nunca usam hex
direto, sempre `var(--color-...)`. Fontes: Bricolage Grotesque (display/UI),
Source Serif 4 (narrativa), IBM Plex Mono (notas e placares).

O [plugin Figma](figma-plugin/README.md) desenha a UI nativamente no Figma.

## Estrutura

```
src/
  api/          # tipos espelhando as respostas da API, cliente fetch e mensagens
  app/          # composição dos providers
  auth/         # fluxo OAuth do Google (URL de consentimento e state)
  components/   # peças compartilhadas (Button, Chip, Card, Field, Select, art/)
  copy/         # copy pt-BR dos enums da API (vestibulares, dimensões)
  pages/        # uma pasta por tela (entrada, onboarding, trilha, legal, ...)
  profile/      # cartões de apelido e vestibulares, usados no onboarding e na conta
  session/      # estado da sessão, guardas de rota e painéis de status
  styles/       # tokens.css (design tokens) e global.css
  test/         # setup do vitest, fixtures tipadas e o fake da API
```

Backend: [argumenta-api](https://github.com/kaualimadesouza/argumenta-api).
