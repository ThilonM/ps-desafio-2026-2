<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateMembroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('membros', 'email')->ignore(
                    $this->route('membro') ?? $this->input('id'),
                    'id'
                ),
            ],
            'senha' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'cor_favorita' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data_aniversario' => ['sometimes', 'nullable', 'date'],
            'image' => ['sometimes', 'image', 'mimes:jpeg,png,jpg,webp'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nome' => 'nome',
            'email' => 'e-mail',
            'senha' => 'senha',
            'cor_favorita' => 'cor favorita',
            'data_aniversario' => 'data de aniversário',
            'image' => 'imagem',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Já existe um membro cadastrado com este e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'senha.min' => 'A senha deve ter no mínimo :min caracteres.',
            'senha.letters' => 'A senha deve conter pelo menos uma letra.',
            'senha.mixed' => 'A senha deve conter letras maiúsculas e minúsculas.',
            'senha.numbers' => 'A senha deve conter pelo menos um número.',
            'senha.symbols' => 'A senha deve conter pelo menos um símbolo.',
            'image.image' => 'Envie um arquivo de imagem válido.',
            'image.mimes' => 'A imagem deve ser jpeg, png, jpg ou webp.',
            'data_aniversario.date' => 'Informe uma data de aniversário válida.',
        ];
    }
}
