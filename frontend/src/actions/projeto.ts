'use server'

import { api } from '@/services/api'
import { validarDatasProjetoNaoFeriado } from '@/services/brasil-api'
import { revalidatePath } from 'next/cache'

export async function createProjeto(form: FormData) {
  const feriadoCheck = await validarDatasProjetoNaoFeriado(form)
  if (!feriadoCheck.ok) {
    return JSON.stringify({
      error: {
        message: feriadoCheck.message,
        errors: feriadoCheck.errors,
      },
    })
  }

  const res = await api('POST', '/projetos', { data: form })

  if (!res.error) {
    revalidatePath('/admin')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function updateProjeto(form: FormData) {
  const feriadoCheck = await validarDatasProjetoNaoFeriado(form)
  if (!feriadoCheck.ok) {
    return JSON.stringify({
      error: {
        message: feriadoCheck.message,
        errors: feriadoCheck.errors,
      },
    })
  }

  // POST + _method=PUT: PHP/Laravel não popula multipart em PUT real
  const res = await api('POST', `/projetos/${form.get('id')}`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function destroyProjeto(id: string) {
  const res = await api('DELETE', `/projetos/${id}`)

  if (!res.error) {
    revalidatePath('/admin')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}
