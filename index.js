const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator/check');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Helpers
const helpers = require('./helpers');

// Crear conexion a la db
const db = require('./config/db');

// importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug');

// Habilitar bodyparser para leer datos del usuario
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(expressValidator());

// agreagar flash messages
app.use(flash());

app.use(cookieParser());
// sesiones, nos permite navegar en distintas paginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar vardom a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.sms = req.flash();
    next();
});

// Añadir la carpeta vistas
app.set('views', path.join(__dirname, './views'));

app.use('/', routes());

app.listen(3000);