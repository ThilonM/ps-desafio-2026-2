export type tarefaStatus = 'pendente' | 'em_andamento' | 'concluida'

export type tarefaType = {
  id: string
  projeto_id: string
  membro_id: string
  titulo: string
  descricao?: string | null
  status: tarefaStatus
  created_at?: string
  updated_at?: string
  projeto?: {
    id: string
    nome: string
  }
  membro?: {
    id: string
    nome: string
    email?: string
  }
}

export const TAREFA_STATUS_LABELS: Record<tarefaStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}
