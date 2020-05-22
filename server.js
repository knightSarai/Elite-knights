const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Routs files
const trainingcamps = require('./routs/trainingcamps');

const app = express();

//-middlewares

// Body parser
app.use(express.json());

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//* controllers
// Mount routers
app.use('/api/v1/trainingcamps', trainingcamps);

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