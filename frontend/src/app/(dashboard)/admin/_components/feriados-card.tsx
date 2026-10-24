import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { formatDateBr } from '@/services/formatter'
import type { feriadoNacionalType } from '@/types/feriado'

interface FeriadosCardProps {
  feriados: feriadoNacionalType[]
}

export function FeriadosCard({ feriados }: FeriadosCardProps) {
  return (
    <DashboardContainer className="space-y-3 md:col-span-2">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Próximos feriados nacionais
        </p>
        <p className="text-xs text-muted-foreground">
          Dados da BrasilAPI (integração externa — diferencial Missão 3).
        </p>
      </div>
      {!feriados.length ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar feriados agora.
        </p>
      ) : (
        <ul className="space-y-2">
          {feriados.map((feriado) => (
            <li
              key={feriado.date}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
            >
              <span className="text-sm font-medium">{feriado.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDateBr(feriado.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardContainer>
  )
}
