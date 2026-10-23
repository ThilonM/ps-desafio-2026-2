<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarefas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('projeto_id')->constrained('projetos')->cascadeOnDelete();
            $table->foreignUuid('membro_id')->constrained('membros')->cascadeOnDelete();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->string('status')->default('pendente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarefas');
    }
};
