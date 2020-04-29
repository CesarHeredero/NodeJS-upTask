const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email')

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

// genera token si el usuario es valido
exports.enviarToken = async(req, res) => {
    // verificar que le usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    // si no existe el usuario 
    if (!usuario) {
        req.flash('error', 'No existe esta cuenta');
        res.redirect('/reestablecer');
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // guardar en la base de datos
    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Reiniciar contraseña',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    res.flash('correcto', 'Revisa la bandeja de entrada de tu correo para resetar la contraseña')
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async(req, res) => {
    //verifica token valido y fecha de inspiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos nuevo password
    await usuario.save();

    req.flash('correcto', 'tu password se reiniciado correctamente')
    res.redirect('/iniciar-sesion');
}