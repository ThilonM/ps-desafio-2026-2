<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMembroRequest;
use App\Http\Requests\UpdateMembroRequest;
use App\Models\Membro;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class MembroController extends Controller
{
    protected Membro $membro;

    public function __construct(Membro $membro)
    {
        $this->membro = $membro;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $membros = $this->membro->newQuery()
            ->with(['projetos' => fn ($q) => $q->orderBy('nome')])
            ->orderBy('nome')
            ->get();

        return response()->json($membros, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMembroRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('Membro', 'public');
            $validatedData['image'] = url('storage/'.$path);
        }

        $membro = $this->membro->create($validatedData);

        return response()->json($membro, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $membro = $this->membro->newQuery()
            ->with(['projetos' => fn ($q) => $q->orderBy('nome')])
            ->findOrFail($id);

        return response()->json($membro, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMembroRequest $request, string $id): JsonResponse
    {
        $validatedData = $request->validated();
        $membro = $this->membro->findOrFail($id);

        // Senha em branco no edit = manter a atual
        if (array_key_exists('senha', $validatedData) && blank($validatedData['senha'])) {
            unset($validatedData['senha']);
        }

        if ($request->hasFile('image')) {
            if ($membro->image) {
                $imagePath = str_replace(url('storage/').'/', '', $membro->image);
                Storage::disk('public')->delete($imagePath);
            }

            $path = $request->file('image')->store('Membro', 'public');
            $validatedData['image'] = url('storage/'.$path);
        }

        $membro->update($validatedData);

        return response()->json($membro, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $membro = $this->membro->findOrFail($id);

        if ($membro->image) {
            $imagePath = str_replace(url('storage/').'/', '', $membro->image);
            Storage::disk('public')->delete($imagePath);
        }

        $membro->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
