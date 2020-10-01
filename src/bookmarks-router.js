const express = require('express')
const store = require('./store')
const logger = require('./logger')
const { isWebUri } = require('valid-url')
const { v4: uuid } = require('uuid')
const bookmarksService = require('./bookmarks-service')
const Knex = require('knex')
const { DB_URL } = require('./config')
const bodyParser = express.json()
const xss = require('xss')

const bookmarksRouter = express.Router()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    description: xss(bookmark.description),
    rating: Number(bookmark.rating)
})

bookmarksRouter
    .route('/bookmarks')
    .get((req,res, next) => {
        bookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks => {
               res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })
    .post(bodyParser, (req,res, next) => {
        for (const field of ['title', 'url', 'description', 'rating']){
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field} is required` } 
                })
            }
        }
        const { title, url ,decription, rating } = req.body
        
        const ratingNum = Number(rating)
        
        if(!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5){
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send({
                error: { message: `'rating' must be a number between 0 and 5`}
            })
        }

        if(!isWebUri(url)) {
            logger.error(`Invalid url '${url}' supplied`)
            return res.status(400).send({
                error: { message: `'url' must be a vlaid URL` }
        })
    }
        const newBookmark = { title, url, description, rating}

        bookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                logger.info(`Bookmark with id ${bookmark.id} created.`)
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)
        })

bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .all((req,res, next) => {
        const {bookmark_id} = req.params
        bookmarksService.getById(req.app.get('db'), bookmark_id)
        .then(bookmark => {
            if(!bookmark) {
                logger.error(`Bookmark with id ${bookmark_id} not found.`)
                return res.status(404).json({
                    error: { messsage: `Bookmark Not Found`}
                })
            }
            return res.bookmark = bookmark
            next()
        })
        .catch(next)
    })
    .get((req, res) => {
        res.json(serializeBookmark(res.bookmark))
    })
    .delete((req,res ,next) => {
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
    module.exports = bookmarksRouter