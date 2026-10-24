import type { feriadoNacionalType } from '@/types/feriado'

/**
 * Integração externa (tópico 4): BrasilAPI — feriados nacionais.
 * Usada na validação de datas de projeto (início/fim não podem cair em feriado).
 * @see https://brasilapi.com.br/docs#tag/Feriados-Nacionais
 */
export async function fetchFeriadosNacionais(
  ano: number = new Date().getFullYear(),
): Promise<feriadoNacionalType[]> {
  try {
    const res = await fetch(
      `https://brasilapi.com.br/api/feriados/v1/${ano}`,
      { next: { revalidate: 60 * 60 * 24 } },
    )

    if (!res.ok) {
      return []
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      return []
    }

    return data.filter(
      (item): item is feriadoNacionalType =>
        typeof item === 'object' &&
        item !== null &&
        'date' in item &&
        'name' in item &&
        typeof (item as feriadoNacionalType).date === 'string' &&
        typeof (item as feriadoNacionalType).name === 'string',
    )
  } catch {
    return []
  }
}

/** Extrai YYYY-MM-DD de valor ISO ou date-only. */
export function toIsoDateOnly(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : null
}

/**
 * Se a data for feriado nacional, retorna o nome; senão null.
 * Se a API falhar / vier vazia, retorna `unavailable`.
 */
export async function nomeFeriadoNacional(
  dataIso: string,
): Promise<{ nome: string | null; unavailable: boolean }> {
  const ano = Number(dataIso.slice(0, 4))
  if (!Number.isFinite(ano)) {
    return { nome: null, unavailable: false }
  }

  const feriados = await fetchFeriadosNacionais(ano)
  if (!feriados.length) {
    return { nome: null, unavailable: true }
  }

  const hit = feriados.find((f) => f.date === dataIso)
  return { nome: hit?.name ?? null, unavailable: false }
}

/** Valida data_inicio e data_fim de projeto contra feriados nacionais. */
export async function validarDatasProjetoNaoFeriado(form: FormData): Promise<{
  ok: true
} | {
  ok: false
  message: string
  errors: Record<string, string>
}> {
  const campos = ['data_inicio', 'data_fim'] as const
  const labels = {
    data_inicio: 'data de início',
    data_fim: 'data de término',
  }
  const errors: Record<string, string> = {}

  for (const campo of campos) {
    const iso = toIsoDateOnly(form.get(campo))
    if (!iso) continue

    const { nome, unavailable } = await nomeFeriadoNacional(iso)
    if (unavailable) {
      errors[campo] =
        'Não foi possível consultar os feriados nacionais agora. Tente novamente em instantes.'
      continue
    }
    if (nome) {
      errors[campo] =
        `Não é permitido cadastrar projeto com ${labels[campo]} em feriado nacional (${nome}).`
    }
  }

  if (Object.keys(errors).length) {
    return {
      ok: false,
      message: 'As datas do projeto não podem cair em feriado nacional.',
      errors,
    }
  }

  return { ok: true }
}
