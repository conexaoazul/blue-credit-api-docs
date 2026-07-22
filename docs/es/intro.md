---
title: Visión General
description: Documentación de la API REST Blue Credit API.
---

# 🚀 Blue Credit API

**Blue Credit API** permite consultar bases de datos brasileñas (vehiculares, cadastrales, protestos, score y más) mediante una API REST con prepago por consulta.

## URL Base

```bash
https://api.conexaoazul.com/api/v1
```

## Autenticación

Incluya el header `HTTP-API-KEY`:

```bash
curl -X POST https://api.conexaoazul.com/api/v1/credit/query \
  -H "HTTP-API-KEY: DEMO-KEY-LINCSAT-2026" \
  -H "Content-Type: application/json" \
  -d '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/credit/integrations` | Lista las integraciones disponibles |
| POST | `/credit/query` | Ejecuta una consulta |

Consulte la [Referencia API](/es/api-reference) para los schemas completos.

## Soporte

`ola@conexaoazul.com`
