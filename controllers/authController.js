const passport = require('passport');

exports.autintcarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
});

// revisar si el usuario esta logueado
exports.usuarioAutenticado = (req, res, next) => {
    // usuario autenticado
    if (req.isAuthenticated()) {
        return next();
    }
    // usuario no autenticado
    return res.redirect('/iniciar-sesion');
}

exports.cerarSesion = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}