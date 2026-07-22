---
title: Overview
description: Blue Credit API REST documentation — registry, vehicle, protest, credit score and debt queries.
---

# 🚀 Blue Credit API

**Blue Credit API** is a REST API hosted on Conexão Azul's Odoo 19 platform. It lets you query dozens of Brazilian data sources (registry, vehicle, protests, credit score, debts and more) using a prepaid-per-query model.

Each request automatically debits the partner's balance according to the chosen integration price.

---

## Base URL

```bash
https://api.conexaoazul.com/api/v1
```

## Authentication

Every request must include the `HTTP-API-KEY` header:

```bash
curl -X POST https://api.conexaoazul.com/api/v1/credit/query \
  -H "HTTP-API-KEY: DEMO-KEY-LINCSAT-2026" \
  -H "Content-Type: application/json" \
  -d '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

::: tip Demo key
`DEMO-KEY-LINCSAT-2026` is for testing only and has limited balance. Request a production key at `ola@conexaoazul.com`.
:::

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/credit/integrations` | Lists all available integrations, prices and document types |
| POST | `/credit/query` | Runs a query and returns provider data + cost |

## Cheapest sample integrations

These integrations were tested and work as samples:

| Code | Name | Document type | Price N1 |
|---|---|---|---|
| `cnpj_completo` | Complete CNPJ | `cnpj` | R$ 0.105 |
| `cpf_simples` | Simple CPF | `cpf` | R$ 0.165 |
| `fipe` | FIPE table | `placa` | R$ 0.18 |
| `cenprot_v2` | CENPROT V2 | `both` | R$ 0.66 |
| `ic-cpf-completo` | IC Complete CPF | `both` | R$ 1.21 |

See the full list and interactive schemas in the [API Reference](/en/api-reference).

## Typical flow

1. **List integrations**: `GET /credit/integrations`
2. **Pick the code** and build the payload `{integration_code, document}`
3. **Run the query**: `POST /credit/query`
4. **Read the response**:
   - `status`: `success` or `error`
   - `data`: provider payload (structure varies)
   - `cost`: debited amount in BRL
   - `error`: integration error message, if any

## Support

Questions or production key request: `ola@conexaoazul.com`
