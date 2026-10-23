'use server'

import { api } from '@/services/api'
import { revalidatePath } from 'next/cache'

export async function createTarefa(form: FormData) {
  const res = await api('POST', '/tarefas', { data: form })

  if (!res.error) {
    revalidatePath('/admin/tarefas')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function updateTarefa(form: FormData) {
  const res = await api('PUT', `/tarefas/${form.get('id')}`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin/tarefas')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function destroyTarefa(id: string) {
  const res = await api('DELETE', `/tarefas/${id}`)

  if (!res.error) {
    revalidatePath('/admin/tarefas')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function attachMembroProjeto(projetoId: string, form: FormData) {
  const res = await api('POST', `/projetos/${projetoId}/membros`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin/projetos')
    revalidatePath('/admin/tarefas')
  }

  return JSON.stringify(res)
}

export async function detachMembroProjeto(projetoId: string, membroId: string) {
  const res = await api('DELETE', `/projetos/${projetoId}/membros/${membroId}`)

  if (!res.error) {
    revalidatePath('/admin/projetos')
    revalidatePath('/admin/tarefas')
  }

  return JSON.stringify(res)
}
