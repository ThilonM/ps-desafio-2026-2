<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachMembroProjetoRequest;
use App\Models\Membro;
use App\Models\Projeto;
use App\Services\AlocacaoMembroService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ProjetoMembroController extends Controller
{
    public function __construct(
        protected AlocacaoMembroService $alocacao,
    ) {}

    public function index(string $projetoId): JsonResponse
    {
        $projeto = Projeto::query()->findOrFail($projetoId);
        $membros = $projeto->membros()->orderBy('nome')->get();

        return response()->json($membros, Response::HTTP_OK);
    }

    public function store(AttachMembroProjetoRequest $request, string $projetoId): JsonResponse
    {
        $projeto = Projeto::query()->findOrFail($projetoId);
        $membro = Membro::query()->findOrFail($request->validated('membro_id'));

        $this->alocacao->alocar($membro, $projeto);

        $projeto->load('membros');

        return response()->json($projeto->membros, Response::HTTP_CREATED);
    }

    public function destroy(string $projetoId, string $membroId): JsonResponse
    {
        $projeto = Projeto::query()->findOrFail($projetoId);
        $projeto->membros()->detach($membroId);

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
