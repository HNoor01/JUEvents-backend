const session = require('express-session');

function setupSession(app) {
  app.use(session({
    secret: 'itsasecret',
    resave: false,
    saveUninitialized: true
  }));
}

module.exports = setupSession;
