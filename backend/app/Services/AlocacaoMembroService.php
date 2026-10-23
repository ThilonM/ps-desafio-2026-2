<?php

namespace App\Services;

use App\Models\Membro;
use App\Models\Projeto;
use Illuminate\Validation\ValidationException;

class AlocacaoMembroService
{
    public const LIMITE_PROJETOS_ATIVOS = 2;

    public function projetoEstaAtivo(Projeto $projeto, ?string $hoje = null): bool
    {
        $hoje = $hoje ?? now()->toDateString();

        return $projeto->data_inicio->toDateString() <= $hoje
            && $projeto->data_fim->toDateString() >= $hoje;
    }

    public function contarProjetosAtivos(Membro $membro, ?string $excetoProjetoId = null): int
    {
        $hoje = now()->toDateString();

        return $membro->projetos()
            ->whereDate('data_inicio', '<=', $hoje)
            ->whereDate('data_fim', '>=', $hoje)
            ->when($excetoProjetoId, fn ($q) => $q->where('projetos.id', '!=', $excetoProjetoId))
            ->count();
    }

    /**
     * Garante que o membro pode ser alocado no projeto (máx. 2 ativos no mesmo intervalo).
     * Se já estiver no projeto, não conta de novo.
     * Projetos fora do intervalo atual (ainda não iniciados ou já encerrados) não entram no limite.
     *
     * @throws ValidationException
     */
    public function garantirPodeAlocar(Membro $membro, Projeto $projeto): void
    {
        if ($membro->projetos()->where('projetos.id', $projeto->id)->exists()) {
            return;
        }

        if (! $this->projetoEstaAtivo($projeto)) {
            return;
        }

        $ativos = $this->contarProjetosAtivos($membro);

        if ($ativos >= self::LIMITE_PROJETOS_ATIVOS) {
            throw ValidationException::withMessages([
                'membro_id' => 'Este membro já está alocado em 2 projetos ativos no mesmo intervalo. Remova-o de outro projeto antes de alocar.',
            ]);
        }
    }

    /**
     * Aloca o membro no projeto (attach) após validar a trava.
     */
    public function alocar(Membro $membro, Projeto $projeto): void
    {
        $this->garantirPodeAlocar($membro, $projeto);

        if (! $membro->projetos()->where('projetos.id', $projeto->id)->exists()) {
            $projeto->membros()->attach($membro->id);
        }
    }
}
