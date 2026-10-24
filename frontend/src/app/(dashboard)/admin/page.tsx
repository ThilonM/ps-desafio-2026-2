import {
  DashboardHeader,
  DashboardHeaderDescription,
  DashboardHeaderTitle,
  DashboardMain,
} from '@/components/dashboard/dashboard-items'
import { api } from '@/services/api'
import { membroType } from '@/types/member'
import { projetoType } from '@/types/projeto'
import { LuHome } from 'react-icons/lu'
import { DashboardSummaryCards } from './_components/dashboard-summary-cards'
import { ProjetosCalendar } from './_components/projetos-calendar'

export default async function Page() {
  const [{ response: members }, { response: projects }] = await Promise.all([
    api<membroType[]>('GET', '/membros'),
    api<projetoType[]>('GET', '/projetos'),
  ])

  const projectsList = projects ?? []
  const membersList = members ?? []

  return (
    <>
      <DashboardHeader>
        <DashboardHeaderTitle>
          <LuHome />
          Sistema de Gestão de Projetos MEJ
        </DashboardHeaderTitle>
        <DashboardHeaderDescription>
          Visão geral de membros e projetos.
        </DashboardHeaderDescription>
      </DashboardHeader>
      <DashboardMain>
        <div className="grid gap-4 md:grid-cols-2">
          <DashboardSummaryCards
            membersCount={membersList.length}
            projectsCount={projectsList.length}
          />
        </div>

        <ProjetosCalendar projects={projectsList} members={membersList} />
      </DashboardMain>
    </>
  )
}
