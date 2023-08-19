const mongoose = require("mongoose"); // Importing the mongoose dependencies

const MongoDB_URL = process.env.MongoDB_URL; // Getting the Mongoose_URL from .env file

const dbConnect = () => {
  mongoose
    .connect(MongoDB_URL) // BuiltIn method to Connect to the mongoose URL
    .then((conn) => console.log(`Connected to ${conn.connection.host}`)) // Returning the text after the connection
    .catch((e) => console.log(e.message)); // Returning if any error in connection
};

module.exports = dbConnect; //Exporting the dbConnect function/methos/module