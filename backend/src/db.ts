import * as log from 'loglevel';
import { Pool, QueryResult } from 'pg';
import { v4 as uuid } from 'uuid';
import * as resources from './resources';
import { q } from './utils';


/* Types **********************************************************************/

export type Connection = Pool


/* Constants ******************************************************************/

const LOGGER = log.getLogger(module.id)

const SCHEMA_FILE = resources.read('schema.sql')
const SCHEMA_STATEMENTS = SCHEMA_FILE.split(';')


/* Defaults *******************************************************************/

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


function query<Row, Params extends any[] = any[]>(
    connection: Connection,
    text: string,
    params: Params
): Promise<QueryResult<Row>> {
    return connection.query<Row>(text, params)
        .then(res => res)
        .catch(err => { LOGGER.error(err); throw err })
}


/* User ***********************************************************************/

export interface UserRow {
    id: number;
    username: string;
    password: string;
}


export function addUser(
    connection: Connection,
    username: string,
    password: string
): Promise<QueryResult<UserRow>> {
    return query<UserRow>(
        connection,
        q("INSERT INTO users (username, password)",
          "     VALUES ($1, $2)",
          "  RETURNING *"),
        [username, password])
}


export function getUserByUsername(
    connection: Connection,
    username: string
): Promise<QueryResult<UserRow>> {
    return query<UserRow>(
        connection,
        q("SELECT *",
          "  FROM users",
          " WHERE users.username = $1"),
        [username]
    )
}


export function getUserBySessionToken(
    connection: Connection,
    token: string
): Promise<QueryResult<UserRow>> {
    return query<UserRow>(
        connection,
        q("SELECT users.*",
          "  FROM users, sessions",
          " WHERE users.id = sessions.user_id",
          "   AND sessions.token = $1"),
        [token])
}


/* Session ********************************************************************/

export interface SessionRow {
    user_id: number;
    token: string;
    date: Date;
}

export function addSession(
    connection: Connection,
    userId: number
): Promise<QueryResult<SessionRow>> {
    return query<SessionRow>(
        connection,
        q("INSERT INTO sessions (user_id, token, date)",
          "     VALUES ($1, $2, NOW())",
          "  RETURNING *"),
          [userId, uuid()])
}


export function removeSession(
    connection: Connection,
    token: string
): Promise<QueryResult> {
    return query(
        connection,
        q("DELETE FROM sessions",
          "      WHERE token = $1"),
        [token])
}


/* Folder *********************************************************************/

export interface FolderRow {
    id: number;
    user_id: number;
    name: string;
    parent_folder_id?: number;
}


export function addFolder(
    connection: Connection,
    userId: number,
    name: string,
    parentFolderId?: number
): Promise<QueryResult<FolderRow>> {
    return query<FolderRow>(
        connection,
        q("INSERT INTO folders (user_id, name, parent_folder_id)",
          "     VALUES ($1, $2, $3)",
          "  RETURNING *"),
        [userId, name, parentFolderId])
}


export async function getFoldersByParent(
    connection: Connection,
    userId: number,
    parentId?: number
): Promise<QueryResult<FolderRow>> {
    const t = q(
        "SELECT *",
        "  FROM folders",
        " WHERE folders.user_id = $1",
        "   AND folders.parent_folder_id", parentId === undefined
                                         ? "IS NULL"
                                         : "= $2")

    const p = parentId === undefined
        ? [userId]
        : [userId, parentId]

    return query<FolderRow>(connection, t, p)
}


export function updateFolder(
    connection: Connection,
    id: number,
    userId: number,
    name: string,
    parentFolderId?: number
): Promise<QueryResult<FolderRow>> {
    return query<FolderRow>(
        connection,
        q("   UPDATE folders",
          "      SET name = $3",
          "        , parent_folder_id = $4",
          "    WHERE id = $1",
          "      AND user_id = $2",
          "RETURNING *"),
        [id, userId, name, parentFolderId])
}


