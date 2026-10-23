'use client'

import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { membroType } from '@/types/member'
import { projetoType } from '@/types/projeto'
import {
  TAREFA_STATUS_LABELS,
  tarefaStatus,
  tarefaType,
} from '@/types/tarefa'
import { useFormStatus } from 'react-dom'

interface FormFieldsTarefaProps {
  tarefa?: tarefaType
  projetos: projetoType[]
  membros: membroType[]
  readOnly?: boolean
}

const statuses = Object.keys(TAREFA_STATUS_LABELS) as tarefaStatus[]

export default function FormFieldsTarefa({
  tarefa,
  projetos,
  membros,
  readOnly,
}: FormFieldsTarefaProps) {
  const { pending } = useFormStatus()

  return (
    <>
      <FormFieldsGroup>
        {tarefa && (
          <Input defaultValue={tarefa.id} type="text" name="id" hidden />
        )}
        <FormField>
          <Label htmlFor="titulo">Título</Label>
          <Input
            name="titulo"
            id="titulo"
            placeholder="Título da tarefa"
            defaultValue={tarefa?.titulo}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            name="descricao"
            id="descricao"
            placeholder="Opcional"
            defaultValue={tarefa?.descricao ?? ''}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="projeto_id">Projeto</Label>
          <select
            name="projeto_id"
            id="projeto_id"
            defaultValue={tarefa?.projeto_id ?? ''}
            disabled={pending || readOnly}
            required
            className="col-span-3 rounded border border-input bg-transparent px-3 py-2 text-base shadow"
          >
            <option value="" disabled>
              Selecione um projeto
            </option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome}
              </option>
            ))}
          </select>
        </FormField>
        <FormField>
          <Label htmlFor="membro_id">Membro</Label>
          <select
            name="membro_id"
            id="membro_id"
            defaultValue={tarefa?.membro_id ?? ''}
            disabled={pending || readOnly}
            required
            className="col-span-3 rounded border border-input bg-transparent px-3 py-2 text-base shadow"
          >
            <option value="" disabled>
              Selecione um membro
            </option>
            {membros.map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome}
              </option>
            ))}
          </select>
        </FormField>
        <FormField>
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            id="status"
            defaultValue={tarefa?.status ?? 'pendente'}
            disabled={pending || readOnly}
            className="col-span-3 rounded border border-input bg-transparent px-3 py-2 text-base shadow"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {TAREFA_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </FormField>
      </FormFieldsGroup>
      <DialogFooter className={cn({ hidden: readOnly })}>
        <Button type="submit" pending={pending}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  )
}
