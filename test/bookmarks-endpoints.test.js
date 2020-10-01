
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
        bookmarksCopy = fixtures.makeBookmarksArray()
     
        beforeEach('insert bookmarks', () => {
            return db 
                .into('bookmarks_data')
                .insert(bookmarksCopy)
     })

        it('It should return a 401 without the proper Token code', ()=> {
            return supertest(app)
            .get('/bookmarks')
            .expect(401)
        })
        it(`responds with 401 unauthorized for GET /bookmarks/:id`, () => {
            const secondBookmark = bookmarksCopy[1]
            return supertest(app)
                .get(`/bookmarks/${secondBookmark.id}`)
                .expect(401)
        })
        it('responds with a 401 unauthorized for DELETE /bookmarks/:id', () => {
            const aBookmark = bookmarksCopy[1]
            return supertest(app)
            .delete(`/bookmarks/${aBookmark.id}`)
            .expect(401)
        })
    })
    context(`Given a XSS attack article`, () => {
        const maliciousArticle = {
            id:117,
            title: 'Naughty naughty very naughty <script>alert("xss");</script>',
            url:'http://yahoo.com',
            description:`Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
            rating: 4
          }
          beforeEach('Inserts bad article', () => {
              return db
              .into('bookmarks_data')
              .insert([maliciousArticle])
          })
          it('removes XSS attack content', () => {
              return supertest(app)
              .get(`/bookmarks/${maliciousArticle.id}`)
              .expect(401)
          })
    })
  describe('GET /bookmarks', () => {
      context(`given no bookmarks`, () =>{
          it(`responds with 200 and an empty list`, () => {
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
      })
      describe(` Delete /bookmarks/:id`, () => {
          context(`Given no articles` , () => {
              it(`responds with 404` , () => {
                  const testbookmarkID = 12345
                  return supertest(app)
                    .delete(`/bookmarks/${testbookmarkID}`)
                    .expect(404)
              })
          })
      })  
    })