<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use App\Http\Requests\StoreProjetoRequest;
use App\Http\Requests\UpdateProjetoRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class ProjetoController extends Controller
{
    protected Projeto $projeto;

    public function __construct(Projeto $projeto)
    {
        $this->projeto = $projeto;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $projetos = Projeto::query()->with('membros')->get();

        return response()->json($projetos, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjetoRequest $request) : JsonResponse
    {
        $projeto = Projeto::create($request->validated());
        return response()->json($projeto, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id): JsonResponse
    {
        $projeto = Projeto::query()
            ->with(['membros', 'tarefas.membro:id,nome,email'])
            ->findOrFail($id);

        return response()->json($projeto, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjetoRequest $request, String $id): JsonResponse
    {
        $projeto = Projeto::findOrFail($id);
        $projeto->update($request->validated());
        return response()->json($projeto, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id): JsonResponse
    {
        $projeto = Projeto::findOrFail($id);
        $projeto->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
