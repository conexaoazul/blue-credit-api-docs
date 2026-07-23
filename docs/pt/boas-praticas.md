---
title: Limites e boas práticas
description: Recomendações de uso, cobrança e limites da Blue Credit API.
---

## 💰 Cobrança

A Blue Credit API **não é gratuita**: funciona com **saldo pré-pago por parceiro**. Cada chamada bem-sucedida a `POST /credit/query` debita automaticamente o preço da integração usada (campo `cost` da resposta).

- `GET /credit/integrations` é sempre gratuito e não exige `HTTP-API-KEY`.
- Se o saldo acabar, novas consultas retornam **402 Payment Required** até uma recarga.
- Preços têm dois níveis (`price_nivel_1` padrão, `price_nivel_2` por volume, sob solicitação) — veja [Integrações, Categorias e Preços](/pt/navegacao-dados).

Para consultar saldo ou solicitar recarga, entre em contato com `ola@conexaoazul.com`.

## 🚦 Boas práticas de uso

A API não expõe um limite de requisições documentado publicamente, mas recomendamos:

- Evitar disparar a mesma consulta em paralelo — cada chamada é cobrada individualmente, então uma corrida de requisições duplicadas gera cobrança duplicada.
- Cachear localmente o resultado de `GET /credit/integrations` (preços e catálogo mudam com pouca frequência) em vez de chamá-lo a cada consulta.
- Implementar retry com backoff exponencial apenas para erros `500` — não faça retry automático em `401`, `402`, `404` ou `422`, pois eles indicam um problema que uma nova tentativa idêntica não resolve.
- Validar o documento (CPF/CNPJ/placa) no seu lado antes de chamar a API, para não pagar por uma consulta com dado inválido.

::: tip Dica
Monitore o campo `cost` de cada resposta para acompanhar o gasto por integração e detectar picos de uso inesperados.
:::

## ⚙️ Métodos HTTP usados

A Blue Credit API expõe apenas dois métodos:

<script setup>

const methodsTable = [
  { key: 'GET', description: '<code>/credit/integrations</code> — consultar o catálogo de integrações e preços.', color: 'blue' },
  { key: 'POST', description: '<code>/credit/query</code> — executar uma consulta e debitar o saldo.', color: 'green' }
]
</script>

<ApiCard
  title="Métodos HTTP"
  :items="methodsTable"
/>

Não há endpoints `PUT`, `PATCH` ou `DELETE` — a API é somente leitura/execução de consultas, sem gestão de recursos via HTTP.
