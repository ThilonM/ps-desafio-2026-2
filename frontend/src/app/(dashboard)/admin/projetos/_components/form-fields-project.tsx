'use client'

import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { DateInputBr } from '@/components/date-input-br'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { projetoType } from '@/types/projeto'
import { useFormStatus } from 'react-dom'

interface FormFieldsProjetoProps {
  projeto?: projetoType
  readOnly?: boolean
}

export default function FormFieldsProjeto({
  projeto,
  readOnly,
}: FormFieldsProjetoProps) {
  const { pending } = useFormStatus()

  return (
    <>
      <FormFieldsGroup>
        {projeto && (
          <Input defaultValue={projeto.id} type="text" name="id" hidden />
        )}
        <FormField>
          <Label htmlFor="nome" required>
            Nome
          </Label>
          <Input
            name="nome"
            id="nome"
            placeholder="Insira o nome"
            defaultValue={projeto?.nome}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="nome_cliente" required>
            Nome do cliente
          </Label>
          <Input
            name="nome_cliente"
            id="nome_cliente"
            placeholder="Insira o nome do cliente"
            defaultValue={projeto?.nome_cliente}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="descricao" required>
            Descrição
          </Label>
          <Input
            name="descricao"
            id="descricao"
            placeholder="Insira a descrição do projeto"
            defaultValue={projeto?.descricao}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_inicio" required>
            Data de início
          </Label>
          <DateInputBr
            name="data_inicio"
            id="data_inicio"
            defaultValue={projeto?.data_inicio}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_fim" required>
            Data de fim
          </Label>
          <DateInputBr
            name="data_fim"
            id="data_fim"
            defaultValue={projeto?.data_fim}
            disabled={pending}
            readOnly={readOnly}
            required
          />
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
