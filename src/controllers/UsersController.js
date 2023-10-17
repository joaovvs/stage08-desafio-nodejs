const { hash, compare } = require("bcryptjs");

const knex = require("../database/knex");



class UsersController{


    async create(request,response){
        const {name, email, password, avatar} = request.body;

        const user ={name, email, password, avatar};

        await knex("users").insert(user);
        
        response.status(201).json(user);
    }
}


module.exports = UsersController;

