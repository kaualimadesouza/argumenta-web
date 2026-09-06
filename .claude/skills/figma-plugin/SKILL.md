---
name: figma-plugin
description: Use when writing, debugging or running the Figma plugin in figma-plugin/ - the API's sizing traps, the fake used in tests, how to run the plugin in Figma Desktop and how to measure what it actually drew
---

# The Figma plugin

`figma-plugin/src` builds every screen of the app as a frame on one Figma page.
`npm run figma:build` bundles it into `figma-plugin/code.js`, which is committed
and checked by a test: **rebuild before every commit that touches `src`**.

The plugin is not a picture of the app, it is a second implementation of the
same layout in a different engine. Every rule below was learned by shipping art
that was wrong in Figma while 300 tests were green.

## The one law: Figma sizes by axis, the code thinks in dimensions

`primaryAxisSizingMode` is the **height** on a column and the **width** on a
row; `counterAxisSizingMode` is the other one. Getting this backwards fixes the
wrong side of a frame, and an empty frame is 0.01px, so the mistake shows up as
blocks drawn on top of each other.

Never write those two properties. Use `setSize(frame, { width?, height? })`: it
speaks in dimensions and maps them. A dimension left out hugs its content.

```ts
setSize(bar, { width, height: 72 })   // both stated
setSize(pill, { height })             // width hugs the label
```

## `fill` and `grow` are marks, not sizes

`fill(node)` (span the parent's cross axis, `display: block`) and `grow(node)`
(take the slack on the main axis, `flex: 1`) **record the intent in plugin data
and change nothing**. `settleSizing(frame)` applies them at the end of the
build, when the parent's direction and size are finally known.

Why it has to work that way, both learned the hard way:

- Figma obeys `layoutGrow = 1` the moment it is set, **even against a parent
  that is still hugging**. The child collapses to the parent's current size, the
  parent then measures that collapsed child, and the page ends at the fold with
  its content spilling onto the canvas below.
- Figma ignores `layoutAlign = 'STRETCH'` when the child is itself an
  auto-layout frame that hugs the same axis: the hug wins and the button shrinks
  to its label. `layoutSizingHorizontal = 'FILL'` is the instruction that
  actually lands, and it refuses a parent that hugs that dimension.

So: mark during the build, settle once at the end, and a mark the parent cannot
honour is simply not applied.

## Content box: the border eats the width

Figma lays out inside the border exactly like `box-sizing: border-box`. A card
of width 350 with `padding: 18` and a 1px border has **312** of room, not 314.
Building a child on `width - 36` puts it 2px past the edge, every time, all the
way down the tree.

- `room(frame, dimension)` in `nodes.ts` is the truth for a frame that exists.
- `cardInner(width, active?)` in `ui.ts` is the truth before it exists.
- Never write `width - 36` again.

## Other traps, each one paid for

- **Negative padding is refused** (`Number must be greater than or equal to 0`)
  and kills the run: the plugin dies on the first frame and nothing is drawn.
- `resize()` before appending children locks the frame at 0.01 on the hugging
  axis. Size after the children are in.
- `figma.createFrame()` appends to the current page. A failed run leaves orphan
  frames at 0,0; `main.ts` starts from a fresh page each run for that reason.
- A **wrapping row only wraps once its width is settled**. `layoutWrap: 'WRAP'`
  on a hugging frame never wraps, it just runs past the edge.
- A text node keeps the width it was given, so `fill()` on a paragraph that has
  its own measure widens it past the design. Only `fill` text that is meant to
  span.
- Free Figma caps a file at 3 pages.

## The fake, and why the tests can be trusted

`testing/fakeFigma.ts` is a small layout engine, not a stub: axis-relative
sizing, hug and fill, the content box, rough but deterministic text metrics. It
is **strict where Figma is strict** (it refuses negative padding, and refuses to
fill a parent that hugs the same dimension), because art that cannot exist must
not pass a test.

When Figma and the fake disagree, the fake is wrong until proven otherwise:
teach it the rule, watch the invariant go red, then fix the art.

`testing/invariants.ts` holds what must be true of any built tree, checked over
all 48 frames in `draw.test.ts`:

- `overflows` : no block sits on top of the next one.
- `unfilled`  : a frame told to span its parent actually measures it.
- `pinned`    : no child is sized against a parent that hugs it back.

## Running it in Figma Desktop

Dev plugins need the desktop app. You import **`manifest.json`**, never
`code.js`. Menu (the Figma icon, top left) → Plugins → Development → Import
plugin from manifest. After that the plugin is at Plugins → Development →
`Argumenta UI Builder`, and **Hot reload plugin** is on, so a new `code.js` on
disk is picked up on the next run: no re-import after a rebuild.

Quick actions is **Ctrl+K**. Ctrl+/ opens community search and swallows what you
type.

## Measuring what it actually drew

Reading a screenshot is guessing. Make the plugin report its own geometry: in a
copy of `code.js` **outside the repo**, before `scrollAndZoomIntoView`, walk
`cursor.placed`, compare each frame's height against its content and each
child's width against `room`, and write the list into a text node on the canvas.
One screenshot then reads the whole file's geometry in real Figma numbers.

That is how every bug above was pinned down: the report said
`body h=844 content=1957`, and the guessing stopped.

## Driving the desktop app from here

Only with the owner's explicit go-ahead, and never while they are typing: the
automation fights them for focus. Stop the moment you see their keystrokes.

- `powershell.exe -EncodedCommand <utf-16le base64>` avoids every quoting and
  encoding problem across the WSL boundary.
- Screenshots need `SetProcessDPIAware()` plus `SystemInformation::VirtualScreen`,
  otherwise you capture 1280x800 of a 1920x1200 screen. At 150% Windows scaling
  a canvas pixel is `zoom * 1.5` screen pixels, which is why measuring a
  screenshot by eye lies.
- Accented Windows paths turn to mojibake through the bridge. Work in
  `C:\Users\Public\argumenta-figma\`.
- Focus: `WScript.Shell.AppActivate` then `SetForegroundWindow`, retry, and fall
  back to clicking the taskbar button. Verify with `GetForegroundWindow` and
  **abort if it is not Figma**, or the clicks land in another app.
- **Never send Shift+digit through SendKeys or keybd_event.** Figma reads the
  leaked digit as an opacity shortcut: `Shift+2` set a frame to 20% opacity
  twice. Use the zoom dropdown in the toolbar instead.
- The rectangle tool stays active after a stray click and the next click draws a
  rectangle. Press `v` (move tool) first, and check the screenshot after every
  step, not at the end.
