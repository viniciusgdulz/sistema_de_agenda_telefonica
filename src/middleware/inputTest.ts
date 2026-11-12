import { type } from 'arktype'
import type { Context, Next } from 'hono'

export function ffInputType(schema: any) {
  return async function(c: Context, next: Next) {
    let body = {}
    if (c.req.method === 'POST' || c.req.method === 'PUT') {
      try {
        body = await c.req.json()
      } catch {
        return c.json("JSON inválido", { status: 400 })
      }
      if (body === null || typeof body !== 'object' || Array.isArray(body))
        return c.json("O corpo deve ser um objeto JSON", { status: 400 })
    }

    const out = schema({
      ...body,
      ...c.req.param()
    })
    if (out instanceof type.errors)
      return c.json(out.summary, { status: 400 })
    return next()
  }
}
