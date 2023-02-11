const cors = require('cors')
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:debug');
require('dotenv').config();

const homeRouter = require('./routes/web/home');
const usersRouter = require('./routes/api/users');
const errorHandler = require('./middlewares/errorHandler');
const error404Handler = require('./middlewares/error404Handler');

const app = express();

/*************************************
    Application Configuration 
**************************************/

// Setting EJS as a templete engine
app.set('view engine', 'ejs');


/*************************************
    MongoDB Database Connection 
**************************************/

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => debug('Connected to mongodb...'))
    .catch(err => debug("Could not connect to mongodb...", err));


/*******************************************
    Applying Middlewares in our application
********************************************/

// for secure express app by setting various HTTP headers.
// https://www.securecoding.com/blog/using-helmetjs/
app.use(helmet());


// for serve static files such as images, CSS files, and JavaScript files in a directory named 'public'
app.use(express.static('public'));


/*
 * for parse application/json
 * basically parse incoming Request Object as a JSON Object 
*/ 
app.use(express.json());


/*
 * for parse application/x-www-form-urlencoded
 * we can parse incoming Request Object if strings or arrays (when extended is false)
 * we can also parse (when extended is true) incoming Request Object 
 * if object, with nested objects, or generally any type
*/
app.use(express.urlencoded({ extended: true }));


// for enabling cors requests from clients for a specific set of origins
app.use(cors({
    origin: ['http://localhost:4200'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))


// For HTTP request logging in development environment
if (app.get('env') === 'development') {
    app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms'));
}


/*************************************
    Bind Routes in our application
**************************************/

app.use('/', homeRouter);
app.use('/api/v1/users', usersRouter);
app.use(error404Handler);
app.use(errorHandler);


/*************************************
    Http Server Starting Logic
**************************************/

app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
});