---
title: Aperçu
description: Documentation de l API REST Blue Credit API.
---

# 🚀 Blue Credit API

**Blue Credit API** fournit un accès programmatique à des dizaines de bases de données brésiliennes (véhicules, registre, protestations, score, dettes) via une API REST avec paiement à la consultation.

## URL de base

```bash
https://api.conexaoazul.com/api/v1
```

## Authentification

Incluez le header `HTTP-API-KEY`:

```bash
curl -X POST https://api.conexaoazul.com/api/v1/credit/query \
  -H "HTTP-API-KEY: DEMO-KEY-LINCSAT-2026" \
  -H "Content-Type: application/json" \
  -d '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

## Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/credit/integrations` | Liste les intégrations disponibles |
| POST | `/credit/query` | Exécute une requête |

Voir la [Référence API](/fr/api-reference) pour les schemas complets.

## Support

`ola@conexaoazul.com`
