require("express-async-errors");
require("dotenv/config");

const express = require('express');
const AppError = require("./utils/AppError");
const routes = require('./routes');
const connection = require("./database/knex");
const uploadConfig = require("./configs/upload");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

/*create database*/
connection.queryBuilder();



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


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));


