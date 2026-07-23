# Política de segurança

## Reporte responsável

Para relatar exposição de credencial, acesso indevido, comportamento inesperado de autenticação ou outra vulnerabilidade relacionada à Blue Credit API, envie uma descrição para:

`ola@conexaoazul.com`

Inclua somente o necessário para reproduzir o problema. Não abra issue pública com:

- API keys;
- CPF, CNPJ, placa ou dados pessoais completos;
- respostas reais de consultas;
- detalhes que permitam exploração imediata.

## Credencial exposta

Uma chave publicada em commit, log, frontend, print, ticket ou mensagem deve ser considerada comprometida. Solicite a revogação e a emissão de uma nova chave, remova a exposição e revise os acessos realizados.

Apagar a chave do arquivo atual não a remove automaticamente do histórico do Git.

## Escopo deste repositório

Este repositório contém apenas a documentação pública e o contrato OpenAPI. Problemas na API, autenticação, cobrança ou providers devem ser reportados pelo mesmo canal, com indicação do endpoint e horário aproximado, sem dados sensíveis completos.

## Boas práticas para contribuições

- Use apenas placeholders como `SUA_CHAVE`.
- Não publique documentos ou respostas reais.
- Não adicione endpoints internos, regras de firewall ou detalhes de infraestrutura desnecessários ao cliente.
- Confirme o comportamento da API antes de alterar autenticação, cobrança ou códigos de erro.
- Execute o build e revise o OpenAPI antes do merge.
