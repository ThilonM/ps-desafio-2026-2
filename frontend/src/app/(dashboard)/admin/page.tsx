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

export default async function Page() {
  const [{ response: members }, { response: projects }] = await Promise.all([
    api<membroType[]>('GET', '/membros'),
    api<projetoType[]>('GET', '/projetos'),
  ])

  return (
    <>
      <DashboardHeader>
        <DashboardHeaderTitle>
          <LuHome />
          Sistema de Gestão de Projetos MEJ
        </DashboardHeaderTitle>
        <DashboardHeaderDescription>
          Tela principal da aplicação.
        </DashboardHeaderDescription>
      </DashboardHeader>
      <DashboardMain>
        <DashboardSummaryCards
          membersCount={members?.length ?? 0}
          projectsCount={projects?.length ?? 0}
        />
      </DashboardMain>
    </>
  )
}
