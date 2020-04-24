const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async(req, res, next) => {
    // obtener el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    // leer valor del input
    const { tarea } = req.body;
    // estado 0 = incompleto y id de proyecto
    const estado = 0;
    const ProyectoId = proyecto.id;

    // insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, ProyectoId });

    if (!resultado) {
        return next();
    }
    //redifeccionar
    res.redirect(`/proyectos/${req.params.url}`);
}