<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BrasilApiFeriadosService
{
    /**
     * Retorna o nome do feriado nacional se a data for feriado; null caso contrário.
     * Em falha de consulta à BrasilAPI, retorna false (indisponível).
     *
     * @return string|null|false
     */
    public function nomeFeriado(string $dataIso): string|null|false
    {
        if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $dataIso)) {
            return null;
        }

        $ano = (int) substr($dataIso, 0, 4);
        $feriados = $this->feriadosDoAno($ano);

        if ($feriados === false) {
            return false;
        }

        return $feriados[$dataIso] ?? null;
    }

    /**
     * Mapa data ISO => nome do feriado. false se a API falhou.
     *
     * @return array<string, string>|false
     */
    public function feriadosDoAno(int $ano): array|false
    {
        $cacheKey = "brasilapi.feriados.{$ano}";

        if (Cache::has($cacheKey)) {
            /** @var array<string, string> $cached */
            $cached = Cache::get($cacheKey);

            return $cached;
        }

        try {
            $response = Http::timeout(8)
                ->acceptJson()
                ->get("https://brasilapi.com.br/api/feriados/v1/{$ano}");

            if (! $response->successful()) {
                Log::warning('BrasilAPI feriados: HTTP '.$response->status(), ['ano' => $ano]);

                return false;
            }

            $mapa = [];
            foreach ($response->json() as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $date = $item['date'] ?? null;
                $name = $item['name'] ?? null;
                if (is_string($date) && is_string($name)) {
                    $mapa[$date] = $name;
                }
            }

            Cache::put($cacheKey, $mapa, now()->addDay());

            return $mapa;
        } catch (\Throwable $e) {
            Log::warning('BrasilAPI feriados: '.$e->getMessage(), ['ano' => $ano]);

            return false;
        }
    }
}
