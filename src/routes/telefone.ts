import { Hono } from 'hono'
import * as controller from "../controllers/telefone"
import { type } from 'arktype'
import { ffInputType } from '../middleware/inputTest'

const protoSchema = {
  contato_id: "number.integer > 0",
  numero: "string > 0",
  tipo: "string > 0"
} as const

const Telefone = type(protoSchema)
const TelefoneId = type({ id: "string.numeric" })
const TelefoneUpdate = type({ ...protoSchema, id: "string.numeric" })

const route = new Hono()
route.get('/telefone', controller.listAll)
route.post('/telefone', ffInputType(Telefone), controller.create)
route.get('/telefone/:id', ffInputType(TelefoneId), controller.listOne)
route.delete('/telefone/:id', ffInputType(TelefoneId), controller.deleteOne)
route.put('/telefone/:id', ffInputType(TelefoneUpdate), controller.updateOne)
export { route }
