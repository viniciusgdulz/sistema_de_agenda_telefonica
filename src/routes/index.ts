import { Hono } from 'hono'
import { route as contato } from './contato'
import { route as telefone } from './telefone'
import { route as categoria } from './categoria'
import { route as endereco } from './endereco'

const routes = new Hono()
routes.route("/", contato)
routes.route("/", telefone)
routes.route("/", categoria)
routes.route("/", endereco)

export { routes }
