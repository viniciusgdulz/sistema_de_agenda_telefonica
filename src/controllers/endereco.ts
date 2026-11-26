import type { Context } from "hono"
import { db } from "../database-connect"

export const create = async (c: Context) => {
  const body = await c.req.json()
  const contato = db.query("SELECT id FROM contatos WHERE id=:id")
    .get({ ":id": body.contato_id })
  if (!contato)
    return c.json("Contato não encontrado", { status: 400 })

  const query = db.query(`
    INSERT INTO enderecos (contato_id, rua, cidade, estado)
    VALUES (:contato_id, :rua, :cidade, :estado)
  `)
  const resp = query.run({
    ":contato_id": body.contato_id,
    ":rua": body.rua,
    ":cidade": body.cidade,
    ":estado": body.estado
  })
  return c.json(resp, { status: 201 })
}

export const listAll = (c: Context) => {
  const query = db.query("SELECT * FROM enderecos")
  const data = query.all()
  return c.json(data)
}

export const listOne = (c: Context) => {
  const query = db.query("SELECT * FROM enderecos WHERE id=:id")
  const data = query.get({ ":id": Number(c.req.param("id")) })
  if (!data)
    return c.json("Endereço não encontrado", { status: 404 })
  return c.json(data)
}

export const updateOne = async (c: Context) => {
  const body = await c.req.json()
  const endereco = db.query("SELECT id FROM enderecos WHERE id=:id")
    .get({ ":id": Number(c.req.param("id")) })
  if (!endereco)
    return c.json("Endereço não encontrado", { status: 404 })

  const contato = db.query("SELECT id FROM contatos WHERE id=:id")
    .get({ ":id": body.contato_id })
  if (!contato)
    return c.json("Contato não encontrado", { status: 400 })

  const query = db.query(`
    UPDATE enderecos SET contato_id=:contato_id, rua=:rua, cidade=:cidade, estado=:estado
    WHERE id=:id
  `)
  const data = query.run({
    ":id": Number(c.req.param("id")),
    ":contato_id": body.contato_id,
    ":rua": body.rua,
    ":cidade": body.cidade,
    ":estado": body.estado
  })
  return c.json(data)
}

export const deleteOne = (c: Context) => {
  const query = db.query("DELETE FROM enderecos WHERE id=:id")
  const data = query.run({ ":id": Number(c.req.param("id")) })
  if (data.changes > 0)
    return c.body(null, 204)
  return c.json("Endereço não encontrado", { status: 404 })
}
