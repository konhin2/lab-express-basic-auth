const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./../models/User.model')
const { isLoggedIn, isLoggedOut } = require("./../middleware/route-guard")
// Get - Display the signup page
router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

// Post - Proces form date
// Incluye validacion del backend y a traves del modelo en el .catch
router.post('/signup', (req, res) => {
    const {username, password} = req.body
    // Verificacion de campos obligatorios
    if (!username || !password) {
        return res.render('auth/signup', {
          msg: "Todos los campos son obligatorios"
        })
    }
    // Strong password Verification
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // Si el password no cumple con los requisitos
    if (!regex.test(password)) {
        return res.status(500).render('auth/signup', {
            msg:"El password debe tener 6 caracteres minimo, y debe contener al menos un número, una minúscla y una mayuscula"
        })
    }
    // Encriptacion
    bcryptjs
        .genSalt(10)
        // Encriptando la contraseña
        .then(salt => bcryptjs.hash(password, salt))
        // Creando el usuario en base de datos
        .then(hashedPassword => User.create({username, password: hashedPassword}))
        // Redirigiendo al perfil del usuario
        .then(newUser => {
            console.log(newUser)
            req.session.currenUser = newUser
            res.redirect('/userprofile')
        })
        .catch(err => {
            // Validacion de usuario repetido (unique: true) del modelo User
            if(err.code === 11000) {
                res.status(500).render('auth/signup', {
                  msg: 'El usuario ya existe. Intenta uno nuevo.'
                })
            }
        })
})

// GET - Ruta para la pagina del /userprofile
router.get('/userprofile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', {
        user: req.session.currenUser
    })
})

// GET - Ruta para la pagina de /login (FORMULARIO)
router.get('/login', (req, res) => {
    res.render('auth/login')
})

// Proceso de autenticacion 
// Verificar que el usuario y la contraseña es la misma que la de la base de datos
router.post('/login', (req, res) => {
    console.log(req.session)
    const { username, password } = req.body

    // Validar email y contraseña
    if(!username || !password) {
        return res.render('auth/login', {
            msg: "Por favor ingresa usuario y contraseña"
        })
    }
    User.findOne({username})
        .then(userFound => {
            // 1. Si el usuario no existe
            if(!userFound) {
                return res.render('auth/login', {
                    msg: "El usuario no existe"
                })
            }
            // 2. El usuario se equivoco de contraseña
            if(!bcryptjs.compareSync(password, userFound.password)) {
                return res.render('auth/login', {
                    msg: "La contraseña es incorrecta"
                })
            }
            // 3. Si el usuario y la contraseña coinciden
            // Creamos en nuestro objeto session una propiedad que se llame usuario actual 
            req.session.currenUser = userFound
            return res.redirect('/userprofile')
        })
        .catch(err => console.log(err))
})

// POST - Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err)
      }
      res.redirect('/')
    })
})

module.exports = router