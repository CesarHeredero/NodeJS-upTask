const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator/check');

// importar controlador
const proyectosController = require('../controllers/proyectosController');

module.exports = function() {
    router.get('/', proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoproyecto
    );

    // listar proyecro
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);
    // Actualizar el proyecto
    router.get('/proyecto/editar/:id', proyectosController.formularioEditar);

    return router;
};