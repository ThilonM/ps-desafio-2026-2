import { formatDateBr } from '@/services/formatter'
import { membroProjetoType } from '@/types/member'

interface MemberProjetosProps {
  projetos?: membroProjetoType[]
}

export function MemberProjetos({ projetos = [] }: MemberProjetosProps) {
  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div>
        <p className="text-sm font-medium">Projetos do membro</p>
        <p className="text-xs text-muted-foreground">
          Todos os projetos em que este membro está alocado.
        </p>
      </div>

      {!projetos.length && (
        <p className="text-sm text-muted-foreground">
          Este membro ainda não está em nenhum projeto.
        </p>
      )}

      <ul className="space-y-3">
        {projetos.map((projeto) => (
          <li
            key={projeto.id}
            className="space-y-1 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <p className="text-sm font-medium leading-tight">{projeto.nome}</p>
            <p className="text-xs text-muted-foreground">
              Cliente: {projeto.nome_cliente}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateBr(projeto.data_inicio)} —{' '}
              {formatDateBr(projeto.data_fim)}
            </p>
            {projeto.descricao && (
              <p className="text-sm text-muted-foreground">
                {projeto.descricao}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
