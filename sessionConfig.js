const session = require('express-session');

function setupSession(app) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'itsasecret', // Use environment variable for better security
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      httpOnly: true, // Prevents client-side scripts from accessing the cookie
      sameSite: 'strict' // Mitigates CSRF attacks
    }
  }));
}

module.exports = setupSession;
