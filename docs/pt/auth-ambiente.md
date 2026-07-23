---
title: 'Autenticação e Ambientes'
description: 'Como autenticar na Blue Credit API usando HTTP-API-KEY e quais ambientes estão disponíveis.'
---

## 🔑 Autenticação

A Blue Credit API usa um **único header** para autenticar todas as requisições — não há OAuth, Basic Auth ou fluxo de login:

<ApiCard
  title="request.headers"
  :items="[
    {
      key: 'HTTP-API-KEY',
      description: 'Sua chave de API. Enviada em todas as requisições, inclusive no <code>GET /credit/integrations</code>.',
      color: 'blue'
    },
    {
      key: 'Content-Type',
      description: '<code>application/json</code> — obrigatório em requisições <code>POST</code>.',
      color: 'purple'
    }
  ]"
/>

::: warning Chave inválida ou ausente
Requisições sem `HTTP-API-KEY` ou com uma chave inválida retornam **401 Unauthorized** com `{"detail": "Not authenticated"}`.
:::

### Exemplo

```bash
curl -X POST https://api.conexaoazul.com/api/v1/credit/query \
  -H "HTTP-API-KEY: SUA_CHAVE" \
  -H "Content-Type: application/json" \
  -d '{"integration_code":"cnpj_completo","document":"11222333000181"}'
```

::: tip Chave de demonstração
Solicite uma chave de homologação em `ola@conexaoazul.com` para testar sem afetar o saldo de produção. Não reutilize a mesma chave de homologação entre parceiros diferentes.
:::

## 🌍 Ambientes

<ApiCard
  title="Servidores"
  :items="[
    {
      key: 'Produção',
      description: '<code>https://api.conexaoazul.com/api/v1</code> — consultas reais, debitam saldo do parceiro.',
      color: 'green'
    },
    {
      key: 'Homologação',
      description: '<code>https://api-hml.conexaoazul.com/api/v1</code> — mesmo contrato de API, para testar integrações antes de ir para produção.',
      color: 'blue'
    }
  ]"
/>

Não existe versionamento por header (`Accept-Version`) nem `environmentId` na URL — a versão atual da API é a única disponível, e o ambiente é escolhido pela URL base (produção ou homologação).

## 💳 Como sua chave é cobrada

Cada chave está associada a um saldo pré-pago do parceiro. Toda chamada a `POST /credit/query` debita automaticamente o valor da integração usada (campo `cost` na resposta). Se o saldo for insuficiente, a API retorna **402 Payment Required**.

Para detalhes sobre preços e níveis de desconto por volume, veja [Integrações, Categorias e Preços](/pt/navegacao-dados).

## 🔐 Segurança

::: warning Atenção
- Nunca commite sua `HTTP-API-KEY` em repositórios de código.
- Armazene a chave em variáveis de ambiente ou em um cofre de segredos.
- Use a chave de homologação (`api-hml`) para testes automatizados e CI, e reserve a chave de produção para tráfego real.
- Se suspeitar que uma chave vazou, solicite a revogação e emissão de uma nova em `ola@conexaoazul.com`.
:::
