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
  database-connect.ts
  server.ts
.gitignore
bun.lock
package.json
tsconfig.json
README.md
```

Os arquivos `.gitkeep` permitem versionar pastas ainda vazias.
Controllers e middleware serão implementados quando houver operações de dados.

## Etapa 2 — Banco de dados

A conexão fica em `src/database-connect.ts`, usando `Database` de `bun:sqlite`
e exportando `db`, como no exemplo do professor. O servidor importa esse arquivo
para criar automaticamente `database.sqlite` na pasta do projeto ao iniciar.
`CREATE TABLE IF NOT EXISTS` permite reiniciar sem recriar as tabelas existentes.
O arquivo SQLite é local e está ignorado pelo Git.

| Tabela | Campos | Relacionamento |
| --- | --- | --- |
| categorias | id, nome | Uma categoria pode ter vários contatos |
| contatos | id, nome, email, categoria_id | categoria_id referencia categorias(id) |
| telefones | id, contato_id, numero, tipo | contato_id referencia contatos(id) |
| enderecos | id, contato_id, rua, cidade, estado | contato_id referencia contatos(id) |

Todas as tabelas possuem chave primária inteira com incremento automático.
O nome é obrigatório em categorias e contatos; email e categoria são opcionais.
Os telefones e endereços exigem um contato existente e todos os seus campos
descritivos. O número é texto para preservar zeros, sinal de `+` e formatação.

`PRAGMA foreign_keys = ON` ativa a verificação dos relacionamentos na conexão.
Um contato pode ter vários telefones e endereços. Por enquanto, excluir uma
categoria ou contato referenciado é bloqueado pelo SQLite; não há exclusão
automática dos registros relacionados.

Esta etapa contém somente a estrutura do banco, sem dados iniciais, CRUDs
ou mudanças na interface.

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

Commit da etapa 1:

```text
chore: estrutura inicial da agenda telefonica
```

Commit sugerido para a etapa 2:

```text
feat: cria tabelas e relacionamentos da agenda telefonica
```
