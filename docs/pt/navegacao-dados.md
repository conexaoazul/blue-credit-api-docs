---
title: Integrações e preços
description: Como consultar o catálogo público e identificar código, documento aceito e preço aplicável.
---

# Integrações e preços

O catálogo oficial é retornado em tempo real por:

```text
GET https://api.conexaoazul.com/api/v1/credit/integrations
```

Esse endpoint é público, gratuito e deve ser considerado a **fonte de verdade** para integrações ativas e preços. Evite manter uma cópia permanente dos valores em código, proposta ou banco de dados sem uma rotina de atualização.

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
| `price_nivel_1` | Preço padrão por consulta |
| `price_nivel_2` | Preço aplicado a contas habilitadas no nível 2, conforme configuração comercial |

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

## Nível 1 e nível 2

- **Nível 1:** preço padrão da conta.
- **Nível 2:** preço definido para contas habilitadas comercialmente.

A conta precisa estar configurada com `price_level = nivel_2` para usar o segundo valor. Essa configuração é feita pela Conexão Azul e não altera o payload da integração.

Não presuma que `price_nivel_2` está disponível ou é menor em todos os itens. Use o preço efetivamente retornado e confirmado para sua conta.

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
- Não prometa nível 2 antes da habilitação da conta.

Para contratar volume, habilitar nível 2 ou confirmar uma integração específica, contate `ola@conexaoazul.com`.
