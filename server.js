const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Routs files
const trainingcamps = require('./routs/trainingcamps');
const programmes = require('./routs/programmes');
const auth = require('./routs/auth');
const users = require('./routs/users');

const app = express();

//-middlewares

// Dev loggin middleware
//logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

//- Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//* controllers
// Mount routers
app.use('/api/v1/trainingcamps', trainingcamps);
app.use('/api/v1/programmes', programmes);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

//custom errorHandler
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process
	server.close(() => process.exit(1));
});
