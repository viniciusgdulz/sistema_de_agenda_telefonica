import { Hono } from 'hono'
import * as controller from "../controllers/contato"
import { type } from 'arktype'
import { ffInputType } from '../middleware/inputTest'

const protoSchema = {
  nome: "string > 0",
  "email?": "string.email | null",
  "categoria_id?": "number.integer > 0 | null"
} as const

const Contato = type(protoSchema)
const ContatoId = type({ id: "string.numeric" })
const ContatoUpdate = type({ ...protoSchema, id: "string.numeric" })

const route = new Hono()
route.get('/contato', controller.listAll)
route.post('/contato', ffInputType(Contato), controller.create)
route.get('/contato/:id', ffInputType(ContatoId), controller.listOne)
route.delete('/contato/:id', ffInputType(ContatoId), controller.deleteOne)
route.put('/contato/:id', ffInputType(ContatoUpdate), controller.updateOne)
export { route }
