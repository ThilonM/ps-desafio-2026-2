<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjetoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'nome_cliente' => ['required', 'string', 'max:255'],
            'descricao' => ['required', 'string'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['required', 'date', 'after_or_equal:data_inicio'],
        ];
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
            'data_fim.after_or_equal' => 'A data de término deve ser igual ou posterior à data de início.',
        ];
    }
}
