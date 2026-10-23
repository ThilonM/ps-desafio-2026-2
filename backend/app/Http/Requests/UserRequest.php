<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $postRules = [];
        $putRules = [];

        $rules = [
            'name' => ['string', 'min:3', 'max:255'],
            'email' => ['email', Rule::unique('users')->ignore($this->user)],
            'password' => [
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'image' => ['image', 'mimes:jpeg,png,jpg,webp'],
        ];

        if ($this->isMethod('post')) {
            $postRules = [
                'name' => ['required'],
                'email' => ['required'],
                'password' => ['required', 'confirmed'],
                'permissions' => ['array'],
                'permissions.*' => ['string', 'exists:permissions,name', 'distinct'],
            ];
        }

        if ($this->isMethod('put')) {
            $putRules = [
                'name' => ['sometimes'],
                'email' => ['sometimes'],
                'password' => ['sometimes'],
                'image' => ['sometimes'],
            ];
        }

        return array_merge_recursive($rules, $postRules, $putRules);
    }

    public function messages()
    {
        return [
            'name.min' => 'O campo NOME deve conter no mínimo 3 caracteres.',
            'name.max' => 'O campo NOME no máximo 255 caracteres.',
            'name.required' => 'O campo NOME é obrigatório.',
            'name.string' => 'O campo NOME deve ser um texto.',
            'email.required' => 'O campo E-MAIL é obrigatório.',
            'email.email' => 'O campo E-MAIL deve ser um e-mail válido.',
            'email.unique' => 'O campo E-MAIL deve pertencer a apenas 1 usuário.',
            'password.required' => 'O campo SENHA é obrigatório.',
            'password.numbers' => 'O campo SENHA deve conter pelo menos um número.',
            'image.required' => 'O campo IMAGEM é obrigatório.',
            'image.mimes' => 'O campo IMAGEM deve conter apenas jpeg, png, jpg e webp.',
            'image.image' => 'O campo IMAGEM deve conter apenas imagens.',
            'permissions.*.string' => 'As PERMISSÕES precisam ser textos.',
            'permissions.*.exists' => 'PERMISSÃO não existente.',
        ];
    }
}
