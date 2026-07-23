# Migração para `docs.conexaoazul.com`

Este checklist separa a documentação pública do hostname da API sem alterar o serviço Odoo/FastAPI.

## Estado desejado

| Hostname | Destino |
|---|---|
| `docs.conexaoazul.com` | Cloudflare Pages deste repositório |
| `api.conexaoazul.com` | Serviço exclusivo da API |
| `data.conexaoazul.com` | Portal e aplicação Odoo |

## Pré-condições

Antes do cutover:

- a PR da API deve estar implantada;
- o módulo `blue_credit_api` deve ter sido atualizado na base `consultas`;
- a chave antiga deve estar inválida;
- os testes de saldo e `X-Request-ID` devem estar concluídos;
- o preview do Pages e o Docs CI devem estar verdes.

## Antes do merge

- Confirme no Cloudflare Pages o build command `pnpm build`.
- Confirme o publish directory `docs/.vitepress/dist`.
- Confirme que a branch de produção é `main`.
- Verifique que não existe outro projeto usando `docs.conexaoazul.com`.
- Exporte ou registre as regras atuais de Worker, redirect e cache para rollback.

## Cutover

1. Faça merge da PR que altera o VitePress para `base: /`.
2. Aguarde o deployment da branch `main` ficar verde no Cloudflare Pages.
3. Adicione `docs.conexaoazul.com` em **Workers & Pages → projeto → Custom domains**.
4. Valide diretamente:
   - `https://docs.conexaoazul.com/`
   - `https://docs.conexaoazul.com/pt/`
   - `https://docs.conexaoazul.com/openapi.json`
   - `https://docs.conexaoazul.com/pt/api-reference`
5. Confirme certificado válido, assets carregados e ausência de redirect para o Odoo.
6. Remova a rota Worker que publica `api.conexaoazul.com/doc*`.
7. Remova regras antigas de rewrite, cache ou bypass específicas de `/doc*`.
8. Crie um redirect permanente `308` de compatibilidade:

   ```text
   https://api.conexaoazul.com/doc
   → https://docs.conexaoazul.com/

   https://api.conexaoazul.com/doc/
   → https://docs.conexaoazul.com/

   https://api.conexaoazul.com/doc/*
   → https://docs.conexaoazul.com/*
   ```

9. Preserve query string quando a regra utilizada permitir.
10. Faça purge apenas do cache das URLs antigas `/doc*` e de seus assets.
11. Teste em janela anônima e em outro dispositivo para evitar falso positivo de cache local.

## Critérios de aceite

- A documentação não pisca nem redireciona para o Odoo.
- A navegação permanece em `docs.conexaoazul.com`.
- O Scalar carrega `/openapi.json` sem erro.
- `api.conexaoazul.com/api/v1/credit/integrations` continua respondendo.
- `api.conexaoazul.com/doc/*` responde somente com redirect permanente.
- Nenhuma regra `/doc*` encaminha tráfego ao Odoo.
- Nenhuma regra criada para a documentação interfere em `/api/v1/*`.

## Rollback

Caso o domínio customizado ou o redirect apresente falha:

1. desative o redirect novo;
2. restaure temporariamente a rota Worker `/doc*` a partir da configuração registrada antes do cutover;
3. reative o deployment anterior conhecido como saudável, quando aplicável;
4. valide novamente a documentação na URL antiga;
5. mantenha `api.conexaoazul.com/api/v1/*` inalterado;
6. use a URL `pages.dev` apenas para diagnóstico interno;
7. corrija o custom domain e repita os testes antes de realizar um novo cutover.

O rollback da documentação não deve reativar nenhuma chave de API comprometida nem reverter as correções da PR da API.
