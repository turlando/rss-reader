import { Connection } from './db'
import * as db from './db'
import * as bcrypt from 'bcrypt'


const BCRYPT_SALT_ROUNDS = 10


export async function addUser(connection: Connection,
                              username: string,
                              plaintextPassword: string) {
    const hashedPassword = await bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS)
    return db.addUser(connection, username, hashedPassword)
}


function checkUser(connection: Connection,
                   username: string,
                   plaintextPassword: string) {
    return db.userByUsername(connection, username)
        .then(user => bcrypt.compare(plaintextPassword, user.password))
}


export function addSession(connection: Connection,
                           username: string,
                           plaintextPassword: string) {
    return checkUser(connection, username, plaintextPassword)
}
