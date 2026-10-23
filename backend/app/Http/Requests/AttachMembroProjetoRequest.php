<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttachMembroProjetoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'membro_id' => ['required', 'uuid', 'exists:membros,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'membro_id' => 'membro',
        ];
    }

    public function messages(): array
    {
        return [
            'membro_id.required' => 'Selecione um membro para alocar no projeto.',
        ];
    }
}
