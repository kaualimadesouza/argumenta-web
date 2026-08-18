# argumenta-web

Frontend do Argumenta: PWA mobile-first onde o estudante vive histórias
interativas e treina argumentação escrita para o vestibular.

## Stack

- Vite + React + TypeScript
- PWA via vite-plugin-pwa (instalável, push de streak)
- Deploy via SSH para VPS com CI/CD no GitHub Actions (container nginx com o
  build estático, imagens em GHCR, blue/green com healthcheck e rollback)

## Design

- [Mockups](design/ui-mockups.html): design system e as 7 telas do MVP
  (estilo visual novel).
- [Plugin Figma](figma-plugin/README.md): desenha a UI nativamente no Figma.

Backend: [argumenta-api](https://github.com/kaualimadesouza/argumenta-api).
