'use client'

import type { ReactNode } from 'react'
import type { ResponseErrorType } from '@/services/api'

type ToastFn = (props: {
  title?: ReactNode
  description?: ReactNode
  variant?: 'default' | 'destructive'
}) => void

/** Exibe mensagem 422 do Laravel (message + errors por campo). */
export function toastApiError(
  toast: ToastFn,
  error: ResponseErrorType | undefined,
  fallbackTitle: string,
) {
  if (!error) {
    toast({ title: fallbackTitle, variant: 'destructive' })
    return
  }

  const fieldErrors = error.errors
    ? Object.values(error.errors).filter(Boolean)
    : []

  toast({
    title: error.message || fallbackTitle,
    description: fieldErrors.length ? fieldErrors.join(' · ') : undefined,
    variant: 'destructive',
  })
}
