import { describe, expect, test } from 'vitest'

import { anAnnotation } from '../../test/fixtures'
import { annotate } from './spans'

describe('marcações a partir dos offsets da API', () => {
  test('parte o texto em trechos marcados e não marcados, na ordem', () => {
    const { segments } = annotate('a vo dorme', [anAnnotation({ span_start: 2, span_end: 4 })])

    expect(segments.map((segment) => segment.text)).toEqual(['a ', 'vo', ' dorme'])
    expect(segments.map((segment) => segment.mark)).toEqual([0, 1, 0])
  })

  test('acento antes do span não desloca a marcação', () => {
    const body = 'A vó já dormindo, e a família esta cansada.'
    const start = body.indexOf('esta')

    const { segments } = annotate(body, [
      anAnnotation({ span_start: start, span_end: start + 4 }),
    ])

    expect(segments.filter((segment) => segment.mark === 1).map((s) => s.text)).toEqual(['esta'])
  })

  test('conta em pontos de código, como o Python da API', () => {
    // um emoji é um par surrogate em JS e um único caractere no Python
    const body = '🙂 esta'
    const { segments } = annotate(body, [anAnnotation({ span_start: 2, span_end: 6 })])

    expect(segments.filter((segment) => segment.mark === 1).map((s) => s.text)).toEqual(['esta'])
  })

  test('a mesma correção em duas palavras compartilha o número', () => {
    const body = 'esta cansada e a familia dorme'
    const rule = { type: 'accentuation' as const, message: '“está” e “família” levam acento.' }

    const { segments, marks } = annotate(body, [
      anAnnotation({ span_start: 0, span_end: 4, ...rule }),
      anAnnotation({ span_start: 17, span_end: 24, ...rule }),
    ])

    expect(segments.filter((segment) => segment.mark === 1).map((s) => s.text)).toEqual([
      'esta',
      'familia',
    ])
    expect(marks).toHaveLength(1)
  })

  test('correções diferentes recebem números na ordem em que aparecem', () => {
    const { marks } = annotate('oque esta', [
      anAnnotation({ span_start: 5, span_end: 9, message: 'segunda' }),
      anAnnotation({ span_start: 0, span_end: 4, message: 'primeira' }),
    ])

    expect(marks.map((mark) => [mark.number, mark.annotation.message])).toEqual([
      [1, 'primeira'],
      [2, 'segunda'],
    ])
  })

  test('span sobreposto é descartado em vez de embaralhar o texto', () => {
    const { segments, marks } = annotate('esta cansada', [
      anAnnotation({ span_start: 0, span_end: 4, message: 'primeira' }),
      anAnnotation({ span_start: 2, span_end: 7, message: 'sobreposta' }),
    ])

    expect(segments.map((segment) => segment.text).join('')).toBe('esta cansada')
    expect(marks.map((mark) => mark.annotation.message)).toEqual(['primeira'])
  })

  test('span fora do texto é ignorado', () => {
    const { segments, marks } = annotate('curto', [
      anAnnotation({ span_start: 10, span_end: 20 }),
    ])

    expect(segments.map((segment) => segment.text)).toEqual(['curto'])
    expect(marks).toEqual([])
  })

  test('texto sem anotação nenhuma volta inteiro num único trecho', () => {
    const { segments } = annotate('nada a corrigir', [])

    expect(segments).toEqual([{ text: 'nada a corrigir', annotation: null, mark: 0 }])
  })
})
