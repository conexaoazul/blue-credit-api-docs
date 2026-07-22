---
title: Respostas & Erros
description: 'Códigos de status HTTP, formato de resposta e tratamento de erros da Blue Credit API.'
---

## 📜 Dois níveis de erro

A Blue Credit API sinaliza problemas de duas formas diferentes — é importante tratar as duas:

1. **Erros de transporte/negócio** (chave inválida, saldo insuficiente, integração inexistente, payload malformado): a API responde com um **status HTTP de erro** (401, 402, 404, 422, 500) e um objeto `{"detail": ...}`.
2. **Erro do provider consultado** (ex.: documento não encontrado na base de origem): a API responde **HTTP 200** normalmente, mas com `status: "error"` no corpo e a mensagem em `error`. Isso acontece porque a consulta foi executada e cobrada — o provider terceiro que não teve dado para retornar.

::: warning Sempre confira `status` no corpo, não só o HTTP status
Um `200 OK` com `status: "error"` ainda gera cobrança (`cost` > 0), pois a chamada ao provider foi realizada.
:::

## 🚦 Códigos de status HTTP

<script setup>

const statusTable = [
  {
    key: '200',
    description: '<code>OK</code> — requisição processada. Confira o campo <code>status</code> no corpo para saber se a consulta teve sucesso.',
    color: 'green'
  },
  {
    key: '401',
    description: '<code>Unauthorized</code> — header <code>HTTP-API-KEY</code> ausente ou inválido.',
    color: 'red'
  },
  {
    key: '402',
    description: '<code>Payment Required</code> — saldo pré-pago insuficiente para o custo da integração.',
    color: 'red'
  },
  {
    key: '404',
    description: '<code>Not Found</code> — <code>integration_code</code> não existe no catálogo de integrações.',
    color: 'purple'
  },
  {
    key: '422',
    description: '<code>Unprocessable Entity</code> — payload inválido (ex.: <code>document</code> ausente).',
    color: 'yellow'
  },
  {
    key: '500',
    description: '<code>Internal Server Error</code> — erro interno; entre em contato com o suporte se persistir.',
    color: 'pink'
  }
]
</script>

<ApiCard
  title="HTTP Status"
  :items="statusTable"
/>

## ⚠️ Formato dos erros HTTP (401 / 402 / 404 / 500)

```json
{
  "detail": "Saldo insuficiente"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `detail` | string | Mensagem descritiva do erro |

### Exemplos por status

::: code-group

```json [401]
{ "detail": "Not authenticated" }
```

```json [402]
{ "detail": "Saldo insuficiente" }
```

```json [404]
{ "detail": "Integração não encontrada" }
```

:::

## ⚠️ Formato de erro de validação (422)

```json
{
  "detail": [
    {
      "loc": ["body", "document"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## 📊 Resposta de `POST /credit/query`

Sempre tem este formato, independente de sucesso ou falha do provider:

```json
{
  "status": "success",
  "data": { "...": "payload do provider, estrutura varia por integração" },
  "aux": [],
  "error": null,
  "cost": 0.165
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `status` | `"success"` \| `"error"` | Resultado da consulta ao provider |
| `data` | object | Dados retornados pelo provider (estrutura varia por integração) |
| `aux` | array | Dados auxiliares (ex.: PDF em base64), quando a integração suporta |
| `error` | string \| null | Mensagem de erro do provider, quando `status = "error"` |
| `cost` | number | Valor em R$ debitado do saldo por esta chamada |

## 🔧 Tratamento de erros em código

::: code-group

```javascript [JavaScript]
const response = await fetch('https://api.conexaoazul.com/api/v1/credit/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'HTTP-API-KEY': 'SUA_CHAVE'
  },
  body: JSON.stringify({ integration_code: 'cnpj_completo', document: '11222333000181' })
});

if (!response.ok) {
  const err = await response.json();
  console.error(`Erro ${response.status}: ${err.detail}`);
} else {
  const result = await response.json();
  if (result.status === 'error') {
    console.warn('Provider não retornou dados:', result.error);
  } else {
    console.log(result.data, `custo: R$ ${result.cost}`);
  }
}
```

```python [Python]
import requests

response = requests.post(
    'https://api.conexaoazul.com/api/v1/credit/query',
    headers={'HTTP-API-KEY': 'SUA_CHAVE'},
    json={'integration_code': 'cnpj_completo', 'document': '11222333000181'}
)

if not response.ok:
    err = response.json()
    print(f"Erro {response.status_code}: {err['detail']}")
else:
    result = response.json()
    if result['status'] == 'error':
        print('Provider não retornou dados:', result['error'])
    else:
        print(result['data'], f"custo: R$ {result['cost']}")
```

:::

::: tip Dica
Trate `401`/`402`/`404`/`422`/`500` como erros de infraestrutura (retry ou alerta), e `status: "error"` no corpo 200 como um resultado de negócio normal (documento sem dados na base consultada).
:::
