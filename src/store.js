const { v4: uuid } = require('uuid')
const bookmarks = [
    { id: uuid(),
      title: 'Apple',
      url: 'https://www.apple.com',
      description: 'The new MacBook Pro, plus iPhone, Apple Watch, iPad, AirPods and more.',
     },
    { id: uuid(),
      title: 'Google',
      url: 'https://www.google.com',
      description: 'Where we find everything else',
      },
    { id: uuid(),
      title: 'MDN',
      url: 'https://developer.mozilla.org',
      description: 'The only place to find web documentation',
      },
  ]
  
  module.exports = { bookmarks }