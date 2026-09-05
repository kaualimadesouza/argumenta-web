import { Link } from 'react-router-dom'

import { RouteButton } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { PenMark } from '../../components/art/PenMark'
import { Wordmark } from '../../components/art/Wordmark'
import { ChapterMarquee } from './ChapterMarquee'
import { CLOSING_FACTS, DIMENSIONS, FACTS, FAQ, HERO_SCENE, HERO_TAGLINE } from './content'
import { HowItWorks } from './HowItWorks'
import { Plans } from './Plans'
import { Reveal } from './Reveal'
import { Scene } from './Scene'
import styles from './Landing.module.css'

interface NavEntry {
  href: string
  label: string
}

const NAV: NavEntry[] = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#historias', label: 'Histórias' },
  { href: '#planos', label: 'Planos' },
  { href: '#perguntas', label: 'Perguntas' },
]

/** The promotional page a visitor reads before signing up. One action, repeated
 *  down the page: start for free. */
export function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.wrap}>
        <nav className={styles.nav} aria-label="Navegação da página">
          <Link to="/" className={styles.brand}>
            <Wordmark />
          </Link>
          <div className={styles.navLinks}>
            {NAV.map((entry) => (
              <a key={entry.href} href={entry.href}>
                {entry.label}
              </a>
            ))}
          </div>
          <div className={styles.navActions}>
            <RouteButton to="/entrar/email" variant="quiet" className={styles.navQuiet}>
              Já tenho conta
            </RouteButton>
            <RouteButton to="/entrar" className={styles.navCta}>
              Começar grátis
            </RouteButton>
          </div>
        </nav>
      </header>

      <main>
        <section className={styles.wrap} aria-labelledby="promessa">
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <Chip>Beta gratuito · 3 correções por dia</Chip>
              <h1 id="promessa" className={styles.h1}>
                {HERO_TAGLINE}
              </h1>
              <p className={styles.lead}>
                Você vive um personagem, encontra um conflito e precisa convencer alguém escrevendo.
                Um corretor avalia o seu texto na hora, com os critérios do ENEM e da FUVEST, e a
                história muda conforme o argumento que você fez.
              </p>
              <div className={styles.ctaRow}>
                <RouteButton to="/entrar" className={styles.cta}>
                  Começar grátis
                </RouteButton>
                <a href="#como-funciona" className={styles.ghostLink}>
                  Ver como funciona
                </a>
              </div>
              <p className={styles.note}>Sem cartão. Só pedimos e-mail, apelido e o ano do seu vestibular.</p>
            </div>
            <div className={styles.shot} aria-hidden="true">
              <div className={styles.screen}>
                <div className={styles.screenBar}>
                  <span className={styles.back}>Trilha</span>
                  <span className={styles.chips}>
                    <Chip tone="streak">3 dias</Chip>
                    <Chip>1/3 envios hoje</Chip>
                  </span>
                </div>
                <Scene scene={HERO_SCENE} />
                <span className={styles.fakeButton}>Argumentar</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.wrap} aria-label="Em números">
          <Reveal className={styles.facts}>
            {FACTS.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <span className={styles.factNumber}>{fact.number}</span>
                <span className={styles.factLabel}>{fact.label}</span>
                <p className={styles.factNote}>{fact.note}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section className={styles.section} id="historias" aria-labelledby="historias-titulo">
          <div className={styles.wrap}>
            <Reveal className={styles.sectionHead}>
              <h2 id="historias-titulo" className={styles.h2}>
                Cada capítulo é uma discussão que você precisa vencer.
              </h2>
              <p className={styles.sub}>
                Três histórias no beta. Cada uma embrulha um tema que já caiu de verdade no ENEM ou na
                FUVEST, e termina com a redação completa no formato da prova.
              </p>
            </Reveal>
          </div>
          <ChapterMarquee />
        </section>

        <section
          className={[styles.section, styles.sectionTight].join(' ')}
          id="como-funciona"
          aria-labelledby="como-funciona-titulo"
        >
          <div className={styles.wrap}>
            <Reveal className={styles.sectionHead}>
              <h2 id="como-funciona-titulo" className={styles.h2}>
                Como funciona
              </h2>
              <p className={styles.sub}>Você escreve. O personagem responde. A história segue, ou não.</p>
            </Reveal>
            <Reveal>
              <HowItWorks />
            </Reveal>
          </div>
        </section>

        <section className={styles.wrap} aria-label="Por que o Argumenta existe">
          <Reveal className={styles.thesis}>
            <p className={styles.thesisQuote}>
              Treinar redação hoje é solitário e abstrato: um tema, uma folha em branco e uma nota dias
              depois.
            </p>
            <p className={styles.thesisAnswer}>
              Com um interlocutor que responde, consequência imediata e correção na hora, treino vira
              hábito. É para isso que o Argumenta existe.
            </p>
            <p className={styles.thesisWho}>
              <span className={styles.thesisRule} />
              <span>A tese do Argumenta</span>
            </p>
          </Reveal>
        </section>

        <section className={styles.section} aria-labelledby="criterios-titulo">
          <div className={styles.wrap}>
            <Reveal className={styles.sectionHead}>
              <h2 id="criterios-titulo" className={styles.h2}>
                Corrigido com a régua da banca, explicado como um professor explicaria.
              </h2>
              <p className={styles.sub}>
                Um motor único avalia cinco dimensões. ENEM e FUVEST são lentes: mudam como a nota
                aparece, nunca o veredito.
              </p>
            </Reveal>
            <Reveal className={styles.dimensions}>
              {DIMENSIONS.map((dimension) => (
                <article key={dimension.number} className={styles.dimension}>
                  <div className={styles.dimensionTop}>
                    <span className={styles.dimensionNumber}>{dimension.number}</span>
                    {dimension.argumentaOnly ? <Chip>critério Argumenta</Chip> : null}
                  </div>
                  <h3 className={styles.dimensionTitle}>{dimension.title}</h3>
                  <p className={styles.dimensionText}>{dimension.text}</p>
                </article>
              ))}
            </Reveal>
            <p className={styles.evidence}>
              <strong>Toda nota vem com o trecho do seu texto que a justifica.</strong> Sem evidência,
              sem desconto.
            </p>
          </div>
        </section>

        <section
          className={[styles.section, styles.sectionTight].join(' ')}
          id="planos"
          aria-labelledby="planos-titulo"
        >
          <div className={styles.wrap}>
            <Reveal className={styles.sectionHead}>
              <h2 id="planos-titulo" className={styles.h2}>
                Comece de graça. Pague só quando o hábito pegar.
              </h2>
              <p className={styles.sub}>
                O beta é gratuito, com limite diário de correções. Os planos pagos vão ampliar o limite e
                abrir a sua evolução por dimensão.
              </p>
            </Reveal>
            <Reveal>
              <Plans />
            </Reveal>
            <p className={styles.planNote}>
              Qualquer envio mantém a sua sequência, em qualquer plano.
            </p>
          </div>
        </section>

        <section
          className={[styles.section, styles.sectionTight].join(' ')}
          id="perguntas"
          aria-labelledby="perguntas-titulo"
        >
          <div className={styles.wrap}>
            <Reveal className={styles.sectionHead}>
              <h2 id="perguntas-titulo" className={styles.h2}>
                As três perguntas que todo mundo faz
              </h2>
            </Reveal>
            <Reveal className={styles.faq}>
              {FAQ.map((entry) => (
                <div key={entry.number} className={styles.question}>
                  <span className={styles.questionNumber}>{entry.number}</span>
                  <h3 className={styles.questionTitle}>{entry.question}</h3>
                  <p className={styles.answer}>{entry.answer}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className={styles.wrap} aria-labelledby="chamada-titulo">
          <Reveal className={styles.closing}>
            <PenMark width={160} />
            <h2 id="chamada-titulo" className={[styles.h2, styles.closingTitle].join(' ')}>
              Pare de treinar no vazio. Comece a convencer alguém.
            </h2>
            <p className={styles.sub}>Pronto quando você estiver.</p>
            <RouteButton to="/entrar" className={styles.cta}>
              Começar grátis
            </RouteButton>
            <p className={styles.note}>Entre com Google ou crie uma conta com e-mail.</p>
            <div className={styles.closingFacts}>
              {CLOSING_FACTS.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <span className={[styles.factNumber, styles.factNumberSmall].join(' ')}>
                    {fact.number}
                  </span>
                  <span className={styles.factLabel}>{fact.label}</span>
                  <p className={styles.factNote}>{fact.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className={styles.wrap}>
        <div className={styles.footer}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.brand}>
              <Wordmark />
            </Link>
            <p className={styles.footerLine}>
              Treino de argumentação escrita para o ENEM e a FUVEST, dentro de histórias.
            </p>
            <p className={styles.copyright}>© 2026 Argumenta</p>
          </div>
          <div className={styles.footerColumn}>
            <span className={styles.footerTitle}>Produto</span>
            {NAV.map((entry) => (
              <a key={entry.href} href={entry.href}>
                {entry.label}
              </a>
            ))}
            <Link to="/entrar">Entrar</Link>
          </div>
          <div className={styles.footerColumn}>
            <span className={styles.footerTitle}>Legal</span>
            <Link to="/privacidade">Política de privacidade</Link>
            <Link to="/termos">Termos de uso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
