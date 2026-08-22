import { type ComponentProps, useId } from 'react'

import styles from './Select.module.css'

interface Option {
  value: string
  label: string
}

type SelectProps = Omit<ComponentProps<'select'>, 'children'> & {
  label: string
  options: Option[]
}

export function Select({ label, options, className, ...rest }: SelectProps) {
  const id = useId()
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={styles.select} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
