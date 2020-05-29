const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env' });

// load Training Camp
const TrainingCamp = require('./models/Trainingcamp');
const Program = require('./models/Program');
const User = require('./models/User');
const Review = require('./models/Review');

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true,
	useUnifiedTopology: true
});

//Read JSON files
const trainingcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/trainingcamps.json`, 'utf-8'));
const programmes = JSON.parse(fs.readFileSync(`${__dirname}/_data/programms.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));
//Import Data
const importData = async () => {
	try {
		await TrainingCamp.create(trainingcamp);
		await Program.create(programmes);
		await User.create(users);
		await Review.create(reviews);
		console.log('Data Imported...'.green.inverse);
		//! important
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await TrainingCamp.deleteMany();
		await Program.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Data Destroyed...'.red.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
