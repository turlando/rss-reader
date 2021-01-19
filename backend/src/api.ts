import * as bcrypt from 'bcrypt'
import RssParser from 'rss-parser'
import { Connection } from './db'
import * as db from './db'


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
    NotFound = "not_found"
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


function folderRowToFolder(row: db.FolderRow): Folder {
    return Folder(row.id, row.name, row.parent_folder_id)
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


export function getFoldersByParent(
    connection: Connection,
    userId: number,
    parentId?: number
): Promise<Result<Folder[]>> {
    return db.getFoldersByParent(connection, userId, parentId)
        .then(res => Success(res.rows.map(folderRowToFolder)))
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


export async function addFeed(connection: Connection,
                              userId: number,
                              url: string,
                              folderId?: number) {
    const rss = new RssParser()
    const feed = await rss.parseURL(url)
    const feedId = await db.addFeed(
        connection, userId, url,
        // @ts-ignore: TS2345: Argument of type 'string | undefined' is
        //             not assignable to parameter of type 'string'.
        feed.title, feed.link, feed.description,
        folderId)
    await updateItems(connection, feedId, userId)
}


export async function removeFeed(connection: Connection,
                                 id: number,
                                 userId: number) {
    const result = db.removeFeed(connection, id, userId)
    if (! result) throw new Error("Feed not found")
}


export async function updateFeed(connection: Connection,
                                 id: number,
                                 userId: number,
                                 folderId?: number) {
    const result = db.updateFeed(connection, id, userId, folderId)
    if (! result) throw new Error("Feed not found")
}


export async function getFeedsByFolder(
    connection: Connection,
    userId: number,
    folderId?: number
): Promise<Result<Feed[]>> {
    return db.getFeedsByFolder(connection, userId, folderId)
        .then(res => Success(res.rows.map(feedRowToFeed)))
}


/* Item ***********************************************************************/

export async function updateItems(connection: Connection,
                                  feedId: number,
                                  userId: number) {
    // @ts-ignore: TS2339: Property 'url' does not exist on type 'Promise<any>'.
    const feed = await db.feedById(connection, feedId, userId)
    const rss = new RssParser()
    const f = await rss.parseURL(feed.url)
    // @ts-ignore: TS2345: Argument of type 'string | undefined' is not
    //             assignable to parameter of type 'string'.
    f.items.forEach(item => db.upsertItem(connection, feedId, item.guid,
                                          item.title, item.content,
                                          item.link, item.isoDate))
}


/* Subscriptions **************************************************************/

export enum TreeElementType {
    Folder = "folder",
    Feed   = "feed"
}


export type TreeFolder = Folder & { type: TreeElementType.Folder, children: Tree[] }
export type TreeFeed   = Feed   & { type: TreeElementType.Feed }

export type Tree = TreeFolder | TreeFeed


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


function TreeFeed(
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

        return Success([...subtree.map(f => f.data), ...feeds.data.map(feedToTreeFeed)])
    }

    return await getSubtree()
}
