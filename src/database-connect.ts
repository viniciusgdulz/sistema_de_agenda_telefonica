import { Database } from "bun:sqlite"

const db = new Database("database.sqlite")

db.run("PRAGMA foreign_keys = ON")

db.run(`
  CREATE TABLE IF NOT EXISTS categorias (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT NOT NULL
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS contatos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          TEXT NOT NULL,
    email         TEXT,
    categoria_id  INTEGER,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS telefones (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    contato_id  INTEGER NOT NULL,
    numero      TEXT NOT NULL,
    tipo        TEXT NOT NULL,
    FOREIGN KEY (contato_id) REFERENCES contatos(id)
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS enderecos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    contato_id  INTEGER NOT NULL,
    rua         TEXT NOT NULL,
    cidade      TEXT NOT NULL,
    estado      TEXT NOT NULL,
    FOREIGN KEY (contato_id) REFERENCES contatos(id)
  );
`)

export { db }
