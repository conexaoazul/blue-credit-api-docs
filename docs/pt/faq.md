---
title: Perguntas frequentes
description: Respostas rápidas sobre chave, preços, saldo, dados, erros e suporte.
---

# Perguntas frequentes

## Preciso de chave para listar as integrações?

Não. `GET /credit/integrations` é público e gratuito.

## Qual endpoint exige autenticação?

`POST /credit/query` exige o header `HTTP-API-KEY`.

## Posso chamar a API diretamente do frontend?

Não é recomendado. A chave ficaria acessível no navegador ou aplicativo distribuído. Use seu backend como intermediário.

## Como sei quanto a consulta custará?

Consulte `GET /credit/integrations` e leia `price_nivel_1` e `price_nivel_2`. O valor efetivamente debitado é retornado em `cost`.

## Como habilito o nível 2?

A conta precisa estar configurada comercialmente com `price_level = nivel_2`. Solicite a habilitação à Conexão Azul.

## Todo item tem desconto no nível 2?

Não presuma isso. Use os valores retornados pelo catálogo e confirme a configuração da conta.

## Um HTTP 200 sempre traz dados válidos?

Não. Verifique também `status`, `error` e `data`. Uma fonte pode responder sem sucesso mesmo quando a API processou a chamada.

## Uma consulta sem dados pode ser cobrada?

Pode. Quando o provider é acionado, a chamada pode gerar custo mesmo sem retornar o resultado esperado. Confira `cost`.

## Posso repetir automaticamente uma consulta com erro?

Somente falhas transitórias, como timeout, conexão interrompida ou `500`, devem ser candidatas a retry. Não repita automaticamente `401`, `402`, `404` ou `422`.

## Como evito cobrança duplicada?

Bloqueie requisições concorrentes equivalentes, aplique deduplicação no backend e limite retries. A documentação atual não define chave de idempotência.

## A estrutura de `data` é igual em todas as integrações?

Não. O envelope externo é estável, mas `data` varia conforme o provider e a integração escolhida.

## Há limite público de requisições?

Não há um limite público documentado nesta versão. Operações de alto volume devem ser alinhadas previamente.

## Existe homologação?

Ambiente ou chave de homologação depende de habilitação. Confirme a disponibilidade antes de automatizar testes.

## Como solicito chave, saldo ou suporte?

Entre em contato por `ola@conexaoazul.com`. Não envie chaves nem documentos pessoais completos no e-mail.

## Onde está o contrato OpenAPI?

Em `https://api.conexaoazul.com/doc/openapi.json` e na página [API Reference](/pt/api-reference).
