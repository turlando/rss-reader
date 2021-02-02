import Axios, {AxiosResponse} from 'axios';

import {store} from './store/store';


/* Constants ******************************************************************/

const BACKEND_URL = 'http://localhost:8000';
const SESSION_PATH = "session";
const SUBSCRIPTIONS_PATH = "subscriptions";
const FOLDER_PATH = "folder";


/* Result types ***************************************************************/

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
    Duplicate = "duplicate",
    ClientError = "client_error",
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


/* Model types ****************************************************************/

interface Session {
    userId: number;
    token: string;
}


export interface Folder {
    id: number;
    name: string;
    parentFolderId?: number;
}


export interface Feed {
    id: number,
    url: string,
    title: string,
    link: string,
    description: string,
    folderId?: number
}


export interface Item {
    id: number;
    feedId: number;
    guid: string;
    title: string;
    description: string;
    link: string;
    date: Date;
}


export enum SubscriptionTreeNodeType {
    Folder = "folder",
    Feed   = "feed"
}


export type SubscriptionTreeFolder = Folder & { type: SubscriptionTreeNodeType.Folder,
                                                children: SubscriptionTree }
export type SubscriptionTreeFeed   = Feed   & { type: SubscriptionTreeNodeType.Feed }
export type SubscriptionTreeNode   = SubscriptionTreeFolder | SubscriptionTreeFeed
export type SubscriptionTree       = SubscriptionTreeNode[]


export const treeNodeKey = (node: SubscriptionTreeNode): string => {
    return `${node.type}-${node.id}`;
}


/* API helpers ***************************************************************/

const HTTP_CODE_TO_ERROR_TYPE: Record<number, ErrorType> = {
    500: ErrorType.DatabaseError,
    401: ErrorType.AuthenticationError,
    404: ErrorType.NotFound,
    409: ErrorType.Duplicate,
}


async function parseResponse<T>(response: AxiosResponse<T>): Promise<Result<T>> {
    if (response.status !== 200)
        return Failure(HTTP_CODE_TO_ERROR_TYPE[response.status]);
    return Success<T>(response.data);
}


const axios = Axios.create({
    baseURL: BACKEND_URL,
    validateStatus: s => true,
});


axios.interceptors.request.use(
    config => {
        const state = store.getState();
        const token = state.session.token;

        if (token) {
            config.headers['X-Token'] = token;
        }

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);


/* API requests **************************************************************/

export const login = (username: string, password: string) => {
    return axios.post<Session>(SESSION_PATH, {username, password})
        .then(parseResponse);
};


export const getSubscriptions = () => {
    return axios.get<SubscriptionTree>(SUBSCRIPTIONS_PATH)
        .then(parseResponse);
}


export const addFolder = (name: string, parent: number | undefined) => {
    // TODO: clean this mess
    return axios.post(FOLDER_PATH, {name, parent: parent === undefined ? null : parent})
        .then(parseResponse);
}


export const removeFolder = (folderId: number) => {
    return axios.delete(`${FOLDER_PATH}/${folderId}`)
        .then(parseResponse);
}


export const getFeedItems = (feedId: number) => {
    return axios.get(`/feed/${feedId}/items`)
        .then(parseResponse);
}


export const removeFeed = (feedId: number) => {
    return axios.delete(`/feed/${feedId}`)
        .then(parseResponse);
}
