const router = require('express').Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')

// Get - Display the signup page
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

// Post - Proces form date
router.post('/signup', (req, res) => {
    const {username, password} = req.body
    bcryptjs
        .genSalt(10)
        // Encriptando la contraseña
        .then(salt => bcryptjs.hash(password, salt))
        // Creando el usuario en base de datos
        .then(hash => User.create({username, password: hash}))
        // Redirigiendo al perfil del usuario
        .then(newUser => {
            console.log(newUser)
            res.redirect('/userprofile')
        })
        .catch(err => console.log(err))
})

// GET - Ruta para la pagina del /userprofile
router.get('/userprofile', (req, res) => {
    res.render('users/user-profile')
})

module.exports = router