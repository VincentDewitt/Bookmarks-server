const bookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks_data')
    },
    getById(knex,id){
        return knex.from('bookmarks_data').select('*').where('id',id).first()
    },
}

module.exports = bookmarksService