import { Pool } from 'pg'
import * as resources from './resources'

const SCHEMA_FILE = resources.read('schema.sql')
const SCHEMA_STATEMENTS = SCHEMA_FILE.split(';')

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 5432
const DEFAULT_USER = 'rss-reader'
const DEFAULT_PASS = 'changeme'
const DEFAULT_DB   = 'rss-reader'


export function makeConnection(): Pool {
    const pool = new Pool({
        host: DEFAULT_HOST,
        port: DEFAULT_PORT,
        user: DEFAULT_USER,
        password: DEFAULT_PASS,
        database: DEFAULT_DB,
    })
    SCHEMA_STATEMENTS.forEach(q => pool.query(q))
    return pool
}
