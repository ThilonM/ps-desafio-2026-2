<?php

use Illuminate\Support\Facades\Route;

Route::get('/docs/api', function () {
    return view('swagger');
});

Route::get('/docs/openapi.yaml', function () {
    $path = base_path('openapi.yaml');

    abort_unless(is_file($path), 404);

    return response()->file($path, [
        'Content-Type' => 'application/yaml',
    ]);
});
