# Agenda Telefônica

Trabalho acadêmico de Desenvolvimento Web II, do curso de Sistemas de Informação.

## Etapa 1 — Estrutura inicial

Servidor HTTP com Bun, TypeScript e Hono, exibindo uma página HTML inicial.
ArkType está instalado para as validações das próximas etapas.

O projeto segue o [exemplo do professor](https://github.com/prfdnl/2026-bsi24-webdev2):
`Bun.serve`, importação direta do HTML, aplicação Hono e agrupamento de rotas.
Foram analisados `src/controllers/usuario.ts`, `src/routes/usuario.ts`,
`src/routes/index.ts`, `src/database-connect.ts`, `src/server.ts`,
`src/middleware/inputTest.ts` e `public/index.html`, além das configurações.

```text
public/
  index.html
src/
  controllers/
    .gitkeep
  middleware/
    .gitkeep
  routes/
    index.ts
  server.ts
.gitignore
bun.lock
package.json
tsconfig.json
README.md
```

Os arquivos `.gitkeep` permitem versionar pastas ainda vazias.
Controllers e middleware serão implementados quando houver operações de dados.
A conexão `src/database-connect.ts`, com `bun:sqlite`, será criada na etapa 2,
seguindo o arquivo do professor. Nesta etapa não há banco, tabelas ou CRUDs.

O TypeScript é uma dependência de desenvolvimento para conferir os tipos;
o Bun executa os arquivos `.ts` diretamente. A configuração segue o exemplo,
sem a opção JSX, pois a interface usa HTML simples.

## Executar

Instale o [Bun](https://bun.sh) e, na pasta do projeto, execute:

```sh
bun install
bun run start
```

Acesse http://localhost:3000. A página deve mostrar o título **Agenda Telefônica**.
Para encerrar o servidor, use `Ctrl+C`.

Durante o desenvolvimento, use `bun run dev` para recarregar o servidor ao editar.

## Verificar

Confira os tipos:

```sh
bun run typecheck
```

Com o servidor em execução, confira a resposta HTTP no PowerShell:

```powershell
(Invoke-WebRequest -UseBasicParsing http://localhost:3000).StatusCode
```

O resultado esperado é `200`. Uma rota inexistente, como `/inexistente`,
deve responder `404`.

## Histórico

Commit sugerido para esta etapa:

```text
chore: estrutura inicial da agenda telefonica
```
