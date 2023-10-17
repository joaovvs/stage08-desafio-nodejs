require("express-async-errors");
const express = require('express');
const AppError = require("./utils/AppError");
const routes = require('./routes');
const database = require('./database/sqlite');


const app = express();
app.use(express.json());


app.use(routes);

/*create database*/
database();



app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json( { 
        status: "error",
        message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "internal server error"
   });   
});


const PORT = 4444;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));


