<?php

namespace Database\Seeders;

use App\Models\Membro;
use App\Models\Projeto;
use App\Models\Tarefa;
use App\Services\AlocacaoMembroService;
use Illuminate\Database\Seeder;

class TarefaSeeder extends Seeder
{
    public function run(): void
    {
        $alocacao = app(AlocacaoMembroService::class);
        $projetos = Projeto::query()->take(5)->get();
        $membros = Membro::query()->take(10)->get();

        if ($projetos->isEmpty() || $membros->isEmpty()) {
            return;
        }

        foreach ($projetos as $projeto) {
            $escolhidos = $membros->random(min(2, $membros->count()));

            foreach ($escolhidos as $membro) {
                try {
                    $alocacao->alocar($membro, $projeto);
                } catch (\Throwable) {
                    continue;
                }

                Tarefa::factory()->create([
                    'projeto_id' => $projeto->id,
                    'membro_id' => $membro->id,
                    'status' => Tarefa::STATUS_PENDENTE,
                ]);
            }
        }
    }
}
