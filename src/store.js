const { v4: uuid } = require('uuid')
const bookmarks = [
    { id: uuid(),
      title: 'Apple',
      url: 'https://www.apple.com',
      description: 'The new MacBook Pro, plus iPhone, Apple Watch, iPad, AirPods and more.',
      rating: 4,
     },
    { id: uuid(),
      title: 'Google',
      url: 'https://www.google.com',
      description: 'Where we find everything else',
      rating: 5,
      },
    { id: uuid(),
      title: 'MDN',
      url: 'https://developer.mozilla.org',
      description: 'The only place to find web documentation',
      rating: 3,
      },
  ]
  
  module.exports = { bookmarks }