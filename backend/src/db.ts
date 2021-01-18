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


/* Connection *****************************************************************/

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


/* User ***********************************************************************/

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


export function userBySessionToken(connection: Connection,
                                   token: string) {
    const q = "SELECT users.* " +
              "  FROM users, sessions " +
              " WHERE users.id = sessions.user_id " +
              "   AND sessions.token = $1"
    return connection.query(q, [token])
        .then(res => res.rows[0])
}


/* Session ********************************************************************/

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


export function removeSession(connection: Connection,
                              token: string) {
    const q = "DELETE FROM sessions " +
              "      WHERE token = $1 "
    return connection.query(q, [token]).then(res => !!res.rowCount)
}


/* Folder *********************************************************************/

export function addFolder(connection: Connection,
                          userId: number,
                          name: string,
                          parentFolderId?: number) {
    const q = "INSERT INTO folders (user_id, name, parent_folder_id) " +
              "     VALUES ($1, $2, $3) " +
              "  RETURNING id"
    const query = {text: q,
                   values: [userId, name, parentFolderId],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}


export function removeFolder(connection: Connection,
                             id: number,
                             userId: number) {
    const q = "DELETE FROM folders " +
              "      WHERE folders.id = $1 " +
              "        AND folders.user_id = $2"
    return connection.query(q, [id, userId]).then(res => !!res.rowCount)
}


export function updateFolder(connection: Connection,
                             id: number,
                             userId: number,
                             name: string,
                             parentFolderId?: number) {
    const q = "UPDATE folders " +
              "   SET name = $3 " +
              "     , parent_folder_id = $4 " +
              " WHERE id = $1 " +
              "   AND user_id = $2"
    return connection.query(q, [id, userId, name, parentFolderId])
                     .then(res => !!res.rowCount)
}


export function foldersByParent(connection: Connection,
                                userId: number,
                                parentId?: number) {
    const q = "SELECT * " +
              "  FROM folders " +
              " WHERE folders.user_id = $1 " +
        (parentId === undefined
            ? "   AND folders.parent_folder_id IS NULL"
            : "   AND folders.parent_folder_id = $2")
    return connection.query(q, parentId ? [userId, parentId] : [userId]).then(res => res.rows)
}

/* Feed ***********************************************************************/

export function addFeed(connection: Connection,
                        userId: number,
                        url: string,
                        title: string,
                        link: string,
                        description: string,
                        folderId?: number) {
    const q = "INSERT INTO feeds (user_id, folder_id, url, title, link, description) " +
              "     VALUES ($1, $2, $3, $4, $5, $6) " +
              "  RETURNING id"
    const query = {text: q,
                   values: [userId, folderId, url, title, link, description],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}


export function removeFeed(connection: Connection,
                           id: number,
                           userId: number) {
    const q = "DELETE FROM feeds " +
              "      WHERE feeds.id = $1 " +
              "        AND feeds.user_id = $2"
    return connection.query(q, [id, userId]).then(res => !!res.rowCount)
}


export function updateFeed(connection: Connection,
                           id: number,
                           userId: number,
                           folderId?: number) {
    const q = "UPDATE feeds " +
        "   SET folder_id = $3 " +
        " WHERE id = $1 " +
        "   AND user_id = $2"
    return connection.query(q, [id, userId, folderId])
        .then(res => !!res.rowCount)
}


export function feedById(connection: Connection,
                         id: number,
                         userId: number) {
    const q = "SELECT * " +
              "  FROM feeds " +
              " WHERE feeds.id = $1 " +
              "   AND feeds.user_id = $2"
    return connection.query(q, [id, userId]).then(res => res.rows[0])
}


export function feedsByFolder(connection: Connection,
                             userId: number,
                             folderId?: number) {
    const q = "SELECT * " +
              "  FROM feeds " +
              " WHERE feeds.user_id = $1 " +
        (folderId === undefined
            ? "   AND feeds.folder_id IS NULL"
            : "   AND feeds.folder_id = $2")
    return connection.query(q, folderId ? [userId, userId] : [userId]).then(res => res.rows)
}


/* Item ***********************************************************************/

export function upsertItem(connection: Connection,
                           feedId: number,
                           guid: string,
                           title: string,
                           description: string,
                           link: string,
                           date: string) {
    const q = "  INSERT INTO items (feed_id, guid, title, description, link, date) " +
              "       VALUES ($1, $2, $3, $4, $5, $6) " +
              "  ON CONFLICT (feed_id, guid) " +
              "DO UPDATE SET title = $3 " +
              "            , description = $4 " +
              "            , link = $5 " +
              "            , date = $6 " +
              "  RETURNING id "
    const query = {text: q,
                   values: [feedId, guid, title, description, link, date],
                   rowMode: 'array'}
    return connection.query(query).then(res => res.rows[0][0])
}
