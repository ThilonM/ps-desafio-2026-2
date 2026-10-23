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
import { updateTarefa } from '@/actions/tarefa'
import { filterFormData } from '@/services/filter-form-data'
import { toastApiError } from '@/services/toast-api-error'
import { useState } from 'react'
import { useToast } from '@/components/use-toast'
import { projetoType } from '@/types/projeto'
import { membroType } from '@/types/member'
import { tarefaType } from '@/types/tarefa'

interface DialogUpdateTarefaProps {
  children: React.ReactNode
  tarefa: tarefaType
  projetos: projetoType[]
  membros: membroType[]
}

export function DialogUpdateTarefa({
  children,
  tarefa,
  projetos,
  membros,
}: DialogUpdateTarefaProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(await updateTarefa(newForm))

    if (error) {
      toastApiError(toast, error, 'Não foi possível editar a tarefa!')
    } else {
      toast({ title: 'Tarefa editada com sucesso!' })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
          <DialogDescription>
            Atualize os dados da tarefa. Mudar o membro/projeto também passa
            pela trava de alocação.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <FormFieldsTarefa
            tarefa={tarefa}
            projetos={projetos}
            membros={membros}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
