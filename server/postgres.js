//===  Modul fuer Postgres connect

const pgp = require("pg-promise")();
const db  = pgp ("postgres://postgres:nnamednil@localhost:5432/db_vertrag");

module.exports = db;