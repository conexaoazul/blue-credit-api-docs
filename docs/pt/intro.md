---
title: Visão Geral
description: Documentação da Blue Credit API — consultas cadastrais, veiculares, protestos, score e dívidas.
---

# 🚀 Blue Credit API

A **Blue Credit API** é uma API REST hospedada no Odoo 19 da Conexão Azul que permite consultar dezenas de bases de dados (cadastrais, veiculares, protestos, score, dívidas etc.) com pré-pagamento por consulta.

Cada requisição debita automaticamente o saldo do parceiro conforme o preço da integração escolhida.

---

## URL Base

```bash
https://api.conexaoazul.com/api/v1
```

## Autenticação

Todas as requisições exigem o header `HTTP-API-KEY`:

```bash
curl -X POST https://api.conexaoazul.com/api/v1/credit/query \
  -H "HTTP-API-KEY: DEMO-KEY-LINCSAT-2026" \
  -H "Content-Type: application/json" \
  -d '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

::: tip Demo key
A chave `DEMO-KEY-LINCSAT-2026` é válida apenas para testes e tem saldo limitado. Solicite sua chave de produção em `ola@conexaoazul.com`.
:::

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/credit/integrations` | Lista todas as integrações disponíveis, preços e tipo de documento |
| POST | `/credit/query` | Executa uma consulta e retorna os dados do provider + custo |

## Integrações mais econômicas

A API tem 35 integrações ativas, cobrindo dados cadastrais, veiculares, protestos, dívidas/crédito, score e jurídico. As 5 mais baratas:

| Código | Nome | Tipo de documento | Preço N1 |
|---|---|---|---|
| `cnpj_completo` | CNPJ Completo | `cnpj` | R$ 0,105 |
| `cpf_simples` | CPF Simples | `cpf` | R$ 0,165 |
| `fipe` | Tabela FIPE | `placa` | R$ 0,18 |
| `cenprot_v2` | CENPROT V2 | `both` | R$ 0,66 |
| `ic-cpf-completo` | IC CPF Completo | `both` | R$ 1,21 |

Veja o catálogo completo agrupado por categoria, com todos os preços, em [Integrações, Categorias e Preços](/pt/navegacao-dados). Os schemas interativos (request/response) estão em [API Reference](/pt/api-reference).

## Fluxo típico

1. **Liste integrações**: `GET /credit/integrations`
2. **Escolha o código** e monte o payload `{integration_code, document}`
3. **Execute a consulta**: `POST /credit/query`
4. **Leia o response**:
   - `status`: `success` ou `error`
   - `data`: payload retornado pelo provider (estrutura varia)
   - `cost`: custo debitado em R$
   - `error`: mensagem de erro da integração, se houver

## Próximos passos

- [Autenticação e Ambientes](/pt/auth-ambiente) — header `HTTP-API-KEY`, ambientes de produção/homologação
- [Integrações, Categorias e Preços](/pt/navegacao-dados) — catálogo completo das 35 integrações e níveis de preço
- [Exemplos de Uso](/pt/exemplos-api-aux) — cURL, JavaScript, Python e PHP
- [Respostas & Erros](/pt/respostas-erros) — códigos HTTP e formato de erro
- [Limites e boas práticas](/pt/boas-praticas) — cobrança e recomendações de uso
- [API Reference](/pt/api-reference) — schemas interativos (Scalar)

## Suporte

Dúvidas ou solicitação de chave de produção: `ola@conexaoazul.com`
