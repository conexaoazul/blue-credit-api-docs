---
title: Respostas e erros
description: Como interpretar códigos HTTP, erros do provider e custo da Blue Credit API.
---

# Respostas e erros

A integração deve tratar duas camadas separadamente:

1. **Status HTTP:** informa se a requisição foi autenticada, validada e processada pela API.
2. **Campo `status` no JSON:** informa o resultado retornado pela fonte consultada.

## Resposta de consulta

```json
{
  "status": "success",
  "data": {
    "...": "estrutura específica da integração"
  },
  "aux": [],
  "error": null,
  "cost": 0.165
}
```

| Campo | Tipo | Uso |
|---|---|---|
| `status` | `success` ou `error` | Resultado da consulta ao provider |
| `data` | objeto ou `null` | Dados da integração |
| `aux` | array | Conteúdo auxiliar, quando disponível |
| `error` | string ou `null` | Mensagem devolvida pela integração |
| `cost` | número | Valor debitado pela chamada |

::: warning HTTP 200 não significa necessariamente que existem dados
Uma fonte pode ter sido consultada e cobrada, mas responder com `status: "error"`, `data: null` ou uma mensagem em `error`. Trate esse cenário como resultado da consulta, não como indisponibilidade automática da API.
:::

## Códigos HTTP documentados

| Status | Significado | Repetir automaticamente? |
|---:|---|---|
| `200` | Requisição processada; verifique o corpo | Não por padrão |
| `401` | Chave ausente ou inválida no endpoint autenticado | Não |
| `402` | Saldo insuficiente | Não |
| `404` | Integração não encontrada | Não |
| `422` | Payload inválido | Não |
| `500` | Erro interno ou falha transitória | Sim, com limite e backoff |

### Formato comum

```json
{
  "detail": "Saldo insuficiente"
}
```

O campo `detail` pode ser uma string ou, em erros de validação, uma lista de ocorrências.

### Exemplo de validação

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

## Tratamento seguro em JavaScript

```javascript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 20_000)

try {
  const response = await fetch(
    'https://api.conexaoazul.com/api/v1/credit/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'HTTP-API-KEY': process.env.BLUE_CREDIT_API_KEY
      },
      body: JSON.stringify({
        integration_code: 'cnpj_completo',
        document: '11222333000181'
      }),
      signal: controller.signal
    }
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.detail ?? 'Resposta de erro sem JSON válido'
    throw new Error(`Blue Credit HTTP ${response.status}: ${JSON.stringify(message)}`)
  }

  if (payload.status !== 'success') {
    console.warn('Consulta concluída sem sucesso no provider', {
      error: payload.error,
      cost: payload.cost
    })
  } else {
    console.log('Consulta concluída', { cost: payload.cost })
  }
} finally {
  clearTimeout(timeout)
}
```

## Estratégia de retry

Repita apenas falhas transitórias, como `500`, timeout ou erro de conexão. Use poucas tentativas, espera exponencial e jitter. Antes de repetir uma consulta paga, avalie o risco de a primeira chamada ter sido processada e a resposta ter se perdido.

Não repita automaticamente `401`, `402`, `404` ou `422`: a mesma requisição continuará inválida até que chave, saldo, código ou payload sejam corrigidos.

## O que registrar

Registre status HTTP, `integration_code`, duração, `status`, `cost` e um identificador interno da operação. Não registre a chave nem o documento completo. Para diagnóstico, use documento mascarado, por exemplo `***0001-81`.
