<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTarefaRequest;
use App\Http\Requests\UpdateTarefaRequest;
use App\Models\Membro;
use App\Models\Projeto;
use App\Models\Tarefa;
use App\Services\AlocacaoMembroService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class TarefaController extends Controller
{
    public function __construct(
        protected AlocacaoMembroService $alocacao,
    ) {
    }

    public function index(): JsonResponse
    {
        $statusOrdem = [
            Tarefa::STATUS_PENDENTE => 0,
            Tarefa::STATUS_EM_ANDAMENTO => 1,
            Tarefa::STATUS_CONCLUIDA => 2,
        ];

        $tarefas = Tarefa::query()
            ->with(['projeto:id,nome', 'membro:id,nome,email'])
            ->get()
            ->sort(function (Tarefa $a, Tarefa $b) use ($statusOrdem) {
                // 0) Concluídas sempre no final
                $aConcluida = $a->status === Tarefa::STATUS_CONCLUIDA ? 1 : 0;
                $bConcluida = $b->status === Tarefa::STATUS_CONCLUIDA ? 1 : 0;
                if ($aConcluida !== $bConcluida) {
                    return $aConcluida <=> $bConcluida;
                }

                // 1) Projeto (A–Z)
                $cmpProjeto = strcasecmp(
                    (string) ($a->projeto?->nome ?? ''),
                    (string) ($b->projeto?->nome ?? ''),
                );
                if ($cmpProjeto !== 0) {
                    return $cmpProjeto;
                }

                // 2) Título (A–Z)
                $cmpTitulo = strcasecmp((string) $a->titulo, (string) $b->titulo);
                if ($cmpTitulo !== 0) {
                    return $cmpTitulo;
                }

                // 3) Situação: Pendente → Em andamento → Concluída
                $cmpStatus = ($statusOrdem[$a->status] ?? 99)
                    <=> ($statusOrdem[$b->status] ?? 99);
                if ($cmpStatus !== 0) {
                    return $cmpStatus;
                }

                // 4) Membro (A–Z)
                return strcasecmp(
                    (string) ($a->membro?->nome ?? ''),
                    (string) ($b->membro?->nome ?? ''),
                );
            })
            ->values();

        return response()->json($tarefas, Response::HTTP_OK);
    }

    public function store(StoreTarefaRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? Tarefa::STATUS_PENDENTE;

        $projeto = Projeto::query()->findOrFail($data['projeto_id']);
        $membro = Membro::query()->findOrFail($data['membro_id']);

        $this->alocacao->alocar($membro, $projeto);

        $tarefa = Tarefa::query()->create($data);
        $tarefa->load(['projeto:id,nome', 'membro:id,nome,email']);

        return response()->json($tarefa, Response::HTTP_CREATED);
    }

    public function show(string $id): JsonResponse
    {
        $tarefa = Tarefa::query()
            ->with(['projeto:id,nome', 'membro:id,nome,email'])
            ->findOrFail($id);

        return response()->json($tarefa, Response::HTTP_OK);
    }

    public function update(UpdateTarefaRequest $request, string $id): JsonResponse
    {
        $tarefa = Tarefa::query()->findOrFail($id);
        $data = $request->validated();

        $projetoId = $data['projeto_id'] ?? $tarefa->projeto_id;
        $membroId = $data['membro_id'] ?? $tarefa->membro_id;

        if (
            isset($data['projeto_id']) || isset($data['membro_id'])
        ) {
            $projeto = Projeto::query()->findOrFail($projetoId);
            $membro = Membro::query()->findOrFail($membroId);
            $this->alocacao->alocar($membro, $projeto);
        }

        $tarefa->update($data);
        $tarefa->load(['projeto:id,nome', 'membro:id,nome,email']);

        return response()->json($tarefa, Response::HTTP_OK);
    }

    public function destroy(string $id): JsonResponse
    {
        $tarefa = Tarefa::query()->findOrFail($id);
        $tarefa->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
