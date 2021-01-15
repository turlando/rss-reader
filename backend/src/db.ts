import { Pool } from 'pg'
import * as resources from './resources'
import { v4 as uuid } from 'uuid'


export type Connection = Pool


const SCHEMA_FILE = resources.read('schema.sql')
const SCHEMA_STATEMENTS = SCHEMA_FILE.split(';')

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 5432
const DEFAULT_USER = 'rss-reader'
const DEFAULT_PASS = 'changeme'
const DEFAULT_DB   = 'rss-reader'


/* User **********************************************************************/

export function makeConnection(): Connection {
    return new Pool({
        host: DEFAULT_HOST,
        port: DEFAULT_PORT,
        user: DEFAULT_USER,
        password: DEFAULT_PASS,
        database: DEFAULT_DB,
    })
}


export async function initialize(connection: Connection) {
    const client = await connection.connect()
    const results = SCHEMA_STATEMENTS.map(s => client.query(s))
    return Promise.all(results).then(rs => {
        client?.release()
        return rs
    })
}


/* User **********************************************************************/

export function addUser(connection: Connection,
                        username: string,
                        password: string) {
    const q = "INSERT INTO users (username, password) " +
              "     VALUES ($1, $2)" +
              "  RETURNING id"
    const query = {text: q,
                   values: [username, password],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}


export function userByUsername(connection: Connection,
                               username: string) {
    const q = "SELECT * " +
              "  FROM users " +
              " WHERE users.username = $1"
    return connection.query(q, [username])
                     .then(res => res.rows[0])
}


/* Session *******************************************************************/

export function addSession(connection: Connection,
                           userId: number) {
    const q = "INSERT INTO sessions (user_id, token, date) " +
              "     VALUES ($1, $2, NOW()) " +
              "  RETURNING token"
    const query = {text: q,
                   values: [userId, uuid()],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}


export function sessionByToken(connection: Connection,
                               token: string) {
    const q = "SELECT * " +
              "  FROM sessions " +
              " WHERE sessions.token = $1 " +
              "   AND sessions.date > NOW() - interval '2 hour'"
    const query = {text: q, values: [token]}
    return connection.query(query).then(res => res.rows[0])
}


/* Folder ********************************************************************/

export function addFolder(connection: Connection,
                          userId: number,
                          name: string,
                          parent: number) {
    const q = "INSERT INTO folders (user_id, name, parent) " +
              "     VALUES ($1, $2, $3) " +
              "  RETURNING id"
    const query = {text: q,
                   values: [userId, name, parent],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}


export function foldersByUserId(connection: Connection,
                                userId: number) {
    const q = "SELECT * " +
              "  FROM folders " +
              " WHERE folders.user_id = $1"
    return connection.query(q, [userId]).then(res => res.rows)
}


/* Feed **********************************************************************/

export function addFeed(connection: Connection,
                        folderId: number,
                        name: string,
                        title: string,
                        link: string,
                        description: string) {
    const q = "INSERT INTO feeds (folder_id, name, title, link, description) " +
              "     VALUES ($1, $2, $3, $4, $5) " +
              "  RETURNING id"
    const query = {text: q,
                   values: [folderId, name, title, link, description],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}


export function feedsByFolderId(connection: Connection,
                                folderId: number) {
    const q = "SELECT * " +
              "  FROM feeds" +
              " WHERE feeds.folder_id = $1"
    return connection.query(q, [folderId]).then(res => res.rows)
}
