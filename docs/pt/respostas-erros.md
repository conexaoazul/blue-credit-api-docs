---
title: Respostas e erros
description: Como interpretar códigos HTTP, erros do provider, custo e rastreamento da Blue Credit API.
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
  "error": null,
  "cost": 0.165
}
```

| Campo | Tipo | Uso |
|---|---|---|
| `status` | `success` ou `error` | Resultado da consulta ao provider |
| `data` | objeto ou `null` | Dados da integração |
| `error` | string ou `null` | Mensagem devolvida pela integração |
| `cost` | número ou `null` | Valor debitado quando a consulta foi concluída com sucesso |

::: warning HTTP 200 não significa necessariamente que existem dados
Uma fonte pode responder com `status: "error"`, `data: null` ou uma mensagem em `error`. Trate esse cenário como resultado da fonte consultada, não como indisponibilidade automática da API.
:::

## Identificador de requisição

As respostas que chegam ao router da Blue Credit API retornam o header `X-Request-ID`. Você também pode enviar um valor próprio, com até 128 caracteres alfanuméricos e os símbolos `.`, `_`, `:` ou `-`.

```bash
--header 'X-Request-ID: pedido-8472-tentativa-1'
```

Erros de autenticação `401` e validação `422` podem ocorrer antes da execução do router. Nesses casos, o header pode não estar presente. Guarde o identificador quando ele for retornado e registre também status HTTP, horário e `integration_code`.

Em erros internos, informe o `X-Request-ID` ao suporte em vez de enviar a chave ou o documento completo.

## Códigos HTTP documentados

| Status | Significado | Repetir automaticamente? |
|---:|---|---|
| `200` | Requisição processada; verifique o corpo | Não por padrão |
| `401` | Chave ausente ou inválida no endpoint autenticado | Não |
| `402` | Saldo insuficiente | Não |
| `404` | Integração não encontrada | Não |
| `422` | Payload inválido | Não |
| `500` | Erro interno ou falha transitória | Somente com limite e análise de duplicidade |
| `503` | Serviço interno não configurado ou temporariamente indisponível | Sim, com limite e backoff |

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
const requestId = crypto.randomUUID()

try {
  const response = await fetch(
    'https://api.conexaoazul.com/api/v1/credit/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'HTTP-API-KEY': process.env.BLUE_CREDIT_API_KEY,
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
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.detail ?? 'Resposta de erro sem JSON válido'
    throw new Error(
      `Blue Credit HTTP ${response.status} [${responseRequestId}]: ${JSON.stringify(message)}`
    )
  }

  if (payload.status !== 'success') {
    console.warn('Consulta concluída sem sucesso na fonte', {
      requestId: responseRequestId,
      error: payload.error,
      cost: payload.cost
    })
  } else {
    console.log('Consulta concluída', {
      requestId: responseRequestId,
      cost: payload.cost
    })
  }
} finally {
  clearTimeout(timeout)
}
```

## Estratégia de retry

Repita apenas falhas transitórias, como `500`, `503`, timeout ou erro de conexão. Use poucas tentativas, espera exponencial e jitter.

Antes de repetir uma consulta paga, avalie se a chamada anterior pode ter alcançado a fonte e perdido apenas a resposta. Reutilize o mesmo identificador lógico da operação no seu sistema e bloqueie requisições concorrentes equivalentes.

Não repita automaticamente `401`, `402`, `404` ou `422`: a mesma requisição continuará inválida até que chave, saldo, código ou payload sejam corrigidos.

## O que registrar

Registre `X-Request-ID` quando disponível, status HTTP, `integration_code`, duração, `status` e `cost`. Não registre a chave nem o documento completo. Para diagnóstico, use documento mascarado, por exemplo `***0001-81`.
