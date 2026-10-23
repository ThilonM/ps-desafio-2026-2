<?php

namespace App\Http\Requests;

use App\Models\Tarefa;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTarefaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'projeto_id' => ['required', 'uuid', 'exists:projetos,id'],
            'membro_id' => ['required', 'uuid', 'exists:membros,id'],
            'titulo' => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', Rule::in(Tarefa::STATUSES)],
        ];
    }

    public function attributes(): array
    {
        return [
            'projeto_id' => 'projeto',
            'membro_id' => 'membro',
            'titulo' => 'título',
            'descricao' => 'descrição',
            'status' => 'situação',
        ];
    }

    public function messages(): array
    {
        return [
            'membro_id.required' => 'A tarefa deve ser atribuída a um membro.',
            'projeto_id.required' => 'A tarefa deve estar vinculada a um projeto.',
            'status.in' => 'Informe uma situação válida para a tarefa.',
        ];
    }
}
