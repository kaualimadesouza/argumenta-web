import { ApiError } from './ApiError'

/** One place for the pt-BR of every domain error the API can answer. */
const MESSAGES: Record<string, string> = {
  EmailAlreadyRegisteredError: 'Esse e-mail já tem uma conta. Entre em vez de criar.',
  InvalidCredentialsError: 'E-mail ou senha não conferem.',
  TermsNotAcceptedError: 'Você precisa aceitar os termos para criar a conta.',
  GoogleSignInFailedError: 'O login com o Google não completou. Tente de novo.',
  TooManyAttemptsError: 'Muitas tentativas seguidas. Espere alguns minutos.',
  ExamTargetAlreadyExistsError: 'Esse vestibular já está na sua lista.',
  ExamTargetNotFoundError: 'Esse vestibular não está mais na sua lista.',
  AccountNotFoundError: 'Essa conta não existe mais.',
  ChapterNotFoundError: 'Esse capítulo não existe.',
  ChapterLockedError: 'Esse capítulo ainda está trancado. Termine o anterior para abrir este.',
  ChapterNotWritableError: 'Esse capítulo não está esperando texto agora.',
  ValidationError: 'Confira os campos: algo aí não está no formato esperado.',
}

const FALLBACK = 'Algo deu errado aqui do nosso lado. Tente de novo em instantes.'
const OFFLINE = 'Sem conexão com o Argumenta. Verifique a internet e tente de novo.'

export function messageFor(error: unknown): string {
  if (!(error instanceof ApiError)) return OFFLINE
  return MESSAGES[error.code] ?? FALLBACK
}
