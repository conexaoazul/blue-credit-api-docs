---
title: Visão geral
description: Entenda o modelo de uso, autenticação, cobrança e respostas da Blue Credit API.
---

# Blue Credit API

A **Blue Credit API** permite integrar consultas cadastrais, veiculares, de protestos, score, dívidas e outras fontes de dados em sistemas próprios.

A integração tem dois passos: consultar o catálogo público para descobrir os códigos e preços atuais e, depois, executar a consulta autenticada com saldo pré-pago.

## Endereços oficiais

| Recurso | URL |
|---|---|
| Base da API | `https://api.conexaoazul.com/api/v1` |
| Documentação | `https://api.conexaoazul.com/doc/` |
| OpenAPI 3.0.3 | `https://api.conexaoazul.com/doc/openapi.json` |

## Endpoints

| Método | Endpoint | Finalidade | Autenticação | Cobrança |
|---|---|---|---|---|
| `GET` | `/credit/integrations` | Lista integrações ativas, documentos aceitos e preços | Não exige chave | Gratuito |
| `POST` | `/credit/query` | Executa uma consulta | `HTTP-API-KEY` | Debita o preço aplicável |

## Fluxo recomendado

1. Consulte `GET /credit/integrations` e armazene temporariamente o catálogo.
2. Escolha o `code` da integração e valide o tipo de documento aceito.
3. Envie `integration_code` e `document` para `POST /credit/query`.
4. Verifique primeiro o status HTTP e depois o campo `status` do corpo.
5. Registre o campo `cost` para conciliar consumo e saldo.

## Primeiro teste

Liste o catálogo público:

```bash
curl --fail-with-body --silent --show-error \
  https://api.conexaoazul.com/api/v1/credit/integrations
```

Execute uma consulta usando a chave em variável de ambiente:

```bash
export BLUE_CREDIT_API_KEY='SUA_CHAVE'

curl --fail-with-body --silent --show-error \
  --request POST \
  'https://api.conexaoazul.com/api/v1/credit/query' \
  --header 'Content-Type: application/json' \
  --header "HTTP-API-KEY: ${BLUE_CREDIT_API_KEY}" \
  --data '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

::: danger Não use a chave diretamente no navegador
O endpoint de consulta deve ser chamado pelo seu backend. Uma chave colocada em JavaScript, aplicativo distribuído, extensão ou página web pode ser extraída e usada por terceiros.
:::

## Como interpretar a resposta

O contrato externo da consulta contém:

- `status`: resultado da execução, normalmente `success` ou `error`;
- `data`: retorno da fonte consultada, cuja estrutura varia por integração;
- `aux`: dados auxiliares, quando disponíveis;
- `error`: mensagem do provider, quando houver;
- `cost`: valor debitado pela chamada.

Um `HTTP 200` pode conter `status: "error"` quando a fonte foi consultada, mas não retornou o resultado esperado. Consulte [Respostas e erros](/pt/respostas-erros) antes de automatizar decisões.

## Próximos passos

- [Início rápido](/pt/inicio-rapido)
- [Autenticação e ambientes](/pt/auth-ambiente)
- [Integrações e preços](/pt/navegacao-dados)
- [Exemplos de uso](/pt/exemplos-api-aux)
- [API Reference](/pt/api-reference)

## Suporte

Para solicitar chave, saldo, habilitação comercial ou ajuda técnica, escreva para `ola@conexaoazul.com` sem incluir chaves ou dados pessoais completos na mensagem.
