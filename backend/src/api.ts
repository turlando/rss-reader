import * as bcrypt from 'bcrypt'
import RssParser from 'rss-parser'
import { Connection } from './db'
import * as db from './db'


/* API types ******************************************************************/

export enum ResultType {
    Success = "success",
    Failure = "failure"
}


export interface Success<T> {
    result: ResultType.Success;
    data: T
}


export function Success<T>(data: T): Success<T> {
    return {
        result: ResultType.Success,
        data: data
    }
}


export enum ErrorType {
    DatabaseError = "database_error",
    AuthenticationError = "authentication_error",
    NotFound = "not_found",
    Duplicate = "duplicate"
}


export interface Failure {
    result: ResultType.Failure;
    error: ErrorType;
}


export function Failure(error: ErrorType): Failure {
    return {
        result: ResultType.Failure,
        error: error
    }
}


export type Result<T> = Success<T> | Failure


/* Defaults *******************************************************************/

const BCRYPT_SALT_ROUNDS = 10


/* User ***********************************************************************/

export interface User {
    id: number;
    username: string;
}


type _User = User & { passwordHash: string }


function userRowToUser(r: db.UserRow): _User {
    return {
        id: r.id,
        username: r.username,
        passwordHash: r.password
    }
}


function userRowToPublicUser(r: db.UserRow): User {
    return {
        id: r.id,
        username: r.username
    }
}


export async function addUser(
    connection: Connection,
    username: string,
    plaintextPassword: string
): Promise<Result<User>> {
    const hashedPassword = await bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS)
    return db.addUser(connection, username, hashedPassword)
        .then(res => Success(userRowToPublicUser(res.rows[0])))
        .catch(err => err.code == '23505' // unique_violation
                    ? Failure(ErrorType.Duplicate)
                    : Failure(ErrorType.DatabaseError))
}


