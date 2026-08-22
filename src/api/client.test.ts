import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { ApiError } from './ApiError'
import { createHttpApi } from './client'

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createHttpApi', () => {
  test('envia o corpo como JSON e devolve a resposta tipada', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'u1', nickname: 'Aluno' }))

    const user = await createHttpApi().login({ email: 'a@b.com', password: 'segredo-12' })

    expect(user.nickname).toBe('Aluno')
    const [path, init] = fetchMock.mock.calls[0]
    expect(path).toBe('/auth/login')
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('same-origin')
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.com', password: 'segredo-12' })
  })

  test('204 não tenta ler corpo nenhum', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    await expect(createHttpApi().logout()).resolves.toBeUndefined()
  })

  test('erro de domínio virá com o código que a API mandou', async () => {
    fetchMock.mockResolvedValue(jsonResponse(409, { detail: 'EmailAlreadyRegisteredError' }))

    const failure = createHttpApi().register({
      email: 'a@b.com',
      nickname: 'Aluno',
      password: 'segredo-12',
      accepted_terms: true,
    })

    await expect(failure).rejects.toThrow(ApiError)
    await expect(failure).rejects.toMatchObject({
      status: 409,
      code: 'EmailAlreadyRegisteredError',
    })
  })

  test('erro de validação do pydantic vira um código só', async () => {
    fetchMock.mockResolvedValue(jsonResponse(422, { detail: [{ loc: ['body'], msg: 'nope' }] }))

    await expect(createHttpApi().me()).rejects.toMatchObject({ code: 'ValidationError' })
  })

  test('401 tenta renovar a sessão uma vez e repete a chamada', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'invalid or expired token' }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(jsonResponse(200, { user: { nickname: 'Aluno' }, targets: [] }))

    const me = await createHttpApi().me()

    expect(me.user.nickname).toBe('Aluno')
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual(['/me', '/auth/refresh', '/me'])
  })

  test('401 sem renovação possível propaga o 401 original', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'invalid or expired token' }))
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'not authenticated' }))

    await expect(createHttpApi().me()).rejects.toMatchObject({ status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  test('um 401 do próprio login não vira tentativa de renovação', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { detail: 'InvalidCredentialsError' }))

    await expect(
      createHttpApi().login({ email: 'a@b.com', password: 'errada' }),
    ).rejects.toMatchObject({ code: 'InvalidCredentialsError' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
