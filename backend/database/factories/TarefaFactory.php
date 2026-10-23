<?php

namespace Database\Factories;

use App\Models\Membro;
use App\Models\Projeto;
use App\Models\Tarefa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tarefa>
 */
class TarefaFactory extends Factory
{
    protected $model = Tarefa::class;

    public function definition(): array
    {
        return [
            'projeto_id' => Projeto::factory(),
            'membro_id' => Membro::factory(),
            'titulo' => fake()->sentence(4),
            'descricao' => fake()->optional()->paragraph(),
            'status' => fake()->randomElement(Tarefa::STATUSES),
        ];
    }
}
