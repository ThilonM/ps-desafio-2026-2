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
import { projetoType } from '@/types/projeto'
import { LuInfo, LuPen, LuPlusCircle, LuTrash } from 'react-icons/lu'
import { DialogUpdateProjeto } from './dialog-update-project'
import { DialogProjetoDelete } from './dialog-delete-project'
import { DialogInformationProjeto } from './dialog-information-project'
import { DialogCreateProjeto } from './dialog-create-project'
import { DialogEquipeProjeto } from './dialog-equipe-projeto'

function ProjetoActions({
  projeto,
  membros,
}: {
  projeto: projetoType
  membros: membroType[]
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <DialogInformationProjeto projeto={projeto}>
        <Button variant="default-inverse" size="icon">
          <LuInfo />
        </Button>
      </DialogInformationProjeto>
      <DialogEquipeProjeto projeto={projeto} membros={membros} />
      <DialogUpdateProjeto projeto={projeto}>
        <Button variant="secondary-inverse" size="icon">
          <LuPen />
        </Button>
      </DialogUpdateProjeto>
      <DialogProjetoDelete id={projeto.id}>
        <Button variant="destructive-inverse" size="icon">
          <LuTrash />
        </Button>
      </DialogProjetoDelete>
    </div>
  )
}

export default async function ListProjects() {
  const [{ response }, { response: membros }] = await Promise.all([
    api<projetoType[]>('GET', '/projetos'),
    api<membroType[]>('GET', '/membros'),
  ])

  if (!response || !membros) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível obter os projetos.
      </DashboardContainer>
    )
  }

  return (
    <>
      <DashboardContainer className="flex h-min justify-between space-x-0 gap-y-2.5 max-sm:flex-col">
        <DialogCreateProjeto>
          <Button size="sm">
            <LuPlusCircle />
            Novo projeto
          </Button>
        </DialogCreateProjeto>
      </DashboardContainer>

      <DashboardContainer className="space-y-3 md:hidden">
        {!response.length && (
          <p className="text-sm text-muted-foreground">
            Nenhum projeto encontrado.
          </p>
        )}
        {response.map((projeto) => (
          <article
            key={projeto.id}
            className="space-y-3 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <p className="font-semibold leading-tight">{projeto.nome}</p>
              <p className="text-sm text-muted-foreground">
                Cliente: {projeto.nome_cliente}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateBr(projeto.data_inicio)} —{' '}
                {formatDateBr(projeto.data_fim)}
              </p>
              <p className="text-sm text-muted-foreground">
                Equipe: {projeto.membros?.length ?? 0} membro(s)
              </p>
            </div>
            <ProjetoActions projeto={projeto} membros={membros} />
          </article>
        ))}
      </DashboardContainer>

      <DashboardContainer className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Equipe</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.map((projeto: projetoType) => (
              <TableRow key={projeto.id}>
                <TableCell>{projeto.nome}</TableCell>
                <TableCell>{projeto.nome_cliente}</TableCell>
                <TableCell>{formatDateBr(projeto.data_inicio)}</TableCell>
                <TableCell>{formatDateBr(projeto.data_fim)}</TableCell>
                <TableCell>{projeto.membros?.length ?? 0}</TableCell>
                <TableCell className="text-right">
                  <ProjetoActions projeto={projeto} membros={membros} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!response.length && (
            <TableCaption>Nenhum projeto encontrado.</TableCaption>
          )}
        </Table>
      </DashboardContainer>
    </>
  )
}
