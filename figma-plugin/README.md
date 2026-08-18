# Argumenta UI Builder (plugin Figma)

Plugin de desenvolvimento que desenha a UI v2 do Argumenta nativamente no Figma:
estilos de cor, estilos de texto, o quadro do design system e as 7 telas do MVP
com auto-layout e ilustrações vetoriais.

Fonte visual de verdade: `design/ui-mockups.html` na raiz do repositório.

## Como rodar

1. Abra o **Figma Desktop** (plugins de desenvolvimento exigem o app, não o navegador).
2. Abra qualquer arquivo de design (ou crie um novo).
3. Menu → **Plugins** → **Development** → **Import plugin from manifest...**
4. Selecione o `manifest.json` desta pasta.
   - No Windows com WSL, o caminho é acessível como:
     `\\wsl.localhost\Ubuntu\home\kaua\personal\argumenta_ai\figma-plugin\manifest.json`
     (ajuste `Ubuntu` para o nome da sua distro, visível com `wsl -l`).
5. Menu → Plugins → Development → **Argumenta UI Builder**.

O plugin cria uma página nova chamada **"Argumenta · UI v2"** com tudo dentro e
fecha sozinho com uma notificação de sucesso.

## Fontes

O plugin usa Bricolage Grotesque, Source Serif 4 e IBM Plex Mono. As três são
Google Fonts e já vêm disponíveis no Figma. Se alguma família ou peso não existir
no ambiente, o plugin escolhe automaticamente o peso mais próximo disponível
(último fallback: Inter), então a execução nunca falha por fonte.

## O que é criado

- **Estilos de cor** `Argumenta/*`: Papel, Tinta, Caneta, Marca-texto, Corretor,
  Aprovado, Noite e variantes suaves.
- **Estilos de texto** `Argumenta/*`: Display XL, Titulo, UI Bold, UI, Narrativa,
  Narrativa italico, Mono label, Mono placar.
- **Quadro Design System**: paleta com amostras nomeadas.
- **Telas** (frames de 390 px com auto-layout): 01 Entrada, 02 Trilha, 03 Cena,
  04 Editor, 05 Correção, 06 Consequência, 07 Progresso.

## Limitações conhecidas (aproximações vs. mockup HTML)

- O sublinhado de erro é reto (o Figma não tem sublinhado ondulado nativo em texto).
- O destaque de marca-texto dentro de parágrafo vira cor/peso no trecho
  (retângulo atrás de trecho de texto corrido não é praticável em texto de fluxo).
- Rodar o plugin de novo cria uma página nova, não atualiza a anterior.