export function removeFolder(
    connection: Connection,
    id: number,
    userId: number
): Promise<QueryResult> {
    return query(
        connection,
        q("DELETE FROM folders",
          "      WHERE folders.id = $1",
          "        AND folders.user_id = $2"),
        [id, userId]
    )
}


/* Feed ***********************************************************************/

export interface FeedRow {
    id: number;
    user_id: number;
    folder_id?: number;
    url: string;
    title: string;
    link: string;
    description: string;
}


export function addFeed(
    connection: Connection,
    userId: number,
    url: string,
    title: string,
    link: string,
    description: string,
    folderId?: number
): Promise<QueryResult<FeedRow>> {
    return query<FeedRow>(
        connection,
        q("INSERT INTO feeds (user_id, folder_id, url, title, link, description)",
          "     VALUES ($1, $2, $3, $4, $5, $6)",
          "  RETURNING *"),
        [userId, folderId, url, title, link, description]
    )
}


export function getFeedById(
    connection: Connection,
    id: number,
    userId: number
): Promise<QueryResult<FeedRow>> {
    return query<FeedRow>(
        connection,
        q("SELECT *",
          "  FROM feeds",
          " WHERE feeds.id = $1",
          "   AND feeds.user_id = $2"),
        [id, userId])
}


export function getFeedsByFolder(
    connection: Connection,
    userId: number,
    folderId?: number
): Promise<QueryResult<FeedRow>> {
    const t = q(
        "SELECT *",
        "  FROM feeds",
        " WHERE feeds.user_id = $1",
        "   AND feeds.folder_id", folderId === undefined
            ? "IS NULL"
            : "= $2")
    const p = folderId === undefined
        ? [userId]
        : [userId, folderId]
    return connection.query<FeedRow>(t, p)
}


export function updateFeed(
    connection: Connection,
    id: number,
    userId: number,
    title: string,
    folderId?: number
): Promise<QueryResult<FeedRow>> {
    return query<FeedRow>(
        connection,
        q("   UPDATE feeds",
          "      SET title = $3",
          "        , folder_id = $4",
          "    WHERE id = $1 ",
          "      AND user_id = $2",
          "RETURNING *"),
        [id, userId, title, folderId])
}


export function removeFeed(
    connection: Connection,
    id: number,
    userId: number
): Promise<QueryResult<FeedRow>> {
    return query(
        connection,
        q("DELETE FROM feeds",
          "      WHERE feeds.id = $1",
          "        AND feeds.user_id = $2"),
        [id, userId])
}


/* Item ***********************************************************************/

export interface ItemRow {
    id: number;
    feed_id: number;
    guid: string;
    title: string;
    description: string;
    link: string;
    date: Date;
}


export function getItemsByFeed(
    connection: Connection,
    feedId: number,
    userId: number
): Promise<QueryResult<ItemRow>> {
    return query<ItemRow>(
        connection,
        q("  SELECT items.*",
          "    FROM items, feeds",
          "   WHERE items.feed_id = feeds.id",
          "     AND items.feed_id = $1",
          "     AND feeds.user_id = $2",
          "ORDER BY items.date DESC"),
        [feedId, userId]
    )
}


export function upsertItem(
    connection: Connection,
    feedId: number,
    guid: string,
    title: string,
    description: string,
    link: string,
    date: string
): Promise<QueryResult<ItemRow>> {
    return query<ItemRow>(
        connection,
        q("  INSERT INTO items (feed_id, guid, title, description, link, date)",
          "       VALUES ($1, $2, $3, $4, $5, $6)",
          "  ON CONFLICT (feed_id, link)",
          "DO UPDATE SET guid = $2",
          "            , title = $3",
          "            , description = $4",
          "            , link = $5",
          "            , date = $6",
          "  RETURNING *"),
        [feedId, guid, title, description, link, date]
    )
}
