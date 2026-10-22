<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membro extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'cor_favorita',
        'data_aniversario',
        'image',
    ];

    protected $hidden = [
        'senha',
    ];

    protected function casts(): array
    {
        return [
            'senha' => 'hashed',
            'data_aniversario' => 'date',
        ];
    }
}
