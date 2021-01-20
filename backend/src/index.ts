import * as log from 'loglevel';
import { Connection } from './db'
import * as db from './db'
import { run } from './server'
import * as api from './api'

async function main() {
    const connection = db.makeConnection()
    await db.initialize(connection)
    const server = run(connection).on('close', () => connection.end())
    const shutdown = () => server.close(() => process.exit(0))
    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
}

main()
