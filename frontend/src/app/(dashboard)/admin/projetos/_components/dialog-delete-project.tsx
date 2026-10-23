'use client'

import { destroyProjeto } from '@/actions/projeto'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/dialog'
import { useToast } from '@/components/use-toast'
import { toastApiError } from '@/services/toast-api-error'
import { useState } from 'react'

interface DialogDeleteProjetoProps {
  id: string
  children: React.ReactNode
}

export function DialogProjetoDelete({ id, children }: DialogDeleteProjetoProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async () => {
    const { error } = await JSON.parse(await destroyProjeto(id))

    if (error) {
      toastApiError(toast, error, 'Não foi possível excluir o projeto!')
    } else {
      toast({ title: 'Projeto excluído com sucesso!' })
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão de projeto</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este projeto? Esta ação é
            irreversível e removerá permanentemente o projeto do sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" type="submit">
              Excluir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
