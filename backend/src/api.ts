import * as bcrypt from 'bcrypt'
import RssParser from 'rss-parser'
import { Connection } from './db'
import * as db from './db'


const BCRYPT_SALT_ROUNDS = 10


/* User ***********************************************************************/

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


/* Session ********************************************************************/

export async function addSession(connection: Connection,
                                 username: string,
                                 plaintextPassword: string) {
    const user = await checkUser(connection, username, plaintextPassword)
    return db.addSession(connection, user.id)
}


export async function userBySessionToken(connection: Connection,
                                         token: string) {
    const user = await db.userBySessionToken(connection, token)
    if (! user) throw new Error("Unauthorized")
    return user
}


export async function removeSession(connection: Connection,
                                    token: string) {
    const result = db.removeSession(connection, token)
    if (! result) throw new Error("Session not found")
}


/* Folder *********************************************************************/

export const addFolder = db.addFolder

export async function removeFolder(connection: Connection,
                                   id: number,
                                   userId: number) {
    const result = db.removeFolder(connection, id, userId)
    if (! result) throw new Error("Folder not found")
}

export const updateFolder = db.updateFolder


/* Feed ***********************************************************************/

export async function addFeed(connection: Connection,
                              userId: number,
                              url: string,
                              folderId?: number) {
    const rss = new RssParser()
    const feed = await rss.parseURL(url)
    db.addFeed(connection, userId, url,
               // @ts-ignore: TS2345: Argument of type 'string | undefined' is
               //             not assignable to parameter of type 'string'.
               feed.title, feed.link, feed.description,
               folderId)
}


export async function removeFeed(connection: Connection,
                                 id: number,
                                 userId: number) {
    const result = db.removeFeed(connection, id, userId)
    if (! result) throw new Error("Feed not found")
}
