<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidaDatasProjetoNaoFeriado;
use App\Models\Projeto;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjetoRequest extends FormRequest
{
    use ValidaDatasProjetoNaoFeriado;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:255'],
            'nome_cliente' => ['sometimes', 'required', 'string', 'max:255'],
            'descricao' => ['sometimes', 'required', 'string'],
            'data_inicio' => ['sometimes', 'required', 'date'],
            'data_fim' => ['sometimes', 'required', 'date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $projeto = Projeto::query()->find($this->route('projeto'));

            $inicio = $this->input(
                'data_inicio',
                $projeto?->data_inicio?->format('Y-m-d')
            );
            $fim = $this->input(
                'data_fim',
                $projeto?->data_fim?->format('Y-m-d')
            );

            if ($inicio && $fim && $fim < $inicio) {
                $validator->errors()->add(
                    'data_fim',
                    'A data de término deve ser igual ou posterior à data de início.'
                );

                return;
            }

            $this->validarDatasProjetoNaoFeriado($validator);
        });
    }

    public function attributes(): array
    {
        return [
            'nome' => 'nome',
            'nome_cliente' => 'nome do cliente',
            'descricao' => 'descrição',
            'data_inicio' => 'data de início',
            'data_fim' => 'data de término',
        ];
    }

    public function messages(): array
    {
        return [
            'data_inicio.date' => 'Informe uma data de início válida.',
            'data_fim.date' => 'Informe uma data de término válida.',
        ];
    }
}
