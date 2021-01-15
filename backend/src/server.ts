import { NextHandleFunction } from 'connect';
import httpError from 'http-errors';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { Connection } from './db';
import { addUser } from './api';


const DEFAULT_PORT = 8000


// @ts-ignore
function errorHandler(err, req, res, next) {
    res.status(err.status || 500).send()
}


function requireParams(...params: string[]): NextHandleFunction {
    return (req, res, next) => {
        // @ts-ignore: TS2339: Property 'body' does not exist on type 'IncomingMessage'.
        if (params.every(k => k in req.body))
            next()
        else
            next(httpError(400))
    }
}


export function run(connection: Connection) {
    const sessionRouter = Router().post('', (req, res) => res.status(200).send())

    return express()
        .use(bodyParser.json())
        .use('/session', sessionRouter)
        .post('/user', requireParams("username", "password"), (req, res, next) => {
            const {username, password} = req.body
            addUser(connection, username, password)
                .then(() => res.status(200).send())
                .catch(err => next(httpError(500, err)))
        })
        // .post('/session', requireParams("username", "password"), ...)
        // .delete('/session/:token', ...)
        // .get('/folder, ...)
        // .post('/folder', ...)
        // .put('/folder/:id, requireParams("name", "parent")
        // .delete('/folder/:id, ...)
        // .get('/folder/:id/items, ...)
        // .get('/item/:id', ...)
        // .put('/item/:id', requireParams("read"))
        .use((req, res, next) => next(httpError(404))) // Catchall / default route
        .use(errorHandler) // Default error handler
        .listen(DEFAULT_PORT)
}
