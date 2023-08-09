const mongoose = require('mongoose');
require('dotenv').config();

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: false
}

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, dbOptions);

        console.log("Database connection successful! 😇");
    } catch (error) {
        console.log(error);
    }
}

mongoose.connection.on('disconnected', () => console.log("Database Connected! 😇"));
mongoose.connection.on('connected', () => console.log("Database disconnected! 😢"));


module.exports.connection = dbConnection;