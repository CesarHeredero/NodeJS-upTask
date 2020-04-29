const passport = require('passport');
const LocalStrtegy = require('passport-local');

// referencia l model donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy -login con credenciales propias
passport.use(
    new LocalStrtegy(
        // por default passpor espera usuario y pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                        where: {
                            email,
                            activo: 1
                        }
                    })
                    // el usuario existe pero el pass es incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    })
                }
                // mail y contraseña correcto
                return done(null, usuario);
            } catch (error) {
                // ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;