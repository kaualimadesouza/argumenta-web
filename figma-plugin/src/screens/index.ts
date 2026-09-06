import type { Device } from '../devices'
import { conta, onboarding, progresso, trilha } from './app'
import { criarConta, entrada, entrarEmail, googleCallback, legal, notFound } from './auth'
import { landing } from './landing'
import { cena, consequencia, correcao, editor, historico } from './writing'

export interface ScreenEntry {
  /** The frame's name on the canvas. */
  label: string
  /** The routes this frame stands for, checked against src/App.tsx. */
  routes: string[]
  build: (device: Device) => FrameNode
}

/** The landing is its own band: it is a full page scroll, not a device screen. */
export const LANDING: ScreenEntry = {
  label: 'Landing',
  routes: ['/'],
  build: landing,
}

/** Every other screen, in the order a student meets it. */
export const SCREENS: ScreenEntry[] = [
  LANDING,
  { label: 'Entrada', routes: ['/entrar'], build: entrada },
  { label: 'Criar conta', routes: ['/criar-conta'], build: criarConta },
  { label: 'Entrar com e-mail', routes: ['/entrar/email'], build: entrarEmail },
  { label: 'Entrando com Google', routes: ['/entrar/google'], build: googleCallback },
  { label: 'Onboarding', routes: ['/onboarding'], build: onboarding },
  { label: 'Trilha', routes: ['/trilha'], build: trilha },
  { label: 'Cena', routes: ['/capitulos/:chapterId'], build: cena },
  { label: 'Editor', routes: ['/capitulos/:chapterId/escrever'], build: editor },
  { label: 'Correção', routes: ['/capitulos/:chapterId/correcao'], build: correcao },
  { label: 'Consequência', routes: ['/capitulos/:chapterId/consequencia'], build: consequencia },
  { label: 'Histórico', routes: ['/capitulos/:chapterId/historico'], build: historico },
  { label: 'Progresso', routes: ['/progresso'], build: progresso },
  { label: 'Conta', routes: ['/conta'], build: conta },
  { label: 'Privacidade e Termos', routes: ['/privacidade', '/termos'], build: legal },
  { label: '404', routes: ['*'], build: notFound },
]

/** The device bands draw everything except the landing. */
export const DEVICE_SCREENS: ScreenEntry[] = SCREENS.filter((screen) => screen !== LANDING)
