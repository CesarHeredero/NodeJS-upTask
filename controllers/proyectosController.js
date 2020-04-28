const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');

exports.proyectosHome = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoproyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
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
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('./');
    }
};

exports.proyectoPorUrl = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);

    // Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            ProyectoId: proyecto.id
        }
    });


    if (!proyecto) return next();

    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    });
};

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);
    //render a la vista
    res.render('nuevoproyecto', {
        nombrePagina: 'Editar proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
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
        await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
        res.redirect('./');
    }
};

exports.eliminarProyecto = async(req, res, next) => {
    console.log(req.query);
    const { urlProyecto } = req.query;
    const resultado = await Proyectos.destroy({
        where: { url: urlProyecto }
    })
    if (!resultado) {
        return next();
    }
    res.status(200).send('Proyecto elminado');
};