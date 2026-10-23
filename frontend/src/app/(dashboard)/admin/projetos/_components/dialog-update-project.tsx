'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsProjeto from './form-fields-project'
import { updateProjeto } from '@/actions/projeto'
import { filterFormData } from '@/services/filter-form-data'
import { toastApiError } from '@/services/toast-api-error'
import { useState } from 'react'
import { useToast } from '@/components/use-toast'
import { projetoType } from '@/types/projeto'

interface DialogUpdateProjetoProps {
  projeto: projetoType
  children: React.ReactNode
}

export function DialogUpdateProjeto({
  projeto,
  children,
}: DialogUpdateProjetoProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(await updateProjeto(newForm))

    if (error) {
      toastApiError(toast, error, 'Não foi possível editar o projeto!')
    } else {
      toast({ title: 'Projeto editado com sucesso!' })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar projeto</DialogTitle>
          <DialogDescription>
            Atualize as informações do projeto abaixo e clique em
            &quot;Salvar&quot; para aplicar as alterações.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <FormFieldsProjeto projeto={projeto} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
