import { Hono } from 'hono'
import * as controller from "../controllers/categoria"
import { type } from 'arktype'
import { ffInputType } from '../middleware/inputTest'

const protoSchema = {
  nome: "string > 0"
} as const

const Categoria = type(protoSchema)
const CategoriaId = type({ id: "string.numeric" })
const CategoriaUpdate = type({ ...protoSchema, id: "string.numeric" })

const route = new Hono()
route.get('/categoria', controller.listAll)
route.post('/categoria', ffInputType(Categoria), controller.create)
route.get('/categoria/:id', ffInputType(CategoriaId), controller.listOne)
route.delete('/categoria/:id', ffInputType(CategoriaId), controller.deleteOne)
route.put('/categoria/:id', ffInputType(CategoriaUpdate), controller.updateOne)
export { route }
