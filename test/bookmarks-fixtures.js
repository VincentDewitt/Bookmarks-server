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
function makeMaliciousBookmark() {
    const maliciousBookmark = {
      id: 911,
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      url: 'https://www.hackers.com',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      rating: 1,
    }
    const expectedBookmark = {
      ...maliciousBookmark,
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
      maliciousBookmark,
      expectedBookmark,
    }
  }

module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark,
}