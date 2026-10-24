import type { feriadoNacionalType } from '@/types/feriado'

/**
 * Integração externa (tópico 4): BrasilAPI — feriados nacionais.
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

/** Próximos feriados a partir de hoje (máx. `limite`). */
export function proximosFeriados(
  feriados: feriadoNacionalType[],
  limite = 5,
): feriadoNacionalType[] {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  return feriados
    .filter((f) => {
      const d = new Date(`${f.date}T00:00:00`)
      return d >= hoje
    })
    .slice(0, limite)
}
