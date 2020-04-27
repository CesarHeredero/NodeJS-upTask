const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    });
}

exports.crearCuenta = async(req, res) => {
    // leer los datos
    const { email, password } = req.body;

    console.log(req.body);
    try {
        await Usuarios.create({
            email,
            password
        });
        res.redirect('./iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            sms: req.flash(),
            nombrePagina: 'crear Cuenta en UpTask',
            email,
            password
        })
    }
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.sms;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesion en UpTask',
        error
    });
}