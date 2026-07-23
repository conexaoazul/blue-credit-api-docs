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
| `HTTP-API-KEY` | Somente em `/credit/query` | Identifica a conta, o nível de preço e o saldo |
| `Content-Type: application/json` | Em requisições `POST` | Informa que o corpo está em JSON |
| `Accept: application/json` | Recomendado | Explicita o formato esperado da resposta |

Uma chave ausente ou inválida na consulta retorna `401 Unauthorized`.

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

## Cobrança associada à chave

A chave identifica a conta responsável pela consulta. Cada chamada aceita em `POST /credit/query` usa o nível de preço configurado para a conta e pode debitar o saldo disponível. Consulte o `cost` da resposta e monitore o consumo no seu sistema.
