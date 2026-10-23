<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membro_projeto', function (Blueprint $table) {
            $table->foreignUuid('membro_id')->constrained('membros')->cascadeOnDelete();
            $table->foreignUuid('projeto_id')->constrained('projetos')->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['membro_id', 'projeto_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membro_projeto');
    }
};
