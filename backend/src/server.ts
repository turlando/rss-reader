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
LOGGER.enableAll()


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
                 "Error: ", err)
    return res.status(err.status || 500).send()
}


function requireParams(...params: string[]): RequestHandler {
    return (req, res, next) => {
        if (params.every(k => k in req.body))
            return next()

        LOGGER.debug("Request is missing mandatory parameters.")
        res.status(400).send()
    }
}


function requireSession(connection: Connection): RequestHandler {
    return (req, res, next) => {
        const token = getHeaderValue(req.headers['x-token'])
        if (token == undefined) {
            LOGGER.debug("Request is missing X-Token header")
            return res.status(401).send()
        }

        return getUserBySessionToken(connection, token)
            .then(user => {
                if (user.result == ResultType.Failure) {
                    LOGGER.debug("Can't find user for given session token")
                    return res.status(401).send()
                }

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
                  return addUser(connection, username, password)
                      .then(user => makeResponse(res, user))
        })
}


function makeSessionRouter(connection: Connection): Router {
    return Router()
        .post('/',
              requireParams("username", "password"),
              (req, res, next) => {
                  const { username, password } = req.body
                  return addSession(connection, username, password)
                      .then(session => makeResponse(res, session))
              })

        .delete('/',
                requireSession(connection),
                (req, res, next) => {
                    return removeSession(connection, req.token)
                        .then(_ => makeResponse(res, _))
        })
}


function makeFolderRouter(connection: Connection): Router {
    return Router()
        .post('/',
              requireSession(connection),
              requireParams("name", "parent"),
              (req, res, next) => {
                  const { name, parent } = req.body
                  return addFolder(connection, req.user.id, name, parent)
                      .then(folder => makeResponse(res, folder))
              })

        .put('/:id(\\d+)',
             requireSession(connection),
             requireParams("name", "parent"),
             (req, res, next) => {
                 const id = Number(req.params.id)
                 const { name, parent } = req.body
                 return updateFolder(connection, id, req.user.id,
                                     name, parent)
                     .then(folder => makeResponse(res, folder))
             })

        .delete('/:id',
                requireSession(connection),
                (req, res, next) => {
                    const id = Number(req.params.id)
                    return removeFolder(connection, id, req.user.id)
                        .then(_ => makeResponse(res, _))
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
        .use((req, res, next) => res.status(404).send()) // Default route
        .use(errorHandler)                               // Default error handler
        .listen(DEFAULT_PORT)
}
