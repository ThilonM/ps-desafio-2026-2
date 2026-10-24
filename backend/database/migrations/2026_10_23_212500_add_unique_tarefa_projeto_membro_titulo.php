<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Mantém a tarefa mais antiga e remove duplicatas (mesmo projeto + membro + título).
        $duplicatas = DB::table('tarefas')
            ->select('projeto_id', 'membro_id', 'titulo', DB::raw('MIN(created_at) as primeiro'))
            ->groupBy('projeto_id', 'membro_id', 'titulo')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicatas as $grupo) {
            $manterId = DB::table('tarefas')
                ->where('projeto_id', $grupo->projeto_id)
                ->where('membro_id', $grupo->membro_id)
                ->where('titulo', $grupo->titulo)
                ->orderBy('created_at')
                ->orderBy('id')
                ->value('id');

            DB::table('tarefas')
                ->where('projeto_id', $grupo->projeto_id)
                ->where('membro_id', $grupo->membro_id)
                ->where('titulo', $grupo->titulo)
                ->where('id', '!=', $manterId)
                ->delete();
        }

        Schema::table('tarefas', function (Blueprint $table) {
            $table->unique(
                ['projeto_id', 'membro_id', 'titulo'],
                'tarefas_projeto_membro_titulo_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('tarefas', function (Blueprint $table) {
            $table->dropUnique('tarefas_projeto_membro_titulo_unique');
        });
    }
};
