
const knex = require('knex')
const fixtures = require('./bookmarks-fixtures')
const app = require('./../src/app')
const store = require('../src/store')
const supertest = require('supertest')

describe('Bookmarks Endpoints', () => {
    let bookmarksCopy, db 
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_TESTURL
        })
        app.set('db',db)
    })
    before('cleanup', () => db.raw('TRUNCATE TABLE bookmarks_data RESTART IDENTITY;'));
    afterEach('cleanup', () => db.raw('TRUNCATE TABLE bookmarks_data RESTART IDENTITY;')); 
    after('dissconnect from db', ()=> db.destroy())
   
    afterEach('restore the bookmarks', () => {
        store.bookmarks = bookmarksCopy
    })

    describe('Unauthrized request', () => {
         beforeEach('copy the bookmark', () => {
        bookmarksCopy = store.bookmarks.slice()
    })
        it('It should return a 401 without the proper Token code', ()=> {
            return supertest(app)
            .get('/bookmarks')
            .expect(401)
        })
        it(`responds with 401 unauthorized for GET /bookmarks/:id`, () => {
            const secondBookmark = store.bookmarks[1]
            return supertest(app)
                .get(`/bookmarks/${secondBookmark.id}`)
                .expect(401)
        })
    })
  describe('GET /bookmarks', () => {
      context(`given no bookmarks`, () =>{
          it(`responds with 200 and an empty lsit`, () => {
              return supertest(app)
              .get('/bookmarks')
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(200,[])
          })
      })
    })
    describe('Get /bookmarks/:id', () => {
      context(`given no bookmarks`, () => {
          it(`responds 404 whenever the bookmark doesnt exist`, () => {
              return supertest(app)
                .get(`/bookmarks/123`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404)
          })
      })
     // beforeEach()
     // it(`responds with a 200 given the bookmark id exists/found`, () => {

      })  
    })
//})