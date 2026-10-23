const phoneReplace = (value: string) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value.substring(0, 15)
}

const whatsAppUrlReplace = (cellphone: string) => {
  if (!cellphone) return ''
  const clearNumber = `55${cellphone.replace(/\D/g, '')}`
  const whatsappUrl = `${process.env.NEXT_PUBLIC_WHATSAPP_URL}/${clearNumber}`
  return whatsappUrl
}

/** Extrai YYYY-MM-DD de ISO ou date-only, sem new Date (evita fuso UTC). */
const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return ''
  if (value instanceof Date) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : ''
}

/** Formata data para exibição pt-BR (dd/mm/yyyy) sem timezone. */
const formatDateBr = (value?: string | Date | null): string => {
  const iso = toDateInputValue(value)
  if (!iso) return '-'
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** Valor inicial de input em dd/mm/yyyy (vazio se não houver data). */
const toDateBrInputValue = (value?: string | Date | null): string => {
  const formatted = formatDateBr(value)
  return formatted === '-' ? '' : formatted
}

/**
 * Converte dd/mm/yyyy → yyyy-mm-dd para a API.
 * Se já estiver em ISO, devolve como está.
 */
const parseDateBrToIso = (value: string): string => {
  const trimmed = value.trim()
  const br = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (br) {
    const [, day, month, year] = br
    return `${year}-${month}-${day}`
  }
  const iso = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  return iso ? iso[1] : trimmed
}

/** Máscara progressiva dd/mm/aaaa enquanto digita. */
const maskDateBr = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export {
  phoneReplace,
  whatsAppUrlReplace,
  toDateInputValue,
  toDateBrInputValue,
  formatDateBr,
  parseDateBrToIso,
  maskDateBr,
}
