<?php

namespace App\Http\Requests;

use App\Models\Tarefa;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateTarefaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tarefa = Tarefa::query()->find($this->route('tarefa'));

        $projetoId = $this->input('projeto_id', $tarefa?->projeto_id);
        $membroId = $this->input('membro_id', $tarefa?->membro_id);

        return [
            'projeto_id' => ['sometimes', 'required', 'uuid', 'exists:projetos,id'],
            'membro_id' => ['sometimes', 'required', 'uuid', 'exists:membros,id'],
            'titulo' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('tarefas', 'titulo')
                    ->where('projeto_id', $projetoId)
                    ->where('membro_id', $membroId)
                    ->ignore($this->route('tarefa')),
            ],
            'descricao' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', 'string', Rule::in(Tarefa::STATUSES)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $tarefa = Tarefa::query()->find($this->route('tarefa'));
            if (! $tarefa) {
                return;
            }

            $projetoId = $this->input('projeto_id', $tarefa->projeto_id);
            $membroId = $this->input('membro_id', $tarefa->membro_id);
            $titulo = $this->input('titulo', $tarefa->titulo);

            $duplicada = Tarefa::query()
                ->where('projeto_id', $projetoId)
                ->where('membro_id', $membroId)
                ->where('titulo', $titulo)
                ->where('id', '!=', $tarefa->id)
                ->exists();

            if ($duplicada) {
                $validator->errors()->add(
                    'titulo',
                    'Este membro já possui uma tarefa com este título neste projeto.'
                );
            }
        });
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
            'titulo.unique' => 'Este membro já possui uma tarefa com este título neste projeto.',
        ];
    }
}
