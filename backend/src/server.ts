import { NextHandleFunction } from 'connect';
import httpError from 'http-errors';
import express, { ErrorRequestHandler, Router } from 'express';
import bodyParser from 'body-parser';
import { Connection } from './db';
import { addUser, userBySessionToken,
         addSession, removeSession,
         addFolder, removeFolder, updateFolder,
         addFeed, removeFeed, updateFeed,
         updateItems } from './api';


const DEFAULT_PORT = 8000


/* Middlewares ***************************************************************/

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("server.errorHandler:", err, "\n")
    res.status(err.status || 500).send()
}


function requireParams(...params: string[]): NextHandleFunction {
    return (req, res, next) => {
        // @ts-ignore: TS2339: Property 'body' does not exist on type
        //             'IncomingMessage'.
        if (params.every(k => k in req.body))
            next()
        else
            next(httpError(400, "Required params: " + params))
    }
}


function requireSession(connection: Connection): NextHandleFunction {
    return (req, res, next) => {
        const token = req.headers['x-token']
        if (! token) return next(httpError(401, "Unauthorized"))

        // @ts-ignore: TS2345: Argument of type 'string | string[]' is not
        //             assignable to parameter of type 'string'.
        userBySessionToken(connection, token)
            .then(user => {
                // @ts-ignore: TS2339: Property 'token' does not exist on type
                //             'IncomingMessage'.
                req.token = token
                // @ts-ignore: TS2339: Property 'user' does not exist on type
                //             'IncomingMessage'.
                req.user = user
                next()
            })
            .catch(err => next(httpError(401, err)))
    }
}


/* Routers *******************************************************************/

function makeUserRouter(connection: Connection): Router {
    return Router()
        .post('/', requireParams("username", "password"), (req, res, next) => {
            const {username, password} = req.body
            addUser(connection, username, password)
                .then(() => res.status(200).send())
                .catch(err => next(httpError(500, err)))
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
