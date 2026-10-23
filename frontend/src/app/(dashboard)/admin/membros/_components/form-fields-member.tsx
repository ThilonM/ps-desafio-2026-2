'use client'

import { Button } from '@/components/button'
import {
  FormFieldsGroup,
  FormField,
  ImageForm,
  handleImageChange,
} from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { DateInputBr } from '@/components/date-input-br'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { membroType } from '@/types/member'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

interface FormFieldsMemberProps {
  member?: membroType
  readOnly?: boolean
}

export default function FormFieldsMember({
  member,
  readOnly,
}: FormFieldsMemberProps) {
  const { pending } = useFormStatus()
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    member?.image,
  )

  return (
    <>
      <FormFieldsGroup>
        {member && (
          <Input defaultValue={member.id} type="text" name="id" hidden />
        )}
        <FormField>
          <Label htmlFor="nome" required>
            Nome
          </Label>
          <Input
            name="nome"
            id="nome"
            placeholder="Insira o nome completo"
            defaultValue={member?.nome}
            disabled={pending}
            readOnly={readOnly}
            required
            minLength={2}
          />
        </FormField>
        <FormField>
          <Label htmlFor="email" required>
            E-mail
          </Label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="Insira o e-mail"
            defaultValue={member?.email}
            disabled={pending}
            readOnly={readOnly}
            required
            maxLength={255}
          />
        </FormField>
        <FormField>
          <Label htmlFor="senha" required={!member}>
            Senha
          </Label>
          <Input
            name="senha"
            id="senha"
            type="password"
            placeholder={
              member ? 'Deixe em branco para manter' : 'Insira a senha'
            }
            disabled={pending}
            readOnly={readOnly}
            required={!member}
            minLength={member ? undefined : 8}
          />
        </FormField>
        <FormField>
          <Label htmlFor="cor_favorita">Cor favorita</Label>
          <Input
            name="cor_favorita"
            id="cor_favorita"
            placeholder="Ex.: Azul"
            defaultValue={member?.cor_favorita}
            disabled={pending}
            readOnly={readOnly}
            minLength={2}
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_aniversario">Data de aniversário</Label>
          <DateInputBr
            name="data_aniversario"
            id="data_aniversario"
            defaultValue={member?.data_aniversario}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="image">Imagem</Label>
          <Input
            name="image"
            id="image"
            type="file"
            accept="image/*"
            disabled={pending}
            readOnly={readOnly}
            onChange={(event) => handleImageChange(event, setImagePreview)}
          />
          {imagePreview && (
            <ImageForm
              src={imagePreview}
              alt="Pré-visualização da imagem do membro"
              className="max-h-48 w-full rounded border"
            />
          )}
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
