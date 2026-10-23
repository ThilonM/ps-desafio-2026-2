'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsMember from './form-fields-member'
import { MemberProjetos } from './member-projetos'
import { membroType } from '@/types/member'
import SkeletonFormFieldsMember from './skeleton-members'
import { useState } from 'react'

interface DialogInformationMemberProps {
  member: membroType
  children: React.ReactNode
  isInformation?: boolean
}

export function DialogInformationMember({
  member,
  children,
}: DialogInformationMemberProps) {
  const [open, setOpen] = useState<boolean>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Informações do membro</DialogTitle>
          <DialogDescription>
            Dados cadastrais e todos os projetos em que o membro está alocado.
          </DialogDescription>
        </DialogHeader>
        {member ? (
          <>
            <FormFieldsMember member={member} readOnly />
            <MemberProjetos projetos={member.projetos} />
          </>
        ) : (
          <SkeletonFormFieldsMember readOnly />
        )}
      </DialogContent>
    </Dialog>
  )
}
