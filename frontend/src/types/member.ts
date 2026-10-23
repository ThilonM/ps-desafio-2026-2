export type membroProjetoType = {
  id: string
  nome: string
  nome_cliente: string
  descricao: string
  data_inicio: string
  data_fim: string
}

export type membroType = {
  id: string
  nome: string
  email: string
  senha?: string
  cor_favorita?: string
  data_aniversario?: string
  image?: string
  created_at?: Date
  updated_at?: Date
  projetos?: membroProjetoType[]
}
