import * as db from './db';

async function main() {
    const connection = db.makeConnection()
    await connection.end()
}

main()
