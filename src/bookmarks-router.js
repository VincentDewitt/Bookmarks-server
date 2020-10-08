const express = require('express')
const logger = require('./logger')
const { v4: uuid } = require('uuid')
const bookmarksService = require('./bookmarks-service')
const Knex = require('knex')
const { DB_URL } = require('./config')
const xss = require('xss')
const path =require('path')
const { getBookmarkValidationError } = require('./bookmark-validator')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    description: xss(bookmark.description),
    rating: Number(bookmark.rating)
})

bookmarksRouter
    .route('/')

    .get((req,res, next) => {
        bookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks => {
               res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })

    .post(bodyParser, (req,res, next) => {
        const {title, url, description, rating} = req.body
        const newBookmark = { title, url, description, rating }
        console.log(title,url,rating)
        for (const field of ['title', 'url', 'rating']){
            if (!newBookmark[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field}' is required` } 
                })
            }
        }

        const error = getBookmarkValidationError(newBookmark)

        if (error) return res.status(400).send(error)

        bookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                logger.info(`Bookmark with id ${bookmark.id} created`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${bookmark.id}`))
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)
    })

    bookmarksRouter
        .route('/:bookmark_id')
        .all((req,res,next) => {
            const { bookmark_id } = req.params
            console.log(Knex,bookmark_id)
            bookmarksService.getById(req.app.get('db'), bookmark_id)
                .then(bookmark => {
                    if (!bookmark){
                        console.log('4')
                        logger.error(`Bookmark with id ${bookmark_id} not found.`)
                        return res.status(404).json({
                            error: { message: `Bookmark Not Found`}
                        })
                    }
                    res.bookmark = bookmark
                    next()
                })
                .catch(next)

        })

        .get((req,res) => {
            res.json(serializeBookmark(res.bookmark))
        })

        .delete((req, res, next) => {
            const { bookmark_id } = req.params
            bookmarksService.deleteBookmark(
                req.app.get('db'),
                bookmark_id
            )
            .then(numRowsAffected => {
                logger.info(`Bookmark with id ${bookmark_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
        })

        .patch(bodyParser, (req,res,next) => {
            const { title, url, description, rating } = req.body
            const bookmarkToUpdate = { title, url, description, rating }

            const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                logger.error(`Invalid update without required fields`)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain either 'title', 'url', 'description' or 'rating'`
                    }
                })
            }
            const error = getBookmarkValidationError(bookmarkToUpdate)

            if (error) return res.status(400).send(error)

            bookmarksService.updateBookmark(
                req.app.get('db'),
                req.params.bookmark_id,
                bookmarkToUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })
        
    module.exports = bookmarksRouter