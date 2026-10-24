'use client'

import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'
import {
  clearPortugueseCustomValidity,
  setPortugueseCustomValidity,
} from '@/lib/validation-messages-pt'

export function NativeSelect({
  className,
  onInvalid,
  onInput,
  onChange,
  ...props
}: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'col-span-3 rounded border border-input bg-transparent px-3 py-2 text-base shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
      onInvalid={(event) => {
        setPortugueseCustomValidity(event.currentTarget)
        onInvalid?.(event)
      }}
      onInput={(event) => {
        clearPortugueseCustomValidity(event.currentTarget)
        onInput?.(event)
      }}
      onChange={(event) => {
        clearPortugueseCustomValidity(event.currentTarget)
        onChange?.(event)
      }}
    />
  )
}
