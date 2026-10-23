import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
  DashboardMain,
} from '@/components/dashboard/dashboard-items'
import { LuListChecks } from 'react-icons/lu'
import { Suspense } from 'react'
import ListTarefas from './_components/list-tarefa'
import { SkeletonTarefas } from './_components/skeleton-tarefas'

export default async function Page() {
  return (
    <>
      <DashboardHeader>
        <DashboardHeaderTitle>
          <LuListChecks />
          Tarefas
        </DashboardHeaderTitle>
        <DashboardHeaderDescription>
          Cadastre tarefas vinculadas a projetos e atribuídas a membros.
        </DashboardHeaderDescription>
      </DashboardHeader>
      <DashboardMain>
        <Suspense fallback={<SkeletonTarefas />}>
          <ListTarefas />
        </Suspense>
      </DashboardMain>
    </>
  )
}
