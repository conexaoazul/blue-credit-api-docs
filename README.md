# Blue Credit API Documentation

Documentação interativa da **Blue Credit API** (`api.conexaoazul.com/api/v1`) usando VitePress + Scalar.

## Stack

- [VitePress](https://vitepress.dev/) — site estático
- [Scalar](https://scalar.com/) — referência interativa OpenAPI
- [Vue 3](https://vuejs.org/) + TypeScript

## Desenvolvimento

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

Saída em `docs/.vitepress/dist`.

## Deploy

O site é estático e pode ser publicado em qualquer host estático (Cloudflare Pages, Vercel, Netlify, GitHub Pages, S3).

- Build command: `pnpm run build`
- Publish directory: `docs/.vitepress/dist`

## OpenAPI

A especificação OpenAPI está em `docs/public/openapi.json` e lista as 35 integrações disponíveis, com exemplos das 5 integrações mais econômicas testadas.

## Repositório original

Fork de [rafactx/api-docs-starter](https://github.com/rafactx/api-docs-starter).

---

Conexão Azul Digital · `ola@conexaoazul.com`
