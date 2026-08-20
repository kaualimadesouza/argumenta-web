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
  pages/        # uma pasta/arquivo por tela (Home, Trilha, Cena, ...)
  styles/       # tokens.css (design tokens) e global.css
  test/         # setup do vitest
```

Backend: [argumenta-api](https://github.com/kaualimadesouza/argumenta-api).
