const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

// Helpers
const helpers = require('./helpers');

// Crear conexion a la db
const db = require('./config/db');

// importar modelo
require('./models/Proyectos');
require('./models/Tareas');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();


// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug');

//pasar vardom a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next();
});

// Añadir la carpeta vistas
app.set('views', path.join(__dirname, './views'));

// Habilitar bodyparser para leer datos del usuario
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes());

app.listen(3000);