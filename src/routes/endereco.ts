import { Hono } from 'hono'
import * as controller from "../controllers/endereco"
import { type } from 'arktype'
import { ffInputType } from '../middleware/inputTest'

const protoSchema = {
  contato_id: "number.integer > 0",
  rua: "string > 0",
  cidade: "string > 0",
  estado: "string > 0"
} as const

const Endereco = type(protoSchema)
const EnderecoId = type({ id: "string.numeric" })
const EnderecoUpdate = type({ ...protoSchema, id: "string.numeric" })

const route = new Hono()
route.get('/endereco', controller.listAll)
route.post('/endereco', ffInputType(Endereco), controller.create)
route.get('/endereco/:id', ffInputType(EnderecoId), controller.listOne)
route.delete('/endereco/:id', ffInputType(EnderecoId), controller.deleteOne)
route.put('/endereco/:id', ffInputType(EnderecoUpdate), controller.updateOne)
export { route }
