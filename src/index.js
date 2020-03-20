const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys')

//init
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//middle
app.use(session({
    secret: 'mysqlSession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Global Variables

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});




//Routes 
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


//Public 
app.use(express.static(path.join(__dirname, 'public')));


//Starting Server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
