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
import { membroType } from '@/types/member'
import { projetoType } from '@/types/projeto'
import { TAREFA_STATUS_LABELS, tarefaType } from '@/types/tarefa'
import { LuCirclePlus, LuPen, LuTrash } from 'react-icons/lu'
import { DialogCreateTarefa } from './dialog-create-tarefa'
import { DialogUpdateTarefa } from './dialog-update-tarefa'
import { DialogTarefaDelete } from './dialog-delete-tarefa'

function TarefaActions({
  tarefa,
  projetos,
  membros,
}: {
  tarefa: tarefaType
  projetos: projetoType[]
  membros: membroType[]
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <DialogUpdateTarefa
        tarefa={tarefa}
        projetos={projetos}
        membros={membros}
      >
        <Button variant="secondary-inverse" size="icon">
          <LuPen />
        </Button>
      </DialogUpdateTarefa>
      <DialogTarefaDelete id={tarefa.id}>
        <Button variant="destructive-inverse" size="icon">
          <LuTrash />
        </Button>
      </DialogTarefaDelete>
    </div>
  )
}

export default async function ListTarefas() {
  const [
    { response: tarefas },
    { response: projetos },
    { response: membros },
  ] = await Promise.all([
    api<tarefaType[]>('GET', '/tarefas'),
    api<projetoType[]>('GET', '/projetos'),
    api<membroType[]>('GET', '/membros'),
  ])

  if (!tarefas || !projetos || !membros) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível carregar tarefas, projetos ou membros.
      </DashboardContainer>
    )
  }

  return (
    <>
      <DashboardContainer className="flex h-min justify-between space-x-0 gap-y-2.5 max-sm:flex-col">
        <DialogCreateTarefa projetos={projetos} membros={membros}>
          <Button size="sm">
            <LuCirclePlus />
            Nova tarefa
          </Button>
        </DialogCreateTarefa>
      </DashboardContainer>

      <DashboardContainer className="space-y-3 md:hidden">
        {!tarefas.length && (
          <p className="text-sm text-muted-foreground">
            Nenhuma tarefa encontrada.
          </p>
        )}
        {tarefas.map((tarefa) => (
          <article
            key={tarefa.id}
            className="space-y-3 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <p className="font-semibold leading-tight">{tarefa.titulo}</p>
              <p className="text-sm text-muted-foreground">
                Projeto: {tarefa.projeto?.nome ?? '-'}
              </p>
              <p className="text-sm text-muted-foreground">
                Membro: {tarefa.membro?.nome ?? '-'}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {TAREFA_STATUS_LABELS[tarefa.status] ?? tarefa.status}
              </p>
            </div>
            <TarefaActions
              tarefa={tarefa}
              projetos={projetos}
              membros={membros}
            />
          </article>
        ))}
      </DashboardContainer>

      <DashboardContainer className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Membro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarefas.map((tarefa) => (
              <TableRow key={tarefa.id}>
                <TableCell>{tarefa.titulo}</TableCell>
                <TableCell>{tarefa.projeto?.nome ?? '-'}</TableCell>
                <TableCell>{tarefa.membro?.nome ?? '-'}</TableCell>
                <TableCell>
                  {TAREFA_STATUS_LABELS[tarefa.status] ?? tarefa.status}
                </TableCell>
                <TableCell className="text-right">
                  <TarefaActions
                    tarefa={tarefa}
                    projetos={projetos}
                    membros={membros}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!tarefas.length && (
            <TableCaption>Nenhuma tarefa encontrada.</TableCaption>
          )}
        </Table>
      </DashboardContainer>
    </>
  )
}
