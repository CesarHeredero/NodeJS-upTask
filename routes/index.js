const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator/check');

// importar controlador
const proyectosController = require('../controllers/proyectosController');
const tareasConroller = require('../controllers/tareasController');
const usuariosConroller = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoproyecto
    );

    // listar proyecro
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    // Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasConroller.agregarTarea
    );

    // Actualizar tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasConroller.cambiarEstadoTarea
    );

    // Eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasConroller.eliminarTarea
    );

    // crear nueva cuenta
    router.get('/crear-cuenta',
        usuariosConroller.formCrearCuenta
    );
    router.post('/crear-cuenta',
        usuariosConroller.crearCuenta
    );

    // iniciar sesion
    router.get('/iniciar-sesion',
        usuariosConroller.formIniciarSesion
    );
    router.post('/iniciar-sesion',
        authController.autintcarUsuario
    );

    // cerrar sesion
    router.get('/cerrar-sesion', authController.cerarSesion);

    return router;
};