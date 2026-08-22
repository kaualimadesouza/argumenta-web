import { type ComponentProps, useId } from 'react'

import styles from './Field.module.css'

type FieldProps = ComponentProps<'input'> & { label: string; hint?: string }

export function Field({ label, hint, ...rest }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={styles.input} aria-describedby={hint ? hintId : undefined} {...rest} />
      {hint ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  )
}
