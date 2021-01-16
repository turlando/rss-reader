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


async function checkUser(connection: Connection,
                         username: string,
                         plaintextPassword: string) {
    const user = await db.userByUsername(connection, username)
    if (! user) throw new Error("Unauthorized")

    const match = await bcrypt.compare(plaintextPassword, user.password)
    if (! match) throw new Error("Unauthorized")

    return user;
}


export async function addSession(connection: Connection,
                                 username: string,
                                 plaintextPassword: string) {
    const user = await checkUser(connection, username, plaintextPassword)
    return db.addSession(connection, user.id)
}


export async function userBySessionToken(connection: Connection,
                                         token: string) {
    const user = db.userBySessionToken(connection, token)
    if (! user) throw new Error("Unauthorized")
    return user
}


export async function removeSession(connection: Connection,
                                    token: string) {
    const result = db.removeSession(connection, token)
    if (! result) throw new Error("Session not found")
}
