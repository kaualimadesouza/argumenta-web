# Argumenta UI Builder (plugin Figma)

Plugin de desenvolvimento que desenha, em **uma única página** do Figma, tudo o
que existe hoje em `src/pages`: o quadro do sistema visual, a landing page de
marca e as 15 telas do app, cada uma em celular, tablet e desktop.

Fonte visual de verdade: os tokens do design system v3 em
`src/styles/tokens.css`. O plugin não tem paleta própria: `figma-plugin/src/tokens.ts`
espelha o arquivo, e `tokens.test.ts` quebra se os dois divergirem.

## Como rodar

1. Abra o **Figma Desktop** (plugins de desenvolvimento exigem o app, não o navegador).
2. Abra qualquer arquivo de design.
3. Menu → **Plugins** → **Development** → **Import plugin from manifest...**
4. Selecione o `manifest.json` desta pasta.
   - No Windows com WSL, o caminho é acessível como:
     `\\wsl.localhost\Ubuntu\home\kaua\personal\argumenta-web\figma-plugin\manifest.json`
     (ajuste `Ubuntu` para o nome da sua distro, visível com `wsl -l`).
5. Menu → Plugins → Development → **Argumenta UI Builder**.

O plugin cria a página **"Argumenta · v3"**. Rodar de novo **substitui** essa
página e os estilos `Argumenta/*`, em vez de empilhar cópias.

## Como editar

`code.js` é artefato de build, não se edita à mão. As fontes ficam em
`figma-plugin/src`:

| Arquivo | O que é |
|---|---|
| `tokens.ts` | os tokens v3 em pixel e porcentagem, espelhando `tokens.css` |
| `devices.ts` | os três recortes (390, 834, 1440) e a largura da coluna de leitura |
| `nodes.ts` | primitivas de nó do Figma (stack, text, borda, sombra, ícone) |
| `ui.ts` | os componentes de `src/components` (botão, chip, cartão, campo, barra) |
| `chrome.ts` | o quadro do aparelho, wordmark, as três formas do `Nav`, painel noturno |
| `samples.ts`, `landingContent.ts` | a copy pt-BR, copiada do código |
| `screens/layout.ts` | passo de leitura, título de tela e as colunas |
| `screens/correction.ts` | a anatomia da correção, desenhada na tela e no thumbnail |
| `screens/thumbnails.ts` | os quatro thumbnails do "Como funciona" da landing |
| `screens/profile.ts` | os cartões de `src/profile` |
| `screens/` | uma tela por função, mais o inventário e o quadro do sistema |
| `testing/` | a API falsa do Figma e o leitor do `tokens.css`, só para os testes |

Depois de mexer:

```bash
npm run figma:build   # regenera figma-plugin/code.js
npm test              # inclui a paridade de tokens e a frescura do bundle
```

## O que é criado

- **Estilos** `Argumenta/*`: um estilo de cor por token de `--color-*` (com o
  mesmo nome, `caneta-soft`, `ink-2`, `marca-texto`) e seis estilos de texto
  (`display`, `title`, `lead`, `body`, `meta`, `micro`).
- **Sistema visual**: paleta agrupada por significado com nome, variável CSS e
  hex; a rampa tipográfica; os raios; e os componentes em todas as variantes.
- **Landing · a página de marca**: a rolagem inteira, nos três recortes.
- **Celular / Tablet / Desktop**: Entrada, Criar conta, Entrar com e-mail,
  Entrando com Google, Onboarding, Trilha, Cena, Editor, Correção,
  Consequência, Histórico, Progresso, Conta, Privacidade e 404.

A tab bar embaixo no celular, a top bar no tablet e o rail à esquerda no
desktop saem do mesmo `Nav`, como no `AppShell`. O fluxo de escrita (cena,
editor, correção, consequência) e as telas de autenticação são desenhadas sem
o shell, porque no código elas também ficam fora dele.

## Limitações conhecidas (aproximações vs. o app)

- O sublinhado de erro é reto: o Figma não tem sublinhado ondulado em texto.
- O marca-texto atrás de um trecho de texto corrido vira cor e peso no trecho
  (o Figma não tem fundo por intervalo de texto). Ele aparece de verdade no
  quadro do sistema visual, onde o trecho é um nó próprio.
- Os quadros crescem além da altura do aparelho quando a tela é mais longa que
  ele: a ideia é mostrar a rolagem inteira, não uma janela cortada.
- O marquee de capítulos aparece parado, cortado pela largura do aparelho,
  no mesmo lugar em que a animação o mostra.
