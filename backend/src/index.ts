import { Connection } from './db'
import * as db from './db'
import * as server from './server'
import * as api from './api'

async function main() {
    const connection = db.makeConnection()
    await db.initialize(connection)
    server.run(connection)
          .on('close', () => {
              console.log("DIO")
              console.log("PORCO")
              connection.end()
          })
}

main()
