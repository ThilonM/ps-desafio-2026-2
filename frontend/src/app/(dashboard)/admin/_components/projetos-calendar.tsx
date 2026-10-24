'use client'

import { useEffect, useMemo, useState } from 'react'
import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { Label } from '@/components/label'
import { NativeSelect } from '@/components/native-select'
import { membroType } from '@/types/member'
import { projetoType } from '@/types/projeto'
import { addDays, parseISO } from 'date-fns'
import type { EventInput } from '@fullcalendar/core'
import type { ComponentType } from 'react'

interface ProjetosCalendarProps {
  projects: projetoType[]
  members: membroType[]
}

type FullCalendarComponent = ComponentType<Record<string, unknown>>

function toExclusiveEndDate(dataFim: string): string {
  // FullCalendar trata `end` de eventos all-day como exclusivo
  return addDays(parseISO(dataFim), 1).toISOString().slice(0, 10)
}

function mapProjectsToEvents(projects: projetoType[]): EventInput[] {
  return projects
    .filter((project) => project.data_inicio && project.data_fim)
    .map((project) => ({
      id: project.id,
      title: project.nome,
      start: project.data_inicio.slice(0, 10),
      end: toExclusiveEndDate(project.data_fim.slice(0, 10)),
      allDay: true,
      extendedProps: {
        cliente: project.nome_cliente,
        descricao: project.descricao,
        dataInicio: project.data_inicio.slice(0, 10),
        dataFim: project.data_fim.slice(0, 10),
      },
    }))
}

export function ProjetosCalendar({
  projects,
  members,
}: ProjetosCalendarProps) {
  const [memberId, setMemberId] = useState('')
  const [FullCalendar, setFullCalendar] = useState<FullCalendarComponent | null>(
    null,
  )
  const [plugins, setPlugins] = useState<unknown[] | null>(null)
  const [locale, setLocale] = useState<unknown>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCalendar() {
      const [reactMod, dayGridMod, listMod, localeMod] = await Promise.all([
        import('@fullcalendar/react'),
        import('@fullcalendar/daygrid'),
        import('@fullcalendar/list'),
        import('@fullcalendar/core/locales/pt-br'),
      ])

      if (cancelled) return

      setFullCalendar(() => reactMod.default as FullCalendarComponent)
      setPlugins([dayGridMod.default, listMod.default])
      setLocale(localeMod.default)
    }

    loadCalendar()

    return () => {
      cancelled = true
    }
  }, [])

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [members],
  )

  const filteredProjects = useMemo(() => {
    if (!memberId) return projects

    return projects.filter((project) =>
      project.membros?.some((membro) => membro.id === memberId),
    )
  }, [projects, memberId])

  const events = mapProjectsToEvents(filteredProjects)
  const ready = FullCalendar && plugins && locale
  const selectedMember = sortedMembers.find((m) => m.id === memberId)

  return (
    <DashboardContainer className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Calendário de projetos
          </h2>
          <p className="text-sm text-muted-foreground">
            Período de cada projeto, da data de início até a data de término.
            {memberId ? (
              <>
                {' '}
                Exibindo {filteredProjects.length} projeto
                {filteredProjects.length === 1 ? '' : 's'} de{' '}
                {selectedMember?.nome ?? 'membro selecionado'}.
              </>
            ) : null}
          </p>
        </div>

        <div className="w-full space-y-1.5 sm:max-w-xs">
          <Label htmlFor="filtro-membro-calendario">Filtrar por membro</Label>
          <NativeSelect
            id="filtro-membro-calendario"
            className="w-full"
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
          >
            <option value="">Todos os membros</option>
            {sortedMembers.map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="projetos-calendar min-h-[560px]">
        {!ready ? (
          <div className="flex min-h-[560px] items-center justify-center rounded border border-dashed text-sm text-muted-foreground">
            Carregando calendário...
          </div>
        ) : (
          <FullCalendar
            plugins={plugins}
            initialView="dayGridMonth"
            locale={locale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,listMonth',
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              list: 'Lista',
            }}
            height="auto"
            events={events}
            displayEventTime={false}
            eventDisplay="block"
            dayMaxEvents={3}
            noEventsContent={
              memberId
                ? 'Nenhum projeto alocado a este membro neste período'
                : 'Nenhum projeto neste período'
            }
            eventDidMount={(info: {
              event: {
                title: string
                extendedProps: {
                  cliente?: string
                  dataInicio?: string
                  dataFim?: string
                }
              }
              el: HTMLElement
            }) => {
              const { cliente, dataInicio, dataFim } = info.event.extendedProps
              info.el.title = `${info.event.title}${cliente ? ` — ${cliente}` : ''}\n${dataInicio} → ${dataFim}`
            }}
          />
        )}
      </div>
    </DashboardContainer>
  )
}
