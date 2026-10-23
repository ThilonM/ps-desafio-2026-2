'use client'

import { Input, InputProps } from '@/components/input'
import { maskDateBr, toDateBrInputValue } from '@/services/formatter'

type DateInputBrProps = Omit<InputProps, 'type' | 'defaultValue'> & {
  defaultValue?: string | Date | null
}

/** Campo de data em dd/mm/aaaa (envia nesse formato; filterFormData converte para ISO). */
export function DateInputBr({
  defaultValue,
  onInput,
  placeholder = 'dd/mm/aaaa',
  ...props
}: DateInputBrProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      maxLength={10}
      pattern="\d{2}/\d{2}/\d{4}"
      title="Use o formato dd/mm/aaaa"
      placeholder={placeholder}
      defaultValue={toDateBrInputValue(defaultValue)}
      onInput={(event) => {
        event.currentTarget.value = maskDateBr(event.currentTarget.value)
        onInput?.(event)
      }}
    />
  )
}
