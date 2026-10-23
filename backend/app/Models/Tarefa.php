<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarefa extends Model
{
    use HasFactory, HasUuids;

    public const STATUS_PENDENTE = 'pendente';

    public const STATUS_EM_ANDAMENTO = 'em_andamento';

    public const STATUS_CONCLUIDA = 'concluida';

    public const STATUSES = [
        self::STATUS_PENDENTE,
        self::STATUS_EM_ANDAMENTO,
        self::STATUS_CONCLUIDA,
    ];

    protected $fillable = [
        'projeto_id',
        'membro_id',
        'titulo',
        'descricao',
        'status',
    ];

    public function projeto(): BelongsTo
    {
        return $this->belongsTo(Projeto::class);
    }

    public function membro(): BelongsTo
    {
        return $this->belongsTo(Membro::class);
    }
}
