import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'quiet'

function classesFor(variant: ButtonVariant, extra?: string): string {
  return [styles.button, styles[variant], extra].filter(Boolean).join(' ')
}

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant }

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={classesFor(variant, className)} {...rest} />
}

type RouteButtonProps = ComponentProps<typeof Link> & { variant?: ButtonVariant }

export function RouteButton({ variant = 'primary', className, ...rest }: RouteButtonProps) {
  return <Link className={classesFor(variant, className)} {...rest} />
}

type LinkButtonProps = ComponentProps<'a'> & { variant?: ButtonVariant }

/** For leaving the app entirely (the Google consent screen). */
export function LinkButton({ variant = 'primary', className, ...rest }: LinkButtonProps) {
  return <a className={classesFor(variant, className)} {...rest} />
}
