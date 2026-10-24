<?php

namespace App\Http\Requests\Concerns;

use App\Services\BrasilApiFeriadosService;
use Illuminate\Validation\Validator;

trait ValidaDatasProjetoNaoFeriado
{
    protected function validarDatasProjetoNaoFeriado(Validator $validator): void
    {
        foreach (['data_inicio', 'data_fim'] as $campo) {
            $this->validarCampoDataNaoFeriado($validator, $campo);
        }
    }

    protected function validarCampoDataNaoFeriado(Validator $validator, string $campo): void
    {
        $data = $this->input($campo);

        if (! is_string($data) || $data === '') {
            return;
        }

        $iso = substr($data, 0, 10);
        $feriados = app(BrasilApiFeriadosService::class);
        $nome = $feriados->nomeFeriado($iso);

        if ($nome === false) {
            $validator->errors()->add(
                $campo,
                'Não foi possível consultar os feriados nacionais agora. Tente novamente em instantes.'
            );

            return;
        }

        if (is_string($nome)) {
            $validator->errors()->add(
                $campo,
                "Não é permitido cadastrar projeto com {$this->attributeLabel($campo)} em feriado nacional ({$nome})."
            );
        }
    }

    private function attributeLabel(string $campo): string
    {
        return match ($campo) {
            'data_inicio' => 'data de início',
            'data_fim' => 'data de término',
            default => $campo,
        };
    }
}
