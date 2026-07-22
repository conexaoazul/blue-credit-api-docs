---
title: Exemplos de Uso
description: Exemplos práticos de consulta à Blue Credit API em diferentes linguagens de programação.
---

## 💡 Exemplos práticos

Os dois exemplos abaixo cobrem os únicos dois endpoints da API: listar integrações e executar uma consulta.

### 1. Listar integrações disponíveis

`GET /credit/integrations` não exige `HTTP-API-KEY` e retorna código, categoria, tipo de documento e preços de todas as integrações ativas.

::: code-group

```bash [cURL]
curl -s https://api.conexaoazul.com/api/v1/credit/integrations | python3 -m json.tool
```

```javascript [JavaScript (fetch)]
const response = await fetch('https://api.conexaoazul.com/api/v1/credit/integrations');
const integrations = await response.json();
console.log(integrations);
```

```python [Python (requests)]
import requests

response = requests.get('https://api.conexaoazul.com/api/v1/credit/integrations')
integrations = response.json()
print(integrations)
```

```php [PHP]
<?php
$response = file_get_contents('https://api.conexaoazul.com/api/v1/credit/integrations');
$integrations = json_decode($response, true);
print_r($integrations);
```

:::

**Resposta (trecho):**

```json
[
  {
    "code": "cnpj_completo",
    "name": "CNPJ Completo",
    "category": "cadastral",
    "document_type": "cnpj",
    "document_param_name": "cnpj",
    "price_nivel_1": 0.105,
    "price_nivel_2": 0.06
  }
]
```

### 2. Executar uma consulta

`POST /credit/query` exige `HTTP-API-KEY` e o body `{ integration_code, document }`. O `integration_code` vem do endpoint acima; `document` é o CPF, CNPJ ou placa a consultar.

::: code-group

```bash [cURL]
curl -s -X POST https://api.conexaoazul.com/api/v1/credit/query \
  -H "Content-Type: application/json" \
  -H "HTTP-API-KEY: SUA_CHAVE" \
  -d '{"integration_code":"cnpj_completo","document":"11222333000181"}' | python3 -m json.tool
```

```javascript [JavaScript (fetch)]
const response = await fetch('https://api.conexaoazul.com/api/v1/credit/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'HTTP-API-KEY': 'SUA_CHAVE'
  },
  body: JSON.stringify({
    integration_code: 'cnpj_completo',
    document: '11222333000181'
  })
});

const result = await response.json();
if (result.status === 'success') {
  console.log(result.data, `custo: R$ ${result.cost}`);
} else {
  console.error(result.error);
}
```

```python [Python (requests)]
import requests

response = requests.post(
    'https://api.conexaoazul.com/api/v1/credit/query',
    headers={'HTTP-API-KEY': 'SUA_CHAVE'},
    json={'integration_code': 'cnpj_completo', 'document': '11222333000181'}
)

result = response.json()
if result['status'] == 'success':
    print(result['data'], f"custo: R$ {result['cost']}")
else:
    print('erro:', result['error'])
```

```php [PHP]
<?php
$ch = curl_init('https://api.conexaoazul.com/api/v1/credit/query');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'HTTP-API-KEY: SUA_CHAVE'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'integration_code' => 'cnpj_completo',
    'document' => '11222333000181'
]));

$response = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $response['status'] === 'success' ? print_r($response['data'], true) : $response['error'];
```

:::

**Resposta de sucesso:**

```json
{
  "status": "success",
  "data": {
    "status": "sucesso",
    "dados": {
      "cpf": "00000000191",
      "nome": "RECEITA FEDERAL PARA USO DO SISTEMA"
    }
  },
  "aux": [],
  "error": null,
  "cost": 0.165
}
```

::: tip Estrutura de `data` varia por integração
O objeto `data` é o retorno bruto do provider por trás de cada integração — a estrutura muda conforme a base consultada. Consulte o schema `QueryResponse` em [API Reference](/pt/api-reference) para o contrato garantido (`status`, `cost`, `error`), e trate `data` como semiestruturado no seu parser.
:::

## 🔧 Boas práticas nos exemplos

::: warning Atenção
- Nunca compartilhe sua `HTTP-API-KEY` em código versionado, logs ou mensagens de erro visíveis ao cliente final.
- Armazene a chave em variáveis de ambiente (`.env`, secrets do CI/CD, etc.).
- Sempre verifique o campo `status` da resposta antes de processar `data` — uma consulta pode retornar HTTP 200 com `status: "error"` quando o provider não encontra o documento.
:::

Para o tratamento completo de erros HTTP (401, 402, 404, 422, 500), veja [Respostas & Erros](/pt/respostas-erros).
