const express = require('express');
const database = require("./database/sqlite");
const routes = require('./routes')

const app = express();
app.use(express.json());


app.use(routes);

/*create database*/
database();

const PORT = 4444;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));


