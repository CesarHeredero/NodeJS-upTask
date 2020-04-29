const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

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

        // crar url de confimar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        };

        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // redirigir al usuario
        req.flash('error', 'enviamos un correo a tu this.crearCuenta, confirma la cuenta para terminar el registro');
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

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}

exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctametne');
    res.redirect('/iniciar-sesion');
}