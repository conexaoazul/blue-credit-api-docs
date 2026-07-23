---
title: Limites e boas práticas
description: Recomendações de segurança, custo, confiabilidade e privacidade para produção.
---

# Limites e boas práticas

## Controle de custo

- `GET /credit/integrations` é público e gratuito.
- `POST /credit/query` pode debitar saldo por chamada.
- Evite consultas duplicadas, especialmente em filas, retries e cliques repetidos.
- Registre `cost` e `integration_code` para conciliação.
- Aplique limites internos por usuário, cliente, origem e período.

## Proteção contra duplicidade

A API não documenta uma chave de idempotência. Para evitar cobranças repetidas, crie uma proteção no seu backend:

1. gere um identificador para a operação;
2. grave uma assinatura com cliente, integração e documento normalizado;
3. bloqueie reenvios concorrentes por alguns segundos;
4. reutilize o resultado quando a regra de negócio permitir;
5. exija confirmação para consultas de maior custo.

## Timeout e retry

Use timeout explícito, por exemplo entre 15 e 30 segundos conforme sua operação. Repita somente falhas transitórias e limite o número de tentativas.

Uma política inicial conservadora:

- tentativa inicial;
- até duas novas tentativas para timeout, conexão interrompida ou `500`;
- espera exponencial com jitter;
- nenhuma repetição automática para `401`, `402`, `404` e `422`.

::: warning Consultas pagas e respostas perdidas
Em uma falha de rede, a consulta pode ter sido processada mesmo que seu sistema não tenha recebido a resposta. Antes de repetir, verifique sua trilha interna e considere o risco de nova cobrança.
:::

## Segurança da chave

- Chame `/credit/query` somente pelo backend.
- Armazene a chave em cofre de segredos ou variável de ambiente.
- Nunca exponha a chave em frontend, aplicativo distribuído ou repositório.
- Mascarar headers em logs e ferramentas de observabilidade.
- Rotacione a chave após vazamento ou mudança de responsável.

## Dados pessoais e resultados

Consultas podem retornar dados pessoais, financeiros, veiculares ou jurídicos. Aplique controles compatíveis com a finalidade contratada e com as obrigações legais da sua operação:

- autorize usuários e sistemas pelo menor privilégio necessário;
- registre quem consultou, quando e por qual finalidade;
- não envie documentos completos em logs, alertas ou tickets;
- retenha apenas o necessário;
- proteja dados em trânsito e em repouso;
- não use respostas isoladas como única base para decisões críticas sem validação apropriada.

## Validação de entrada

Normalize e valide antes de consultar:

- CPF e CNPJ somente com dígitos;
- placa sem espaços e com padrão esperado;
- código de integração obtido do catálogo atual;
- documento compatível com `document_type`;
- payload JSON com os dois campos obrigatórios.

## Catálogo e preços

Cacheie `GET /credit/integrations` por um período curto. Não mantenha preços fixos indefinidamente, pois integrações, disponibilidade e valores podem mudar.

## Observabilidade mínima

Acompanhe:

- total de consultas por integração;
- taxa de `success` e `error` no corpo;
- erros HTTP por status;
- duração e timeouts;
- custo total e custo médio;
- duplicidades bloqueadas;
- picos por cliente ou credencial.

## Limites públicos

Não há um limite público de requisições documentado nesta versão. Dimensione sua integração de forma gradual e alinhe operações de alto volume com `ola@conexaoazul.com`.
