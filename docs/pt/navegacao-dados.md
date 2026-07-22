---
title: Integrações, Categorias e Preços
description: Catálogo completo das integrações da Blue Credit API, agrupadas por categoria, com preços por nível.
---

## 📚 Como ler o catálogo de integrações

`GET /credit/integrations` retorna todas as integrações disponíveis. Cada item tem:

<ApiCard
  title="Integration"
  :items="[
    { key: 'code', description: 'Código único — use este valor em <code>integration_code</code> no <code>POST /credit/query</code>.', color: 'blue' },
    { key: 'category', description: 'Agrupamento temático: cadastral, veicular, protestos, dividas_credito, score, juridico, outros.', color: 'purple' },
    { key: 'document_type', description: '<code>cpf</code>, <code>cnpj</code>, <code>placa</code> ou <code>both</code> (aceita CPF ou CNPJ) — indica o formato esperado em <code>document</code>.', color: 'pink' },
    { key: 'document_param_name', description: 'Nome semântico do parâmetro de documento nessa integração (informativo — o campo enviado no body é sempre <code>document</code>).', color: 'green' },
    { key: 'price_nivel_1', description: 'Preço padrão (R$) debitado por consulta.', color: 'yellow' },
    { key: 'price_nivel_2', description: 'Preço com desconto por volume, aplicado apenas a contas habilitadas.', color: 'yellow' }
  ]"
/>

## 💰 Nível 1 vs. Nível 2

Toda conta começa no **Nível 1** (`price_nivel_1`). O **Nível 2** é um preço reduzido por volume que precisa ser habilitado manualmente pelo time da Conexão Azul.

::: tip Como habilitar o Nível 2
Solicite em `ola@conexaoazul.com` — sua conta precisa estar marcada como `price_level = nivel_2` no cadastro do parceiro. Depois de habilitada, toda consulta passa a debitar automaticamente `price_nivel_2` em vez de `price_nivel_1`, sem nenhuma mudança necessária na integração.
:::

::: warning Alguns códigos ainda não têm Nível 2 configurado
Integrações recém-adicionadas ao catálogo podem retornar `price_nivel_2: 0`. Nesse caso, todas as contas — inclusive as habilitadas no Nível 2 — são cobradas pelo `price_nivel_1` até a precificação de volume ser configurada.
:::

## 🗂️ Catálogo completo por categoria

Lista das integrações ativas em produção, ordenadas por preço dentro de cada categoria. Consulte sempre `GET /credit/integrations` para os valores mais atuais — preços podem mudar sem alterar esta página.

### Cadastral

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `cnpj_completo` | CNPJ Completo | `cnpj` | R$ 0,105 | R$ 0,060 |
| `cpf_simples` | CPF Simples | `cpf` | R$ 0,165 | R$ 0,090 |
| `ic-cpf-completo` | IC CPF Completo | `both` | R$ 1,210 | R$ 0,660 |
| `cpf_ultra_completo` | CPF Ultra Completo | `cpf` | R$ 1,935 | R$ 1,485 |
| `busca_pelo_nome` | Busca pelo Nome | `cpf` | R$ 2,475 | R$ 1,650 |

### Veicular

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `fipe` | Fipe | `placa` | R$ 0,180 | R$ 0,120 |
| `gravame` | Gravame | `placa` | R$ 3,630 | R$ 3,300 |
| `bin_estadual` | BIN Estadual | `placa` | R$ 4,560 | R$ 3,795 |
| `bin_nacional` | BIN Nacional | `placa` | R$ 4,950 | R$ 2,970 |
| `certificado_seguranca_veicular` | Certificado de Segurança Veicular | `placa` | R$ 5,580 | R$ 6,200 |
| `historico_roubo_furto` | Histórico de Roubo e Furto | `placa` | R$ 5,940 | R$ 4,950 |
| `recall` | Recall | `placa` | R$ 5,940 | R$ 4,950 |
| `renainf` | RENAINF (Multas) | `placa` | R$ 12,750 | R$ 10,800 |
| `renajud` | RENAJUD (Restrições) | `placa` | R$ 12,750 | R$ 10,800 |
| `leilao` | Leilão | `placa` | R$ 14,460 | R$ 12,045 |
| `foto_leilao` | Foto Leilão | `placa` | R$ 19,800 | R$ 16,500 |
| `agregados_propria` | Agregados Básica Própria | `placa` | R$ 22,500 | R$ 19,200 |
| `crlv` | CRLV | `placa` | R$ 33,465 | R$ 27,885 |

### Protestos

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `cenprot_v2` | CENPROT V2 | `both` | R$ 0,660 | R$ 0,495 |
| `ac-protesto` | AC Protesto | `both` | R$ 8,000 | *não configurado* |

### Dívidas & Crédito

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `e-boavista` | Cred Completa Plus | `cpf` | R$ 4,110 | R$ 3,945 |
| `dados_score_dividas` | Dados Cadastrais, Score e Dívidas | `cpf` | R$ 4,560 | R$ 3,795 |
| `dados_score_dividas_cp` | Dados Cadastrais, Score e Dívidas CP | `cpf` | R$ 4,935 | R$ 4,110 |
| `boa_vista_essencial_positivo` | Boa Vista Essencial Positivo | `cpf` | R$ 5,325 | R$ 4,440 |
| `quod` | QUOD | `both` | R$ 7,890 | R$ 6,570 |
| `serasa-basica` | Serasa Relatório Básico | `cpf` | R$ 8,910 | R$ 7,425 |
| `serasa-premium` | Serasa Premium | `cpf` | R$ 11,490 | R$ 9,570 |
| `spc_brasil` | SPC Brasil | `cpf` | R$ 14,235 | R$ 11,865 |

### Score

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `scr_score_bacen_v2` | SCR e Score (BACEN) V2 | `cpf` | R$ 15,450 | R$ 12,870 |

### Jurídico

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `certidao_debitos_trabalhistas` | Certidão Nacional de Débitos Trabalhistas | `both` | R$ 11,880 | R$ 9,900 |
| `dossie_juridico` | Dossiê Jurídico | `both` | R$ 19,410 | R$ 16,170 |

### Outros

| Código | Nome | Documento | Preço N1 | Preço N2 |
|---|---|---|---|---|
| `busca-documentos` | Busca por Documentos | `both` | R$ 1,490 | R$ 0,830 |

## 🔄 Sem paginação, HATEOAS ou sincronização em tempo real

A Blue Credit API é intencionalmente simples: os dois endpoints retornam a resposta completa em uma única chamada, sem `page`/`size` nem links de navegação (`_link`). Não é indicada para sincronização contínua em massa de bases — cada chamada é uma consulta pontual e paga.

::: tip Precisa de volume alto ou sync contínuo?
Fale com o time comercial em `ola@conexaoazul.com` para avaliar um plano dedicado.
:::
