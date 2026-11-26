# Agenda Telefônica

Trabalho acadêmico de Desenvolvimento Web II, do curso de Sistemas de Informação.

## Etapa 1 — Estrutura inicial

Servidor HTTP com Bun, TypeScript e Hono, exibindo uma página HTML inicial.
ArkType é usado para validar os dados recebidos pelas rotas.

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
    categoria.ts
    contato.ts
    endereco.ts
    telefone.ts
  middleware/
    inputTest.ts
  routes/
    categoria.ts
    contato.ts
    endereco.ts
    telefone.ts
    index.ts
  database-connect.ts
  server.ts
.gitignore
bun.lock
package.json
tsconfig.json
README.md
```

Os controllers executam SQL, as rotas associam os caminhos às funções e
o middleware valida a entrada, seguindo a organização do professor.

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

## Etapa 3 — CRUD de contatos

`src/controllers/contato.ts` exporta `create`, `listAll`, `listOne`,
`updateOne` e `deleteOne`. As consultas usam SQL com parâmetros nomeados,
como no exemplo do professor. `src/routes/contato.ts` define as rotas e
`src/routes/index.ts` as reúne na aplicação.

O middleware `ffInputType`, em `src/middleware/inputTest.ts`, segue o exemplo
com ArkType. Também trata JSON inválido e permite validar parâmetros de rotas
GET e DELETE sem exigir um corpo JSON.

| Método | Caminho | Operação | Sucesso |
| --- | --- | --- | --- |
| POST | /contato | Cadastrar | 201, resultado da inserção com lastInsertRowid |
| GET | /contato | Listar todos | 200, lista de contatos |
| GET | /contato/:id | Consultar um | 200, contato |
| PUT | /contato/:id | Editar | 200, resultado da atualização |
| DELETE | /contato/:id | Excluir | 204, sem corpo |

No cadastro e na edição, `nome` é obrigatório e não pode ser vazio.
`email` é opcional e deve ser válido quando informado; `categoria_id` é
opcional e deve ser um inteiro positivo correspondente a uma categoria existente.
Ambos aceitam `null`. O PUT substitui os campos: email e categoria omitidos
ficam `null`. Os IDs da URL são validados como strings numéricas.

Entradas inválidas retornam 400; contatos inexistentes retornam 404.
A exclusão de um contato com telefones ou endereços vinculados retorna 409.
Ainda não há interface de cadastro.

Com o servidor iniciado, teste no PowerShell:

```powershell
$body = @{ nome = "Maria"; email = "maria@example.com" } | ConvertTo-Json
$novo = Invoke-RestMethod -Method Post -Uri http://localhost:3000/contato -ContentType 'application/json' -Body $body
$contatoId = $novo.lastInsertRowid
Invoke-RestMethod http://localhost:3000/contato
Invoke-RestMethod "http://localhost:3000/contato/$contatoId"
$body = @{ nome = "Maria Silva" } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/contato/$contatoId" -ContentType 'application/json' -Body $body
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/contato/$contatoId"
```

Esses comandos cadastram um contato real e o removem ao final.

## Etapa 4 — CRUD de telefones

`src/controllers/telefone.ts` mantém as funções `create`, `listAll`, `listOne`,
`updateOne` e `deleteOne`, com SQL parametrizado. As rotas ficam em
`src/routes/telefone.ts` e usam o mesmo middleware ArkType dos contatos.

| Método | Caminho | Operação | Sucesso |
| --- | --- | --- | --- |
| POST | /telefone | Cadastrar | 201, resultado com lastInsertRowid |
| GET | /telefone | Listar todos | 200, lista de telefones |
| GET | /telefone/:id | Consultar um | 200, telefone |
| PUT | /telefone/:id | Editar | 200, resultado da atualização |
| DELETE | /telefone/:id | Excluir | 204, sem corpo |

Cadastro e edição exigem `contato_id` inteiro positivo de um contato existente,
`numero` e `tipo` como textos não vazios. O número preserva zeros, sinal de `+`
e formatação; o tipo é livre, por exemplo `celular`, `fixo` ou `comercial`.
O PUT exige os três campos e permite transferir o telefone para outro contato.
Um contato pode ter vários telefones.

Entradas inválidas e contatos associados inexistentes retornam 400.
Telefones inexistentes retornam 404. Excluir um telefone preserva seu contato;
para excluir um contato, remova antes os telefones e endereços vinculados.
A interface continua para uma próxima etapa.

Com o servidor iniciado, teste no PowerShell:

```powershell
$body = @{ nome = "Teste telefone" } | ConvertTo-Json
$contato = Invoke-RestMethod -Method Post -Uri http://localhost:3000/contato -ContentType 'application/json' -Body $body
$contatoId = $contato.lastInsertRowid
$body = @{ contato_id = $contatoId; numero = "+55 11 99999-0000"; tipo = "celular" } | ConvertTo-Json
$telefone = Invoke-RestMethod -Method Post -Uri http://localhost:3000/telefone -ContentType 'application/json' -Body $body
$telefoneId = $telefone.lastInsertRowid
Invoke-RestMethod http://localhost:3000/telefone
Invoke-RestMethod "http://localhost:3000/telefone/$telefoneId"
$body = @{ contato_id = $contatoId; numero = "011 3333-0000"; tipo = "fixo" } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/telefone/$telefoneId" -ContentType 'application/json' -Body $body
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/telefone/$telefoneId"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/contato/$contatoId"
```

Esses comandos criam registros reais e os removem ao final.

## Etapa 5 — Categorias e endereços

Os controllers `src/controllers/categoria.ts` e `src/controllers/endereco.ts`
usam `create`, `listAll`, `listOne`, `updateOne` e `deleteOne`, com SQL
parametrizado e a conexão existente. Cada tabela tem seu arquivo em `src/routes`,
registrado em `src/routes/index.ts`, com validação pelo mesmo middleware ArkType.

| Método | Categorias | Endereços | Sucesso |
| --- | --- | --- | --- |
| POST | /categoria | /endereco | 201, resultado com lastInsertRowid |
| GET | /categoria | /endereco | 200, lista de registros |
| GET | /categoria/:id | /endereco/:id | 200, registro |
| PUT | /categoria/:id | /endereco/:id | 200, resultado da atualização |
| DELETE | /categoria/:id | /endereco/:id | 204, sem corpo |

Categorias exigem `nome` como texto não vazio. Endereços exigem `contato_id`
inteiro positivo de um contato existente, além de `rua`, `cidade` e `estado`
como textos não vazios. O estado é texto livre, podendo ser sigla ou nome.
O PUT exige todos os campos e permite transferir um endereço para outro contato.
Um contato pode ter vários endereços.

Entradas inválidas e contatos associados inexistentes retornam 400.
Registros inexistentes retornam 404. Excluir uma categoria com contatos
vinculados retorna 409; é necessário remover a categoria desses contatos,
trocá-la ou excluir os contatos antes. Excluir um endereço preserva seu contato.
Não há alterações no banco ou na interface nesta etapa.

Com o servidor iniciado, teste no PowerShell:

```powershell
$body = @{ nome = "Amigos" } | ConvertTo-Json
$categoria = Invoke-RestMethod -Method Post -Uri http://localhost:3000/categoria -ContentType 'application/json' -Body $body
$categoriaId = $categoria.lastInsertRowid
Invoke-RestMethod http://localhost:3000/categoria
Invoke-RestMethod "http://localhost:3000/categoria/$categoriaId"
$body = @{ nome = "Familia" } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/categoria/$categoriaId" -ContentType 'application/json' -Body $body
$body = @{ nome = "Teste endereco"; categoria_id = $categoriaId } | ConvertTo-Json
$contato = Invoke-RestMethod -Method Post -Uri http://localhost:3000/contato -ContentType 'application/json' -Body $body
$contatoId = $contato.lastInsertRowid
$body = @{ contato_id = $contatoId; rua = "Rua A"; cidade = "Campinas"; estado = "SP" } | ConvertTo-Json
$endereco = Invoke-RestMethod -Method Post -Uri http://localhost:3000/endereco -ContentType 'application/json' -Body $body
$enderecoId = $endereco.lastInsertRowid
Invoke-RestMethod http://localhost:3000/endereco
Invoke-RestMethod "http://localhost:3000/endereco/$enderecoId"
$body = @{ contato_id = $contatoId; rua = "Rua B"; cidade = "Campinas"; estado = "SP" } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/endereco/$enderecoId" -ContentType 'application/json' -Body $body
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/endereco/$enderecoId"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/contato/$contatoId"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/categoria/$categoriaId"
```

Esses comandos criam registros reais e os removem ao final.

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

Commit da etapa 2:

```text
feat: cria tabelas e relacionamentos da agenda telefonica
```

Commit da etapa 3:

```text
feat: implementa crud de contatos
```

Commit sugerido para a etapa 4:

```text
feat: implementa crud de telefones
```

Commit sugerido para a etapa 5:

```text
feat: implementa crud de categorias e enderecos
```
