import Axios, {AxiosResponse} from 'axios';

import {store} from './store/store';


/* Constants ******************************************************************/

const BACKEND_URL = 'http://localhost:8000';
const SESSION_PATH = "session";


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


/* API helpers ***************************************************************/

const HTTP_CODE_TO_ERROR_TYPE: Record<number, ErrorType> = {
    500: ErrorType.DatabaseError,
    401: ErrorType.AuthenticationError,
    404: ErrorType.NotFound,
    409: ErrorType.Duplicate,
}


async function parseResponse<T>(response: AxiosResponse<T>): Promise<Result<T>> {
    if (response.status != 200)
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

interface Session {
    userId: number;
    token: string;
}


export const login = (username: string, password: string) => {
    return axios.post<Session>('/session', {username, password})
        .then(parseResponse);
};
