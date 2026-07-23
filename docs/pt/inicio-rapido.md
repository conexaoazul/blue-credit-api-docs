---
title: Início rápido
description: Integre a Blue Credit API com segurança em poucos minutos.
---

# Início rápido

Este guia cria uma integração mínima, segura e pronta para evoluir.

## 1. Configure as variáveis

```dotenv
BLUE_CREDIT_API_URL=https://api.conexaoazul.com/api/v1
BLUE_CREDIT_API_KEY=SUA_CHAVE
```

Não versione o arquivo `.env`.

## 2. Descubra a integração

```bash
curl --fail-with-body --silent --show-error \
  "${BLUE_CREDIT_API_URL}/credit/integrations" \
  | python3 -m json.tool
```

Escolha o campo `code` e confirme `document_type` e o preço retornado.

## 3. Execute a consulta

```bash
curl --fail-with-body --silent --show-error \
  --request POST \
  "${BLUE_CREDIT_API_URL}/credit/query" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "HTTP-API-KEY: ${BLUE_CREDIT_API_KEY}" \
  --data '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

## 4. Valide as duas camadas

```javascript
if (!response.ok) {
  // Corrija autenticação, saldo, código ou payload conforme o status HTTP.
}

if (body.status !== 'success') {
  // A API respondeu, mas a fonte consultada não entregou sucesso.
}
```

## 5. Registre o custo

Use `cost` para acompanhar gasto, margem e divergências por integração.

## Exemplo completo em Python

```python
import os
from typing import Any

import requests

BASE_URL = os.environ.get(
    "BLUE_CREDIT_API_URL",
    "https://api.conexaoazul.com/api/v1",
)
API_KEY = os.environ["BLUE_CREDIT_API_KEY"]


def query_credit(integration_code: str, document: str) -> dict[str, Any]:
    response = requests.post(
        f"{BASE_URL}/credit/query",
        headers={
            "Accept": "application/json",
            "HTTP-API-KEY": API_KEY,
        },
        json={
            "integration_code": integration_code,
            "document": document,
        },
        timeout=(5, 25),
    )

    response.raise_for_status()
    payload: dict[str, Any] = response.json()

    if payload.get("status") != "success":
        raise RuntimeError(
            f"Consulta sem sucesso: {payload.get('error')}; "
            f"custo={payload.get('cost')}"
        )

    return payload


result = query_credit("cnpj_completo", "11222333000181")
print(result["data"])
print("Custo:", result["cost"])
```

## Checklist antes de produção

- [ ] A chave está somente no backend e em cofre de segredos.
- [ ] O documento é validado e mascarado nos logs.
- [ ] O catálogo é consultado ou atualizado periodicamente.
- [ ] Timeout e retries são limitados.
- [ ] Consultas duplicadas são bloqueadas.
- [ ] `status`, `error` e `cost` são tratados.
- [ ] O consumo é monitorado por cliente e integração.
- [ ] Há procedimento para revogar uma chave vazada.

Próximo passo: leia [Respostas e erros](/pt/respostas-erros) e [Limites e boas práticas](/pt/boas-praticas).
