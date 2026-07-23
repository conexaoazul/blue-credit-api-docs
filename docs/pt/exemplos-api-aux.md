---
title: Exemplos de uso
description: Exemplos seguros em cURL, Node.js, Python e PHP.
---

# Exemplos de uso

## Listar integrações

O catálogo é público e gratuito.

::: code-group

```bash [cURL]
curl --fail-with-body --silent --show-error \
  https://api.conexaoazul.com/api/v1/credit/integrations \
  | python3 -m json.tool
```

```javascript [Node.js 18+]
const response = await fetch(
  'https://api.conexaoazul.com/api/v1/credit/integrations'
)

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`)
}

console.table(await response.json())
```

```python [Python]
import requests

response = requests.get(
    "https://api.conexaoazul.com/api/v1/credit/integrations",
    timeout=(5, 20),
)
response.raise_for_status()

for integration in response.json():
    print(integration["code"], integration["price_nivel_1"])
```

:::

## Executar consulta

::: code-group

```bash [cURL]
export BLUE_CREDIT_API_KEY='SUA_CHAVE'

curl --fail-with-body --silent --show-error \
  --request POST \
  https://api.conexaoazul.com/api/v1/credit/query \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "HTTP-API-KEY: ${BLUE_CREDIT_API_KEY}" \
  --header 'X-Request-ID: pedido-8472-tentativa-1' \
  --data '{"integration_code":"cnpj_completo","document":"11222333000181"}' \
  | python3 -m json.tool
```

```javascript [Node.js 18+]
const apiKey = process.env.BLUE_CREDIT_API_KEY
if (!apiKey) throw new Error('BLUE_CREDIT_API_KEY não configurada')

const requestId = crypto.randomUUID()
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 20_000)

try {
  const response = await fetch(
    'https://api.conexaoazul.com/api/v1/credit/query',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'HTTP-API-KEY': apiKey,
        'X-Request-ID': requestId
      },
      body: JSON.stringify({
        integration_code: 'cnpj_completo',
        document: '11222333000181'
      }),
      signal: controller.signal
    }
  )

  const responseRequestId = response.headers.get('X-Request-ID') ?? requestId
  const body = await response.json()

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} [${responseRequestId}]: ${JSON.stringify(body.detail)}`
    )
  }

  if (body.status !== 'success') {
    console.warn('Consulta sem sucesso na fonte', {
      requestId: responseRequestId,
      error: body.error,
      cost: body.cost
    })
  } else {
    console.log(body.data)
    console.log('Custo:', body.cost, 'Request ID:', responseRequestId)
  }
} finally {
  clearTimeout(timeout)
}
```

```python [Python]
import os
import uuid

import requests

api_key = os.environ["BLUE_CREDIT_API_KEY"]
request_id = str(uuid.uuid4())

response = requests.post(
    "https://api.conexaoazul.com/api/v1/credit/query",
    headers={
        "Accept": "application/json",
        "HTTP-API-KEY": api_key,
        "X-Request-ID": request_id,
    },
    json={
        "integration_code": "cnpj_completo",
        "document": "11222333000181",
    },
    timeout=(5, 25),
)
response.raise_for_status()

body = response.json()
response_request_id = response.headers.get("X-Request-ID", request_id)

if body.get("status") != "success":
    print(
        "Consulta sem sucesso:",
        body.get("error"),
        "custo:",
        body.get("cost"),
        "request_id:",
        response_request_id,
    )
else:
    print(body["data"])
    print("Custo:", body["cost"], "Request ID:", response_request_id)
```

```php [PHP]
<?php
$apiKey = getenv('BLUE_CREDIT_API_KEY');
if (!$apiKey) {
    throw new RuntimeException('BLUE_CREDIT_API_KEY não configurada');
}

$requestId = bin2hex(random_bytes(16));
$ch = curl_init('https://api.conexaoazul.com/api/v1/credit/query');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 25,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'HTTP-API-KEY: ' . $apiKey,
        'X-Request-ID: ' . $requestId,
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'integration_code' => 'cnpj_completo',
        'document' => '11222333000181',
    ], JSON_THROW_ON_ERROR),
]);

$raw = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($raw === false) {
    throw new RuntimeException(curl_error($ch));
}

curl_close($ch);
$body = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);

if ($status < 200 || $status >= 300) {
    throw new RuntimeException("HTTP {$status} [{$requestId}]: " . json_encode($body['detail'] ?? $body));
}

var_dump($body['status'], $body['data'] ?? null, $body['cost'] ?? null, $requestId);
```

:::

::: danger Backend obrigatório para a chave
O exemplo JavaScript é para Node.js no servidor. Não copie a chave para React, Vue, Angular, HTML ou aplicativo distribuído.
:::

## Estrutura variável de `data`

O envelope `status`, `data`, `error` e `cost` é comum. O conteúdo de `data` depende da integração. Valide apenas os campos que sua regra de negócio realmente utiliza e tolere campos adicionais dentro de `data`.

Para políticas de retry e códigos HTTP, consulte [Respostas e erros](/pt/respostas-erros).
