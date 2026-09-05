import { RouteButton } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { type PlanCopy, PLANS } from './content'
import styles from './Plans.module.css'

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m5.5 12.4 4.2 4.1L18.5 7.6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function Plan({ plan }: { plan: PlanCopy }) {
  return (
    <article className={styles.plan}>
      <div className={styles.head}>
        <div className={styles.top}>
          <h3 className={styles.name}>{plan.name}</h3>
          <Chip tone={plan.startable ? 'neutral' : 'caneta'}>{plan.startable ? 'Beta' : 'Em breve'}</Chip>
        </div>
        {plan.price === null ? (
          <p className={styles.price}>
            <span className={styles.soon}>Preço a definir</span>
            <span className={styles.priceNote}>{plan.priceNote}</span>
          </p>
        ) : (
          <p className={styles.price}>
            <span className={styles.amount}>{plan.price}</span>
            <span className={styles.priceNote}>{plan.priceNote}</span>
          </p>
        )}
        <p className={styles.description}>{plan.description}</p>
      </div>
      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature}>
            {CHECK}
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.startable ? (
        <RouteButton to="/entrar" className={styles.cta}>
          Começar grátis
        </RouteButton>
      ) : (
        <p className={styles.waiting}>Disponível depois do beta.</p>
      )}
    </article>
  )
}

/** The three plans. Only the free one can be started: the beta has no billing,
 *  so the paid plans say so instead of carrying a price. */
export function Plans() {
  return (
    <div className={styles.plans}>
      {PLANS.map((plan) => (
        <Plan key={plan.name} plan={plan} />
      ))}
    </div>
  )
}
