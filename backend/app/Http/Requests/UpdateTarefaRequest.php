<?php

namespace App\Http\Requests;

use App\Models\Tarefa;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTarefaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'projeto_id' => ['sometimes', 'required', 'uuid', 'exists:projetos,id'],
            'membro_id' => ['sometimes', 'required', 'uuid', 'exists:membros,id'],
            'titulo' => ['sometimes', 'required', 'string', 'max:255'],
            'descricao' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', 'string', Rule::in(Tarefa::STATUSES)],
        ];
    }

    public function attributes(): array
    {
        return [
            'projeto_id' => 'projeto',
            'membro_id' => 'membro',
            'titulo' => 'título',
            'descricao' => 'descrição',
            'status' => 'status',
        ];
    }
}
