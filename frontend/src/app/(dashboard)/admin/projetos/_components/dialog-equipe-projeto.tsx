'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { NativeSelect } from '@/components/native-select'
import {
  attachMembroProjeto,
  detachMembroProjeto,
} from '@/actions/tarefa'
import { filterFormData } from '@/services/filter-form-data'
import { toastApiError } from '@/services/toast-api-error'
import { useState } from 'react'
import { useToast } from '@/components/use-toast'
import { projetoType } from '@/types/projeto'
import { membroType } from '@/types/member'
import { LuUsers, LuTrash } from 'react-icons/lu'
import { useFormStatus } from 'react-dom'

interface DialogEquipeProjetoProps {
  projeto: projetoType & { membros?: membroType[] }
  membros: membroType[]
  children?: React.ReactNode
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" pending={pending}>
      {label}
    </Button>
  )
}

export function DialogEquipeProjeto({
  projeto,
  membros,
  children,
}: DialogEquipeProjetoProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()
  const equipe = projeto.membros ?? []
  const equipeIds = new Set(equipe.map((m) => m.id))
  const disponiveis = membros.filter((m) => !equipeIds.has(m.id))

  const submitAttach = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(
      await attachMembroProjeto(projeto.id, newForm),
    )

    if (error) {
      toastApiError(
        toast,
        error,
        'Não foi possível alocar o membro neste projeto!',
      )
    } else {
      toast({ title: 'Membro alocado no projeto!' })
    }
  }

  const submitDetach = async (membroId: string) => {
    const { error } = await JSON.parse(
      await detachMembroProjeto(projeto.id, membroId),
    )

    if (error) {
      toastApiError(toast, error, 'Não foi possível remover o membro!')
    } else {
      toast({ title: 'Membro removido do projeto!' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="icon" title="Equipe do projeto">
            <LuUsers />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Equipe — {projeto.nome}</DialogTitle>
          <DialogDescription>
            Um membro pode estar em no máximo 2 projetos ativos no mesmo
            intervalo de realização. Se a trava disparar, o aviso aparece neste toast.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Membros alocados</p>
            {!equipe.length && (
              <p className="text-sm text-muted-foreground">
                Nenhum membro neste projeto ainda.
              </p>
            )}
            {equipe.map((membro) => (
              <div
                key={membro.id}
                className="flex items-center justify-between gap-2 border-b border-border py-2"
              >
                <div>
                  <p className="text-sm font-medium">{membro.nome}</p>
                  <p className="text-xs text-muted-foreground">{membro.email}</p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive-inverse"
                  onClick={() => submitDetach(membro.id)}
                >
                  <LuTrash />
                </Button>
              </div>
            ))}
          </div>

          <form action={submitAttach} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`membro-${projeto.id}`} required>
                Alocar membro
              </Label>
              <NativeSelect
                id={`membro-${projeto.id}`}
                name="membro_id"
                required
                defaultValue=""
                className="w-full"
              >
                <option value="" disabled>
                  Selecione um membro
                </option>
                {disponiveis.map((membro) => (
                  <option key={membro.id} value={membro.id}>
                    {membro.nome}
                  </option>
                ))}
              </NativeSelect>
              <Input type="hidden" name="projeto_id" value={projeto.id} />
            </div>
            <SubmitButton label="Alocar" />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