function getUserByUsername(
    connection: Connection,
    username: string
): Promise<Result<_User>> {
    return db.getUserByUsername(connection, username)
        .then(res => res.rowCount == 0
                   ? Failure(ErrorType.NotFound)
                   : Success(userRowToUser(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


export async function getUserBySessionToken(
    connection: Connection,
    token: string
): Promise<Result<User>> {
    return db.getUserBySessionToken(connection, token)
        .then(res => res.rowCount == 0
                   ? Failure(ErrorType.AuthenticationError)
                   : Success(userRowToUser(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


/* Session ********************************************************************/

export interface Session {
    userId: number;
    token: string;
}


function Session(
    userId: number,
    token: string,
): Session {
    return {
        userId: userId,
        token: token,
    }
}


function sessionRowToSession(row: db.SessionRow): Session {
    return Session(row.user_id, row.token)
}


export async function addSession(
    connection: Connection,
    username: string,
    plaintextPassword: string
): Promise<Result<Session>> {
    const user = await getUserByUsername(connection, username)
    if (user.result == ResultType.Failure)
        return user.error == ErrorType.NotFound
             ? Failure(ErrorType.AuthenticationError)
             : Failure(user.error)

    const passwordValid = await bcrypt.compare(plaintextPassword,
                                               user.data.passwordHash)
    if (passwordValid)
        return db.addSession(connection, user.data.id)
            .then(res => Success(sessionRowToSession(res.rows[0])))
            .catch(err => Failure(ErrorType.DatabaseError))
    else
        return Failure(ErrorType.AuthenticationError)
}


export async function removeSession(
    connection: Connection,
    token: string
): Promise<Result<null>> {
    return db.removeSession(connection, token)
        .then(res => res.rowCount == 0
                   ? Failure(ErrorType.AuthenticationError)
                   : Success(null))
        .catch(err => Failure(ErrorType.DatabaseError))
}


/* Folder *********************************************************************/

export interface Folder {
    id: number;
    name: string;
    parentFolderId?: number;
}


export function Folder(
    id: number,
    name: string,
    parentFolderId?: number
): Folder {
    return {
        id: id,
        name: name,
        parentFolderId: parentFolderId
    }
}


function folderRowToFolder(r: db.FolderRow): Folder {
    return Folder(r.id, r.name, r.parent_folder_id)
}


export function addFolder(
    connection: Connection,
    userId: number,
    name: string,
    parentFolderId?: number
): Promise<Result<Folder>> {
    return db.addFolder(connection, userId, name, parentFolderId)
        .then(res => Success(folderRowToFolder(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


export function getFoldersByParent(
    connection: Connection,
    userId: number,
    parentId?: number
): Promise<Result<Folder[]>> {
    return db.getFoldersByParent(connection, userId, parentId)
        .then(res => Success(res.rows.map(folderRowToFolder)))
}


export function updateFolder(
    connection: Connection,
    id: number,
    userId: number,
    name: string,
    parentFolderId: number
): Promise<Result<Folder>> {
    return db.updateFolder(connection, id, userId, name, parentFolderId)
        .then(res => res.rowCount === 0
                   ? Failure(ErrorType.NotFound)
                   : Success(folderRowToFolder(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


export async function removeFolder(
    connection: Connection,
    id: number,
    userId: number
): Promise<Result<Folder>> {
    return db.removeFolder(connection, id, userId)
        .then(res => res.rowCount === 0
            ? Failure(ErrorType.NotFound)
            : Success(folderRowToFolder(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


/* Feed ***********************************************************************/

export interface Feed {
    id: number,
    url: string,
    title: string,
    link: string,
    description: string,
    folderId?: number
}


export function Feed(
    id: number,
    url: string,
    title: string,
    link: string,
    description: string,
    folderId?: number
): Feed {
    return {
        id: id,
        url: url,
        title: title,
        link: link,
        description: description,
        folderId: folderId,
    }
}


export function feedRowToFeed(row: db.FeedRow): Feed {
    return Feed(row.id, row.url, row.title, row.link, row.description, row.folder_id)
}


export async function addFeed(
    connection: Connection,
    userId: number,
    url: string,
    folderId?: number
) {
    const rss = new RssParser()
    const feed = await rss.parseURL(url)

    return db.addFeed(connection, userId, url,
                      feed.title || "", feed.link || "", feed.description || "",
                      folderId)
        .then(res => {
            const feed = feedRowToFeed(res.rows[0])
            return updateItems(connection, feed.id, userId)
                .then(_ => Success(feed))
                .catch(err => Failure(ErrorType.DatabaseError))
        })
        .catch(err => Failure(ErrorType.DatabaseError))
}


export async function getFeedById(
    connection: Connection,
    id: number,
    userId: number
): Promise<Result<Feed>> {
    return db.getFeedById(connection, id, userId)
        .then(res => res.rowCount == 0
            ? Failure(ErrorType.NotFound)
            : Success(feedRowToFeed(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


export async function getFeedsByFolder(
    connection: Connection,
    userId: number,
    folderId?: number
): Promise<Result<Feed[]>> {
    return db.getFeedsByFolder(connection, userId, folderId)
        .then(res => Success(res.rows.map(feedRowToFeed)))
}


export async function updateFeed(
    connection: Connection,
    id: number,
    userId: number,
    folderId?: number
): Promise<Result<Feed>> {
    return db.updateFeed(connection, id, userId, folderId)
        .then(res => res.rowCount == 0
            ? Failure(ErrorType.NotFound)
            : Success(feedRowToFeed(res.rows[0])))
        .catch(err => Failure(ErrorType.DatabaseError))
}


export async function removeFeed(
    connection: Connection,
    id: number,
    userId: number
): Promise<Result<Feed>> {
    return db.removeFeed(connection, id, userId)
        .then(res => res.rowCount == 0
            ? Success(feedRowToFeed(res.rows[0]))
            : Failure(ErrorType.NotFound))
        .catch(err => Failure(ErrorType.DatabaseError))
}


/* Item ***********************************************************************/

export async function updateItems(
    connection: Connection,
    feedId: number,
    userId: number
): Promise<Result<null>> {
    const feed = await getFeedById(connection, feedId, userId)
    if (feed.result == ResultType.Failure) return Failure(feed.error)

    const rss = new RssParser()
    const f = await rss.parseURL(feed.data.url)

    f.items.forEach(item => db.upsertItem(connection, feedId,
                                          item.guid || "",
                                          item.title || "",
                                          item.content || "",
                                          item.link || "",
                                          item.isoDate || ""))
    // FIXME: implement DatabaseError checks
    // TODO: return new items?
    return Success(null)
}


/* Subscriptions **************************************************************/

export enum TreeElementType {
    Folder = "folder",
    Feed   = "feed"
}


export type TreeFolder = Folder & { type: TreeElementType.Folder, children: Tree[] }
export type TreeFeed   = Feed   & { type: TreeElementType.Feed }
export type Tree       = TreeFolder | TreeFeed


export function TreeFolder(
    id: number,
    name: string,
    children: Tree[],
    parentFolderId?: number
): TreeFolder {
    return {
        type: TreeElementType.Folder,
        ...Folder(id, name, parentFolderId),
        children: children
    }
}


export function folderToTreeFolder(f: Folder, children: Tree[]) {
    return TreeFolder(f.id, f.name, children, f.parentFolderId)
}


export function TreeFeed(
    id: number,
    url: string,
    title: string,
    link: string,
    description: string,
    folderId?: number
): TreeFeed {
    return {
        type: TreeElementType.Feed,
        ...Feed(id, url, title, link, description, folderId)
    }
}


function feedToTreeFeed(f: Feed) {
    return TreeFeed(f.id, f.url, f.title, f.link, f.description, f.folderId)
}


// TypeScript can't narrow down the type of arrays of sum types.
// We have to provide ourselves a type guard so that the compiler will verify
// that a given array of Result<...> is actually and array of Success<...>.
function isTreeFolderArraySuccess(
    t: Result<TreeFolder>[]
): t is Success<TreeFolder>[] {
    return t.every(x => x.result == ResultType.Success)
}


export async function getSubscriptions(
    connection: Connection,
    userId: number
): Promise<Result<Tree[]>> {
    const getSubtree = async (parentId?: number): Promise<Result<Tree[]>> => {

        const folders = await getFoldersByParent(connection, userId, parentId)
        if (folders.result === ResultType.Failure) return Failure(folders.error)

        const feeds = await getFeedsByFolder(connection, userId, parentId)
        if (feeds.result === ResultType.Failure) return Failure(feeds.error)

        const subtree = await Promise.all(folders.data.map(folder =>
            getSubtree(folder.id)
                .then(tree => tree.result == ResultType.Failure
                            ? Failure(tree.error)
                            : Success(folderToTreeFolder(folder, tree.data)))))

        if (! isTreeFolderArraySuccess(subtree))
            return Failure(ErrorType.DatabaseError)

        return Success([...subtree.map(f => f.data),
                        ...feeds.data.map(feedToTreeFeed)])
    }

    return await getSubtree()
}
