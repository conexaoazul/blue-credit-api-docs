---
title: Autenticação e ambientes
description: Como proteger e enviar a HTTP-API-KEY na Blue Credit API.
---

# Autenticação e ambientes

## Endpoint público

`GET /credit/integrations` é público, gratuito e não exige `HTTP-API-KEY`. Use-o para descobrir integrações ativas, formatos de documento e preços atuais.

```bash
curl --fail-with-body --silent --show-error \
  https://api.conexaoazul.com/api/v1/credit/integrations
```

## Consulta autenticada

`POST /credit/query` exige a chave no header `HTTP-API-KEY` e um corpo JSON.

```bash
export BLUE_CREDIT_API_KEY='SUA_CHAVE'

curl --fail-with-body --silent --show-error \
  --request POST \
  'https://api.conexaoazul.com/api/v1/credit/query' \
  --header 'Content-Type: application/json' \
  --header "HTTP-API-KEY: ${BLUE_CREDIT_API_KEY}" \
  --data '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

| Header | Obrigatório | Uso |
|---|---|---|
| `HTTP-API-KEY` | Somente em `/credit/query` | Identifica a conta responsável pela consulta e pelo saldo |
| `Content-Type: application/json` | Em requisições `POST` | Informa que o corpo está em JSON |
| `Accept: application/json` | Recomendado | Explicita o formato esperado da resposta |
| `X-Request-ID` | Opcional | Permite enviar um identificador rastreável; a API o devolve quando a requisição chega ao router |

Uma chave ausente ou inválida retorna `401 Unauthorized`. Como a autenticação ocorre antes do router, respostas `401` podem não conter `X-Request-ID`.

## Ambiente de produção

```text
https://api.conexaoazul.com/api/v1
```

As consultas nesse endereço podem debitar saldo real. Ambientes ou chaves de homologação dependem de habilitação. Confirme a disponibilidade com `ola@conexaoazul.com` antes de incluí-los em CI/CD ou testes automatizados.

## Armazenamento seguro

- Guarde a chave em variáveis de ambiente, secret managers ou cofres de credenciais.
- Nunca coloque a chave em frontend, repositório, imagem Docker, log, ticket ou print.
- Use chaves separadas por cliente e ambiente quando essa opção estiver disponível.
- Restrinja quem pode visualizar, rotacionar e utilizar a chave.
- Em caso de suspeita de vazamento, interrompa o uso e solicite revogação e substituição.

### Exemplo de `.env`

```dotenv
BLUE_CREDIT_API_URL=https://api.conexaoazul.com/api/v1
BLUE_CREDIT_API_KEY=SUA_CHAVE
```

Inclua `.env` no `.gitignore` e forneça apenas um `.env.example` sem valores reais.

## Arquitetura recomendada

```text
Seu frontend → Seu backend → Blue Credit API
```

Seu backend autentica o usuário final, aplica regras de permissão, valida o documento, chama a Blue Credit API e devolve apenas os dados necessários. Isso evita expor a chave e reduz o risco de consultas indevidas.

## Cobrança associada à conta

A chave identifica a conta responsável pela consulta. O catálogo apresenta as tabelas disponíveis, mas o valor efetivamente debitado depende da configuração comercial ativa e é retornado no campo `cost`. Trate `cost` como a fonte de verdade para conciliação e monitoramento de consumo.
