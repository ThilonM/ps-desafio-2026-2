'use client'

import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { NativeSelect } from '@/components/native-select'
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
          <Label htmlFor="titulo" required>
            Título
          </Label>
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
          <Label htmlFor="projeto_id" required>
            Projeto
          </Label>
          <NativeSelect
            name="projeto_id"
            id="projeto_id"
            defaultValue={tarefa?.projeto_id ?? ''}
            disabled={pending || readOnly}
            required
          >
            <option value="" disabled>
              Selecione um projeto
            </option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField>
          <Label htmlFor="membro_id" required>
            Membro
          </Label>
          <NativeSelect
            name="membro_id"
            id="membro_id"
            defaultValue={tarefa?.membro_id ?? ''}
            disabled={pending || readOnly}
            required
          >
            <option value="" disabled>
              Selecione um membro
            </option>
            {membros.map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField>
          <Label htmlFor="status">Situação</Label>
          <NativeSelect
            name="status"
            id="status"
            defaultValue={tarefa?.status ?? 'pendente'}
            disabled={pending || readOnly}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {TAREFA_STATUS_LABELS[status]}
              </option>
            ))}
          </NativeSelect>
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
