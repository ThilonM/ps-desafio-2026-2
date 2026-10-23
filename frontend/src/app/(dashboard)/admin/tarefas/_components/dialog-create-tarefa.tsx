'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsTarefa from './form-fields-tarefa'
import { createTarefa } from '@/actions/tarefa'
import { filterFormData } from '@/services/filter-form-data'
import { toastApiError } from '@/services/toast-api-error'
import { useState } from 'react'
import { useToast } from '@/components/use-toast'
import { projetoType } from '@/types/projeto'
import { membroType } from '@/types/member'

interface DialogCreateTarefaProps {
  children: React.ReactNode
  projetos: projetoType[]
  membros: membroType[]
}

export function DialogCreateTarefa({
  children,
  projetos,
  membros,
}: DialogCreateTarefaProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(await createTarefa(newForm))

    if (error) {
      toastApiError(toast, error, 'Não foi possível criar a tarefa!')
    } else {
      toast({ title: 'Tarefa criada com sucesso!' })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar tarefa</DialogTitle>
          <DialogDescription>
            Vincule a tarefa a um projeto e atribua obrigatoriamente a um
            membro. Se o membro ainda não estiver no projeto, a alocação
            respeita a trava de no máximo 2 projetos ativos no mesmo intervalo.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <FormFieldsTarefa projetos={projetos} membros={membros} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
