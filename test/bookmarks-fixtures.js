function makeBookmarksArray() {
    return [
        {
            id:1,
            title: 'Apple',
            url: 'https://www.apple.com',
            description: 'Apple Products and Services',
            rating: 5,
        },
        {
            id:2,
            title:'Google',
            url: 'https://wwww.google.com',
            description: 'Search the internet',
            rating:4,
        },
        {
            id:3,
            title:'MDN',
            url: 'https://developer.mozilla.org',
            description:'The only place to find web documentation',
            rating:3,
        },
    ]
}

module.exports = {
    makeBookmarksArray,
}