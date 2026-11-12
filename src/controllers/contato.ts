import type { Context } from "hono"
import { db } from "../database-connect"

export const create = async (c: Context) => {
  const body = await c.req.json()
  if (body.categoria_id != null) {
    const categoria = db.query("SELECT id FROM categorias WHERE id=:id")
      .get({ ":id": body.categoria_id })
    if (!categoria)
      return c.json("Categoria não encontrada", { status: 400 })
  }

  const query = db.query(`
    INSERT INTO contatos (nome, email, categoria_id)
    VALUES (:nome, :email, :categoria_id)
  `)
  const resp = query.run({
    ":nome": body.nome,
    ":email": body.email ?? null,
    ":categoria_id": body.categoria_id ?? null
  })
  return c.json(resp, { status: 201 })
}

export const listAll = (c: Context) => {
  const query = db.query("SELECT * FROM contatos")
  const data = query.all()
  return c.json(data)
}

export const listOne = (c: Context) => {
  const query = db.query("SELECT * FROM contatos WHERE id=:id")
  const data = query.get({ ":id": Number(c.req.param("id")) })
  if (!data)
    return c.json("Contato não encontrado", { status: 404 })
  return c.json(data)
}

export const updateOne = async (c: Context) => {
  const body = await c.req.json()
  const contato = db.query("SELECT id FROM contatos WHERE id=:id")
    .get({ ":id": Number(c.req.param("id")) })
  if (!contato)
    return c.json("Contato não encontrado", { status: 404 })

  if (body.categoria_id != null) {
    const categoria = db.query("SELECT id FROM categorias WHERE id=:id")
      .get({ ":id": body.categoria_id })
    if (!categoria)
      return c.json("Categoria não encontrada", { status: 400 })
  }

  const query = db.query(`
    UPDATE contatos SET nome=:nome, email=:email, categoria_id=:categoria_id
    WHERE id=:id
  `)
  const data = query.run({
    ":id": Number(c.req.param("id")),
    ":nome": body.nome,
    ":email": body.email ?? null,
    ":categoria_id": body.categoria_id ?? null
  })
  return c.json(data)
}

export const deleteOne = (c: Context) => {
  const id = Number(c.req.param("id"))
  const telefone = db.query("SELECT id FROM telefones WHERE contato_id=:id")
    .get({ ":id": id })
  const endereco = db.query("SELECT id FROM enderecos WHERE contato_id=:id")
    .get({ ":id": id })
  if (telefone || endereco)
    return c.json("O contato possui telefones ou endereços vinculados", { status: 409 })

  const query = db.query("DELETE FROM contatos WHERE id=:id")
  const data = query.run({ ":id": id })
  if (data.changes > 0)
    return c.body(null, 204)
  return c.json("Contato não encontrado", { status: 404 })
}
