const session = require('express-session')
const MongoStore = require('connect-mongo')

module.exports = app => {
    app.set("trust proxy", 1)
    // Insert the session middleware
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
            secure: process.env.NODE_ENV === 'production', 
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    }))
}