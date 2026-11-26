import type { Context } from "hono"
import { db } from "../database-connect"

export const create = async (c: Context) => {
  const body = await c.req.json()
  const contato = db.query("SELECT id FROM contatos WHERE id=:id")
    .get({ ":id": body.contato_id })
  if (!contato)
    return c.json("Contato não encontrado", { status: 400 })

  const query = db.query(`
    INSERT INTO telefones (contato_id, numero, tipo)
    VALUES (:contato_id, :numero, :tipo)
  `)
  const resp = query.run({
    ":contato_id": body.contato_id,
    ":numero": body.numero,
    ":tipo": body.tipo
  })
  return c.json(resp, { status: 201 })
}

export const listAll = (c: Context) => {
  const query = db.query("SELECT * FROM telefones")
  const data = query.all()
  return c.json(data)
}

export const listOne = (c: Context) => {
  const query = db.query("SELECT * FROM telefones WHERE id=:id")
  const data = query.get({ ":id": Number(c.req.param("id")) })
  if (!data)
    return c.json("Telefone não encontrado", { status: 404 })
  return c.json(data)
}

export const updateOne = async (c: Context) => {
  const body = await c.req.json()
  const telefone = db.query("SELECT id FROM telefones WHERE id=:id")
    .get({ ":id": Number(c.req.param("id")) })
  if (!telefone)
    return c.json("Telefone não encontrado", { status: 404 })

  const contato = db.query("SELECT id FROM contatos WHERE id=:id")
    .get({ ":id": body.contato_id })
  if (!contato)
    return c.json("Contato não encontrado", { status: 400 })

  const query = db.query(`
    UPDATE telefones SET contato_id=:contato_id, numero=:numero, tipo=:tipo
    WHERE id=:id
  `)
  const data = query.run({
    ":id": Number(c.req.param("id")),
    ":contato_id": body.contato_id,
    ":numero": body.numero,
    ":tipo": body.tipo
  })
  return c.json(data)
}

export const deleteOne = (c: Context) => {
  const query = db.query("DELETE FROM telefones WHERE id=:id")
  const data = query.run({ ":id": Number(c.req.param("id")) })
  if (data.changes > 0)
    return c.body(null, 204)
  return c.json("Telefone não encontrado", { status: 404 })
}
