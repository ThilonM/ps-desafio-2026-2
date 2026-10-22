<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Membro>
 */
class MembroFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'senha' => 'Password1!',
            'cor_favorita' => fake()->colorName(),
            'data_aniversario' => fake()->date(),
            'image' => 'https://picsum.photos/seed/'.fake()->unique()->uuid().'/400/400',
        ];
    }
}
