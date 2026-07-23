# Migração para `docs.conexaoazul.com`

Este checklist separa a documentação pública do hostname da API sem alterar o serviço Odoo/FastAPI.

## Estado desejado

| Hostname | Destino |
|---|---|
| `docs.conexaoazul.com` | Cloudflare Pages deste repositório |
| `api.conexaoazul.com` | Serviço exclusivo da API |
| `data.conexaoazul.com` | Portal e aplicação Odoo |

## Antes do merge

- Confirme no Cloudflare Pages o build command `pnpm build`.
- Confirme o publish directory `docs/.vitepress/dist`.
- Confirme que a branch de produção é `main`.
- Verifique que não existe outro projeto usando `docs.conexaoazul.com`.

## Cutover

1. Faça merge da PR que altera o VitePress para `base: /`.
2. Aguarde o deployment da branch `main` ficar verde no Cloudflare Pages.
3. Adicione `docs.conexaoazul.com` em **Workers & Pages → projeto → Custom domains**.
4. Valide diretamente:
   - `https://docs.conexaoazul.com/`
   - `https://docs.conexaoazul.com/pt/`
   - `https://docs.conexaoazul.com/openapi.json`
   - `https://docs.conexaoazul.com/pt/api-reference`
5. Remova a rota Worker que publica `api.conexaoazul.com/doc*`.
6. Remova regras antigas de rewrite, cache ou bypass específicas de `/doc*`.
7. Crie um redirect permanente de compatibilidade:

   ```text
   https://api.conexaoazul.com/doc
   → https://docs.conexaoazul.com/

   https://api.conexaoazul.com/doc/*
   → https://docs.conexaoazul.com/*
   ```

8. Faça purge do cache das URLs antigas `/doc*`.
9. Teste em janela anônima e em outro dispositivo para evitar falso positivo de cache local.

## Critérios de aceite

- A documentação não pisca nem redireciona para o Odoo.
- A navegação permanece em `docs.conexaoazul.com`.
- O Scalar carrega `/openapi.json` sem erro.
- `api.conexaoazul.com/api/v1/credit/integrations` continua respondendo.
- `api.conexaoazul.com/doc/*` responde somente com redirect permanente.
- Nenhuma regra `/doc*` encaminha tráfego ao Odoo.

## Rollback

Caso o domínio customizado não responda:

1. reative temporariamente o deployment anterior do Pages;
2. não reverta o hostname da API para servir conteúdo estático;
3. use a URL `pages.dev` apenas para diagnóstico interno;
4. corrija o custom domain e repita os testes antes de remover o redirect temporário.
