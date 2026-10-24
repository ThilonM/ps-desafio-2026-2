import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
  DashboardMain,
} from '@/components/dashboard/dashboard-items'
import { api } from '@/services/api'
import {
  fetchFeriadosNacionais,
  proximosFeriados,
} from '@/services/brasil-api'
import { membroType } from '@/types/member'
import { projetoType } from '@/types/projeto'
import { LuHome } from 'react-icons/lu'
import { DashboardSummaryCards } from './_components/dashboard-summary-cards'
import { FeriadosCard } from './_components/feriados-card'

export default async function Page() {
  const [{ response: members }, { response: projects }, feriadosAno] =
    await Promise.all([
      api<membroType[]>('GET', '/membros'),
      api<projetoType[]>('GET', '/projetos'),
      fetchFeriadosNacionais(new Date().getFullYear()),
    ])

  const feriados = proximosFeriados(feriadosAno, 5)

  return (
    <>
      <DashboardHeader>
        <DashboardHeaderTitle>
          <LuHome />
          Sistema de Gestão de Projetos MEJ
        </DashboardHeaderTitle>
        <DashboardHeaderDescription>
          Visão geral de membros, projetos e feriados nacionais.
        </DashboardHeaderDescription>
      </DashboardHeader>
      <DashboardMain>
        <div className="grid gap-4 md:grid-cols-2">
          <DashboardSummaryCards
            membersCount={members?.length ?? 0}
            projectsCount={projects?.length ?? 0}
          />
          <FeriadosCard feriados={feriados} />
        </div>
      </DashboardMain>
    </>
  )
}
