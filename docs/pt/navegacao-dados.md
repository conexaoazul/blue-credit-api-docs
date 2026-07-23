---
title: Integrações e preços
description: Como consultar o catálogo público e identificar código, documento aceito e preço aplicável.
---

# Integrações e preços

O catálogo oficial é retornado em tempo real por:

```text
GET https://api.conexaoazul.com/api/v1/credit/integrations
```

Esse endpoint é público, gratuito e deve ser considerado a **fonte de verdade** para integrações ativas e tabelas de referência. Evite manter uma cópia permanente dos valores em código, proposta ou banco de dados sem uma rotina de atualização.

## Consultar o catálogo

```bash
curl --fail-with-body --silent --show-error \
  https://api.conexaoazul.com/api/v1/credit/integrations \
  | python3 -m json.tool
```

## Campos de cada integração

| Campo | Significado |
|---|---|
| `code` | Código enviado em `integration_code` |
| `name` | Nome comercial da consulta |
| `category` | Categoria funcional da integração |
| `document_type` | Tipo aceito, como `cpf`, `cnpj`, `placa`, `both` ou outro informado no catálogo |
| `document_param_name` | Nome semântico usado pela integração; no endpoint unificado, envie o valor em `document` |
| `price_nivel_1` | Tabela de referência de nível 1 |
| `price_nivel_2` | Tabela de referência de nível 2 |

## Integrações econômicas validadas

Em 22 de julho de 2026, o catálogo de produção retornava 35 integrações ativas. As cinco de menor preço no nível 1 eram:

| Código | Nome | Preço N1 |
|---|---|---:|
| `cnpj_completo` | CNPJ Completo | R$ 0,105 |
| `cpf_simples` | CPF Simples | R$ 0,165 |
| `fipe` | FIPE | R$ 0,18 |
| `cenprot_v2` | CENPROT V2 | R$ 0,66 |
| `ic-cpf-completo` | IC CPF Completo | R$ 1,21 |

::: warning Valores podem mudar
A tabela acima é apenas uma referência histórica. Consulte o endpoint antes de exibir preço ao usuário, calcular margem ou executar uma consulta.
:::

## Tabelas e valor efetivamente debitado

Os campos `price_nivel_1` e `price_nivel_2` apresentam as tabelas disponíveis no catálogo. A condição comercial ativa depende da configuração operacional da conta e do provedor.

Não escolha localmente qual tabela será cobrada. Depois da consulta, use o campo `cost` da resposta como fonte de verdade para conciliação, margem e monitoramento.

Não presuma que `price_nivel_2` está disponível ou é menor em todos os itens. Confirme condições de volume com a Conexão Azul antes de prometer valores ao usuário final.

## Filtrar e ordenar em JavaScript

```javascript
const response = await fetch(
  'https://api.conexaoazul.com/api/v1/credit/integrations'
)

if (!response.ok) {
  throw new Error(`Falha ao carregar catálogo: HTTP ${response.status}`)
}

const integrations = await response.json()

const cheapest = [...integrations]
  .filter((item) => Number.isFinite(item.price_nivel_1))
  .sort((a, b) => a.price_nivel_1 - b.price_nivel_1)
  .slice(0, 5)

console.table(cheapest)
```

## Estratégia de cache

O catálogo pode ser cacheado no seu backend por um período curto, por exemplo entre 15 minutos e 1 hora, para reduzir chamadas repetidas. Atualize imediatamente quando sua operação depender de uma alteração de preço ou de uma nova integração.

## Evite estes erros

- Não use o `name` no lugar de `code`.
- Não envie um CPF para integração que exige placa ou CNPJ.
- Não fixe o preço da consulta na interface sem data de atualização.
- Não interprete `document_param_name` como um campo adicional do body. O endpoint unificado recebe `document`.
- Não selecione localmente o nível de preço como se fosse uma opção do request.
- Não prometa condições de volume antes da confirmação comercial.

Para contratar volume ou confirmar uma integração específica, contate `ola@conexaoazul.com`.
