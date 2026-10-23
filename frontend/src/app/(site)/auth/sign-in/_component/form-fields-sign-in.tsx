'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { useFormStatus } from 'react-dom'

interface FormFieldsSignIn {
  error: string
}

export function FormFieldsSignIn({ error }: FormFieldsSignIn) {
  const { pending } = useFormStatus()

  return (
    <>
      <div>
        <Label htmlFor="email" className="mt-2" required>
          E-mail
        </Label>
        <Input
          type="email"
          name="email"
          placeholder="Insira seu e-mail"
          disabled={pending}
          required
          maxLength={255}
        />
      </div>
      <div>
        <Label htmlFor="password" className="mt-2" required>
          Senha
        </Label>
        <Input
          type="password"
          name="password"
          placeholder="Insira sua senha"
          disabled={pending}
          required
          minLength={8}
        />
      </div>
      <p className="text-sm text-destructive" hidden={!error}>
        {error}
      </p>
      <div className="flex justify-center">
        <Button type="submit" className="w-full mt-2" pending={pending}>
          Entrar
        </Button>
      </div>
    </>
  )
}
