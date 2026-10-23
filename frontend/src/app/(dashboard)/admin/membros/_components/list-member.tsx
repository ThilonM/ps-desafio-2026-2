import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { Button } from '@/components/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard/table'
import { api } from '@/services/api'
import { formatDateBr } from '@/services/formatter'
import { membroType } from '@/types/member'
import { LuInfo, LuPen, LuPlusCircle, LuTrash } from 'react-icons/lu'
import { DialogUpdateMember } from './dialog-update-member'
import { DialogMemberDelete } from './dialog-delete-member'
import { DialogInformationMember } from './dialog-information-member'
import { DialogCreateMember } from './dialog-create-member'

function MemberActions({ member }: { member: membroType }) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <DialogInformationMember member={member}>
        <Button variant="default-inverse" size="icon">
          <LuInfo />
        </Button>
      </DialogInformationMember>
      <DialogUpdateMember member={member}>
        <Button variant="secondary-inverse" size="icon">
          <LuPen />
        </Button>
      </DialogUpdateMember>
      <DialogMemberDelete id={member.id}>
        <Button variant="destructive-inverse" size="icon">
          <LuTrash />
        </Button>
      </DialogMemberDelete>
    </div>
  )
}

export default async function ListMembers() {
  const { response } = await api<membroType[]>('GET', '/membros')

  if (!response) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível obter os membros.
      </DashboardContainer>
    )
  }

  return (
    <>
      <DashboardContainer className="flex h-min justify-between space-x-0 gap-y-2.5 max-sm:flex-col">
        <DialogCreateMember>
          <Button size="sm">
            <LuPlusCircle />
            Novo membro
          </Button>
        </DialogCreateMember>
      </DashboardContainer>

      <DashboardContainer className="space-y-3 md:hidden">
        {!response.length && (
          <p className="text-sm text-muted-foreground">
            Nenhum membro encontrado.
          </p>
        )}
        {response.map((member) => (
          <article
            key={member.id}
            className="space-y-3 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <p className="font-semibold leading-tight">{member.nome}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <p className="text-sm text-muted-foreground">
                Cor: {member.cor_favorita || '-'} · Aniversário:{' '}
                {formatDateBr(member.data_aniversario)}
              </p>
              <p className="text-sm text-muted-foreground">
                Projetos: {member.projetos?.length ?? 0}
              </p>
            </div>
            <MemberActions member={member} />
          </article>
        ))}
      </DashboardContainer>

      <DashboardContainer className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cor favorita</TableHead>
              <TableHead>Aniversário</TableHead>
              <TableHead className="text-center">Projetos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.map((member: membroType) => (
              <TableRow key={member.id}>
                <TableCell>{member.nome}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.cor_favorita || '-'}</TableCell>
                <TableCell>{formatDateBr(member.data_aniversario)}</TableCell>
                <TableCell className="text-center">
                  {member.projetos?.length ?? 0}
                </TableCell>
                <TableCell className="text-right">
                  <MemberActions member={member} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!response.length && (
            <TableCaption>Nenhum membro encontrado.</TableCaption>
          )}
        </Table>
      </DashboardContainer>
    </>
  )
}
