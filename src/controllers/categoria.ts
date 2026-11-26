import type { Context } from "hono"
import { db } from "../database-connect"

export const create = async (c: Context) => {
  const body = await c.req.json()
  const query = db.query("INSERT INTO categorias (nome) VALUES (:nome)")
  const resp = query.run({ ":nome": body.nome })
  return c.json(resp, { status: 201 })
}

export const listAll = (c: Context) => {
  const query = db.query("SELECT * FROM categorias")
  const data = query.all()
  return c.json(data)
}

export const listOne = (c: Context) => {
  const query = db.query("SELECT * FROM categorias WHERE id=:id")
  const data = query.get({ ":id": Number(c.req.param("id")) })
  if (!data)
    return c.json("Categoria não encontrada", { status: 404 })
  return c.json(data)
}

export const updateOne = async (c: Context) => {
  const body = await c.req.json()
  const query = db.query("UPDATE categorias SET nome=:nome WHERE id=:id")
  const data = query.run({
    ":id": Number(c.req.param("id")),
    ":nome": body.nome
  })
  if (data.changes > 0)
    return c.json(data)
  return c.json("Categoria não encontrada", { status: 404 })
}

export const deleteOne = (c: Context) => {
  const id = Number(c.req.param("id"))
  const contato = db.query("SELECT id FROM contatos WHERE categoria_id=:id")
    .get({ ":id": id })
  if (contato)
    return c.json("A categoria possui contatos vinculados", { status: 409 })

  const query = db.query("DELETE FROM categorias WHERE id=:id")
  const data = query.run({ ":id": id })
  if (data.changes > 0)
    return c.body(null, 204)
  return c.json("Categoria não encontrada", { status: 404 })
}
