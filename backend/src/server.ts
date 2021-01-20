import * as log from 'loglevel';
import httpError from 'http-errors';
import express, {
    Router, Response,
    RequestHandler, ErrorRequestHandler
} from 'express';
import bodyParser from 'body-parser';
import { Connection } from './db';
import { Result, ErrorType,
         User, addUser, getUserBySessionToken,
         addSession, removeSession,
         addFolder, removeFolder, updateFolder,
         addFeed, removeFeed, updateFeed,
         updateItems,
         ResultType} from './api';
import { getHeaderValue } from './utils';


/* Types *********************************************************************/

declare global {
    namespace Express {
        interface Request {
            token: string;
            user: User;
        }
    }
}


/* Constants ******************************************************************/

const LOGGER = log.getLogger(module.id)


/* Defaults ******************************************************************/

const DEFAULT_PORT = 8000


/* API helpers ***************************************************************/

const ERROR_TYPE_TO_HTTP_CODE: Record<ErrorType, number> = {
    [ErrorType.DatabaseError]: 500,
    [ErrorType.AuthenticationError]: 401,
    [ErrorType.NotFound]: 404,
    [ErrorType.Duplicate]: 409
}


function makeResponse<T>(response: Response, result: Result<T>): Response {
    if (result.result == ResultType.Failure)
        return response.status(ERROR_TYPE_TO_HTTP_CODE[result.error]).send()

    return response.status(200).send(result.data)
}


/* Middlewares ***************************************************************/

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    LOGGER.error("Uncaught exception while processing request\n",
                 "Request: ", req, "\n",
                 "Error: ", res)
    return res.status(err.status || 500).send()
}


function requireParams(...params: string[]): RequestHandler {
    return (req, res, next) => {
        if (params.every(k => k in req.body))
            next()
        else
            next(httpError(400, "Required params: " + params))
    }
}


function requireSession(connection: Connection): RequestHandler {
    return (req, res, next) => {
        const token = getHeaderValue(req.headers['x-token'])
        if (! token) return next(httpError(401, "Unauthorized"))

        return getUserBySessionToken(connection, token)
            .then(user => {
                if (user.result == ResultType.Failure)
                    return next(httpError(401, user.error))

                req.token = token
                req.user = user.data

                return next()
            })
    }
}


/* Routers *******************************************************************/

function makeUserRouter(connection: Connection): Router {
    return Router()
        .post('/',
              requireParams("username", "password"),
              (req, res, next) => {
                  const { username, password } = req.body
                  addUser(connection, username, password)
                      .then(user => makeResponse(res, user))
        })
}


function makeSessionRouter(connection: Connection): Router {
    return Router()
        .post('/', requireParams("username", "password"), (req, res, next) => {
            const { username, password } = req.body
            addSession(connection, username, password)
                .then(token => res.status(200).send(token))
                .catch(err => next(httpError(401, err)))
        })
        .delete('/', requireSession(connection), (req, res, next) => {
            // @ts-ignore: TS2339: Property 'token' does not exist on type
            //             'Request<ParamsDictionary, any, any, ParsedQs>'.
            removeSession(connection, req.token)
                .then(() => res.status(200).send())
                .catch(err => next(httpError(404, err)))
        })
}


function makeFolderRouter(connection: Connection): Router {
    return Router()
        .post('/',
              requireSession(connection),
              requireParams("name", "parent"),
              (req, res, next) => {
                  const { name, parent } = req.body
                  // @ts-ignore: TS2339: Property 'user' does not exist on type
                  //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                  addFolder(connection, req.user.id, name, parent)
                      .then(() => res.status(200).send())
                      .catch(err => next(httpError(400, err)))
              })
        .delete('/:id',
                requireSession(connection),
                (req, res, next) => {
                    // @ts-ignore: TS2339: Property 'token' does not exist on type
                    //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                    removeFolder(connection, req.params.id, req.user.id)
                        .then(() => res.status(200).send())
                        .catch(err => next(httpError(404, err)))
                })
        .put('/:id(\\d+)',
             requireSession(connection),
             requireParams("name", "parent"),
             (req, res, next) => {
                 const { name, parent } = req.body
                 // @ts-ignore: TS2345: Argument of type 'string' is not
                 //             assignable to parameter of type 'number'.
                 // @ts-ignore: TS2339: Property 'user' does not exist on type
                 //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                 updateFolder(connection, req.params.id, req.user.id, name, parent)
                     .then(() => res.status(200).send())
                     .catch(err => next(httpError(404, err)))
             })
}


function makeFeedRouter(connection: Connection): Router {
    return Router()
        .post('/',
              requireSession(connection),
              requireParams("url", "folder"),
              (req, res, next) => {
                  const { url, folder } = req.body
                  // @ts-ignore: TS2339: Property 'user' does not exist on type
                  //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                  addFeed(connection, req.user.id, url, folder)
                      .then(() => res.status(200).send())
                      .catch(err => next(httpError(400, err)))
              })
        .delete('/:id(\\d+)',
                requireSession(connection),
                (req, res, next) => {
                    // @ts-ignore: TS2345: Argument of type 'string' is not
                    //             assignable to parameter of type 'number'.
                    // @ts-ignore: TS2339: Property 'user' does not exist on type
                    //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                    removeFeed(connection, req.params.id, req.user.id)
                        .then(() => res.status(200).send())
                        .catch(err => next(httpError(404, err)))
                })
        .put('/:id(\\d+)',
             requireSession(connection),
             requireParams("folder"),
             (req, res, next) => {
                 const { folder } = req.body
                 // @ts-ignore: TS2345: Argument of type 'string' is not
                 //             assignable to parameter of type 'number'.
                 // @ts-ignore: TS2339: Property 'user' does not exist on type
                 //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                 updateFeed(connection, req.params.id, req.user.id, folder)
                     .then(() => res.status(200).send())
                     .catch(err => next(httpError(400, err)))
             })
        .post('/:id(\\d+)/update',
              requireSession(connection),
              (req, res, next) => {
                  // @ts-ignore: TS2345: Argument of type 'string' is not
                  //             assignable to parameter of type 'number'.
                  // @ts-ignore: TS2339: Property 'user' does not exist on type
                  //             'Request<ParamsDictionary, any, any, ParsedQs>'.
                  updateItems(connection, req.params.id, req.user.id)
                      .then(() => res.status(200).send())
                      .catch(err => next(httpError(400, err)))
              })
}


/* Entrypoint *****************************************************************/

export function run(connection: Connection) {
    return express()
        .use(bodyParser.json())
        .use('/user', makeUserRouter(connection))
        .use('/session', makeSessionRouter(connection))
        .use('/folder', makeFolderRouter(connection))
        .use('/feed', makeFeedRouter(connection))
        .use((req, res, next) => next(httpError(404))) // Catchall / default route
        .use(errorHandler) // Default error handler
        .listen(DEFAULT_PORT)
}
