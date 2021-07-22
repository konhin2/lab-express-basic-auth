/*
 * /signup - GET - isLoggedOut
 * /signup - POST - isLoggedOut
 * /login - GET - isLoggedOut
 * /login - POST - isLoggedOut
 * /logout - POST - isLoggedIn
 * /userprofile - GET - isLoggedIn
 */
const isLoggedIn = (req, res, next) => {
    if (!req.session.currenUser) {
        return res.redirect("/login")
    }
    next()
}
const isLoggedOut = (req, res, next) => {
    if (req.session.currenUser) {
        return res.redirect("/")
    }
    next()
}
module.exports = {
    isLoggedIn,
    isLoggedOut
}