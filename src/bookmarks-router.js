const express = require('express')
const store = require('./store')
const logger = require('./logger')
const { isWebUri } = require('valid-url')
const { v4: uuid } = require('uuid')
const bodyParser = express.json()

const bookmarksRouter = express.Router()

bookmarksRouter
    .route('/bookmarks')
    .get((req,res) => {
        res.json(store.bookmarks)
    })
    .post(bodyParser, (req,res) => {
        for (const field of ['title', 'url', 'description']){
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field} is required`)
            }
        }
        const { title, url ,decription } = req.body
        
        if(!isWebUri(url)) {
            logger.error(`Invalid url '${url}' supplied`)
            return res.status(400).send(`'url' must be a vlaid URL`)
        }
        const bookmark ={ id: uuid(), title, url, decription}

        store.bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
            .json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req,res) => {
        const { bookmark_id } = req.params
        const bookmark = store.bookmarks.find(c => c.id == bookmark_id)

        if (!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res 
                .status(404)
                .send('Bookmark Not Found')
        }
       
        res.json(bookmark)
    })
    .delete((req,res) => {
         const { bookmark_id } = req.params

         const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)

         if (bookmarkIndex === -1) {
             logger.error(`Bookmark with id ${bookmark_id} not found.`)
             return res
                .status(400)
                .send('Bookmark Not Found')
         }
         store.bookmarks.splice(bookmarkIndex, 1)

         logger.info(`Bookmark with id ${bookmark_id} deleted.`)
         res
            .status(204)
            .end()
        })
   
    module.exports = bookmarksRouter