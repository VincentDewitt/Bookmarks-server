const bookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks_data')
    },
    getById(knex,id){
        return knex.from('bookmarks_data').select('*').where('id',id).first()
    },
    insertBookmark(knex, newBookmark) {
        return knex
        .insert(newBookmark)
        .into('bookmarks_data')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks_data')
            .where({ id })
            .delete()
    },
    updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmarks_data')
        .where({ id })
        .update(newBookmarkFields)
    },
}

module.exports = bookmarksService