'use client'

import { destroyMember } from '@/actions/member'
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

interface DialogDeleteMemberProps {
  id: string
  children: React.ReactNode
}

export function DialogMemberDelete({ id, children }: DialogDeleteMemberProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async () => {
    const { error } = await JSON.parse(await destroyMember(id))

    if (error) {
      toastApiError(toast, error, 'Não foi possível excluir o membro!')
    } else {
      toast({
        title: 'Membro excluído com sucesso!',
      })
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão de membro</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este membro? Esta ação é
            irreversível e removerá permanentemente o membro do sistema. Deseja
            continuar com a exclusão?
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
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
