<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Docs — PS Desafio 2026.2</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
    <style>
        body { margin: 0; background: #fafafa; }
        .topbar { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        window.ui = SwaggerUIBundle({
            url: @json(url('/docs/openapi.yaml')),
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis],
            layout: 'BaseLayout',
        });
    </script>
</body>
</html>
