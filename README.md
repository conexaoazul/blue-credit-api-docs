# Blue Credit API Docs

Documentação pública da **Blue Credit API**, construída com VitePress e Scalar.

## URLs públicas

- Documentação: `https://api.conexaoazul.com/doc/`
- OpenAPI 3.0.3: `https://api.conexaoazul.com/doc/openapi.json`
- API: `https://api.conexaoazul.com/api/v1`

## Contrato atual

| Método | Endpoint | Autenticação | Cobrança |
|---|---|---|---|
| `GET` | `/credit/integrations` | Pública | Gratuita |
| `POST` | `/credit/query` | Header `HTTP-API-KEY` | Conforme integração e conta |

O catálogo ao vivo é a fonte de verdade para integrações ativas e preços. Não mantenha uma lista completa estática na documentação.

## Desenvolvimento

Requisitos:

- Node.js 18 ou superior
- pnpm 8.15.5

```bash
pnpm install --frozen-lockfile
pnpm dev
```

O site usa `base: /doc/`. Teste links e recursos dentro desse subpath.

## Validação

```bash
pnpm build
```

A saída é gerada em `docs/.vitepress/dist`.

Antes de publicar:

1. confirme que `docs/public/openapi.json` representa o comportamento real;
2. valide que `/credit/integrations` permanece público;
3. não publique API keys, documentos reais ou respostas com dados pessoais;
4. use exemplos fictícios ou documentos de teste autorizados;
5. revise preços contra o catálogo ao vivo;
6. confirme que todos os links funcionam em `/doc/`;
7. execute o build local ou aguarde o CI.

## Organização

- `docs/pt/`: conteúdo público revisado em português;
- `docs/public/openapi.json`: contrato usado pelo Scalar;
- `docs/.vitepress/config.ts`: navegação, tema e base do deploy;
- `docs/.vitepress/components/ScalarApi.vue`: referência interativa.

As traduções herdadas do starter estão excluídas do build até receberem tradução e revisão técnica completas.

## Deploy

O projeto é publicado pelo Cloudflare Pages a cada atualização da branch `main`.

- Build command: `pnpm build`
- Publish directory: `docs/.vitepress/dist`

O domínio público serve o Pages no subpath `/doc/`.

## Segurança

- Nunca inclua chaves reais em Markdown, OpenAPI, commits, issues ou screenshots.
- Se uma chave for publicada, trate-a como comprometida e solicite revogação.
- Consulte [SECURITY.md](SECURITY.md) para reporte responsável.

## Suporte

`ola@conexaoazul.com`

---

Conexão Azul Digital
