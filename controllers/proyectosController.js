const Proyectos = require('../models/Proyectos');
const slug = require('slug');

exports.proyectosHome = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoproyecto = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    // validar que tengamos algo en el input
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega nombre al proyecto' });
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // no hay errores
        // Insertar en la bd
        const proyecto = await Proyectos.create({ nombre });
        res.redirect('./');
    }
};

exports.proyectoPorUrl = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    if (!proyecto) return next();

    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos
    });
};

exports.formularioEditar = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    //render a la vista
    res.render('nuevoproyecto', {
        nombrePagina: 'Editar proyecto',
        proyectos
    })
}