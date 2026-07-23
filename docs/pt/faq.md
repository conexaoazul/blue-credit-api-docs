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

Consulte `GET /credit/integrations` para conhecer as tabelas disponíveis. O valor efetivamente debitado é retornado em `cost` e deve ser tratado como a fonte de verdade para conciliação.

## Como habilito condições comerciais diferenciadas?

As condições dependem da configuração comercial ativa da conta e do provedor. Solicite a avaliação à Conexão Azul e não presuma que toda integração terá desconto.

## Um HTTP 200 sempre traz dados válidos?

Não. Verifique também `status`, `error` e `data`. Uma fonte pode responder sem sucesso mesmo quando a API processou a chamada.

## Uma consulta sem dados pode ser cobrada?

Depende do retorno e da política da fonte consultada. Confira o campo `cost`; quando ele vier preenchido, use-o na conciliação.

## Posso repetir automaticamente uma consulta com erro?

Somente falhas transitórias, como timeout, conexão interrompida, `500` ou `503`, devem ser candidatas a retry. Não repita automaticamente `401`, `402`, `404` ou `422`.

## Como evito cobrança duplicada?

Bloqueie requisições concorrentes equivalentes, aplique deduplicação no backend e limite retries. A documentação atual não define chave de idempotência.

## Como acompanho uma falha com o suporte?

Guarde o header `X-Request-ID` retornado pela API. Envie esse identificador, o horário e o endpoint ao suporte, sem compartilhar a chave nem o documento completo.

## A estrutura de `data` é igual em todas as integrações?

Não. O envelope externo é estável, mas `data` varia conforme o provider e a integração escolhida.

## Há limite público de requisições?

Não há um limite público documentado nesta versão. Operações de alto volume devem ser alinhadas previamente.

## Existe homologação?

Ambiente ou chave de homologação depende de habilitação. Confirme a disponibilidade antes de automatizar testes.

## Como solicito chave, saldo ou suporte?

Entre em contato por `ola@conexaoazul.com`. Não envie chaves nem documentos pessoais completos no e-mail.

## Onde está o contrato OpenAPI?

Em `https://docs.conexaoazul.com/openapi.json` e na página [API Reference](/pt/api-reference).
