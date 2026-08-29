import { describe, expect, test } from 'vitest'

import { sparklineOf, streakWeek } from './series'

/** Uma quinta-feira, para os rótulos serem previsíveis. */
const THURSDAY = new Date('2026-08-27T12:00:00Z')

function done(week: ReturnType<typeof streakWeek>): string[] {
  return week.filter((day) => day.done).map((day) => day.label)
}

describe('a semana da sequência', () => {
  test('são sempre sete dias, terminando hoje', () => {
    const week = streakWeek(3, true, THURSDAY)

    expect(week).toHaveLength(7)
    expect(week.map((day) => day.label)).toEqual(['Sex', 'Sáb', 'Dom', 'Seg', 'Ter', 'Qua', 'Qui'])
    expect(week[6].today).toBe(true)
    expect(week.filter((day) => day.today)).toHaveLength(1)
  })

  test('quem escreveu hoje fecha a sequência em hoje', () => {
    expect(done(streakWeek(3, true, THURSDAY))).toEqual(['Ter', 'Qua', 'Qui'])
  })

  test('quem ainda não escreveu hoje fecha em ontem, e hoje fica em aberto', () => {
    const week = streakWeek(3, false, THURSDAY)

    expect(done(week)).toEqual(['Seg', 'Ter', 'Qua'])
    expect(week[6].done).toBe(false)
  })

  test('uma sequência maior que a semana enche a semana, sem estourar', () => {
    expect(done(streakWeek(12, true, THURSDAY))).toHaveLength(7)
    expect(done(streakWeek(12, false, THURSDAY))).toHaveLength(6)
  })

  test('sem sequência, nenhum dia aparece cumprido', () => {
    expect(done(streakWeek(0, false, THURSDAY))).toEqual([])
  })
})

describe('a sparkline de uma dimensão', () => {
  const box = { width: 100, height: 20 }

  test('sem ponto nenhum, não há linha para desenhar', () => {
    expect(sparklineOf([], box)).toBeNull()
  })

  test('a nota mais alta fica em cima e a mais baixa embaixo', () => {
    const line = sparklineOf(
      [
        { day: '2026-08-20', score: 0 },
        { day: '2026-08-21', score: 100 },
      ],
      box,
    )

    const [first, second] = (line?.points ?? '').split(' ').map((pair) => pair.split(',').map(Number))
    expect(first[1]).toBeGreaterThan(second[1])
  })

  test('os pontos se espalham da esquerda à direita, na ordem da série', () => {
    const line = sparklineOf(
      [
        { day: '2026-08-20', score: 40 },
        { day: '2026-08-21', score: 50 },
        { day: '2026-08-22', score: 60 },
      ],
      box,
    )

    const xs = (line?.points ?? '').split(' ').map((pair) => Number(pair.split(',')[0]))
    expect(xs).toHaveLength(3)
    expect(xs[0]).toBeLessThan(xs[1])
    expect(xs[1]).toBeLessThan(xs[2])
    expect(xs[2]).toBeLessThanOrEqual(box.width)
  })

  test('a variação é do primeiro ao último ponto da série', () => {
    const line = sparklineOf(
      [
        { day: '2026-08-20', score: 68 },
        { day: '2026-08-25', score: 80 },
      ],
      box,
    )

    expect(line?.latest).toBe(80)
    expect(line?.delta).toBe(12)
  })

  test('um único envio vira uma linha reta, sem variação', () => {
    const line = sparklineOf([{ day: '2026-08-20', score: 55 }], box)

    const ys = (line?.points ?? '').split(' ').map((pair) => Number(pair.split(',')[1]))
    expect(ys).toHaveLength(2)
    expect(ys[0]).toBe(ys[1])
    expect(line?.delta).toBe(0)
    expect(line?.latest).toBe(55)
  })
})
