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

const integrations = await response.json()
console.table(integrations)
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
  --data '{"integration_code":"cnpj_completo","document":"11222333000181"}' \
  | python3 -m json.tool
```

```javascript [Node.js 18+]
const apiKey = process.env.BLUE_CREDIT_API_KEY
if (!apiKey) throw new Error('BLUE_CREDIT_API_KEY não configurada')

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
        'HTTP-API-KEY': apiKey
      },
      body: JSON.stringify({
        integration_code: 'cnpj_completo',
        document: '11222333000181'
      }),
      signal: controller.signal
    }
  )

  const body = await response.json()

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(body.detail)}`)
  }

  if (body.status !== 'success') {
    console.warn('Consulta sem sucesso no provider', {
      error: body.error,
      cost: body.cost
    })
  } else {
    console.log(body.data)
    console.log('Custo:', body.cost)
  }
} finally {
  clearTimeout(timeout)
}
```

```python [Python]
import os
import requests

api_key = os.environ["BLUE_CREDIT_API_KEY"]

response = requests.post(
    "https://api.conexaoazul.com/api/v1/credit/query",
    headers={
        "Accept": "application/json",
        "HTTP-API-KEY": api_key,
    },
    json={
        "integration_code": "cnpj_completo",
        "document": "11222333000181",
    },
    timeout=(5, 25),
)
response.raise_for_status()

body = response.json()
if body.get("status") != "success":
    print("Consulta sem sucesso:", body.get("error"), "custo:", body.get("cost"))
else:
    print(body["data"])
    print("Custo:", body["cost"])
```

```php [PHP]
<?php
$apiKey = getenv('BLUE_CREDIT_API_KEY');
if (!$apiKey) {
    throw new RuntimeException('BLUE_CREDIT_API_KEY não configurada');
}

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
    throw new RuntimeException("HTTP {$status}: " . json_encode($body['detail'] ?? $body));
}

var_dump($body['status'], $body['data'] ?? null, $body['cost'] ?? null);
```

:::

::: danger Backend obrigatório para a chave
O exemplo JavaScript é para Node.js no servidor. Não copie a chave para React, Vue, Angular, HTML ou aplicativo distribuído.
:::

## Estrutura variável de `data`

O envelope `status`, `data`, `aux`, `error` e `cost` é comum. O conteúdo de `data` depende da integração. Valide apenas os campos que sua regra de negócio realmente utiliza e tolere campos adicionais.

Para políticas de retry e códigos HTTP, consulte [Respostas e erros](/pt/respostas-erros).
