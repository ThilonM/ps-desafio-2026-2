import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { Skeleton } from '@/components/skeleton'

export function SkeletonTarefas() {
  return (
    <DashboardContainer className="space-y-3">
      <Skeleton className="h-9 w-36" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </DashboardContainer>
  )
}
