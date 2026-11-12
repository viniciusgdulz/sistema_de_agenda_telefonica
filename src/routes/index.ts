import { Hono } from 'hono'
import { route as contato } from './contato'

const routes = new Hono()
routes.route("/", contato)

export { routes }
