const { hash, compare } = require("bcryptjs");

const knex = require("../database/knex");



class UsersController{


    async create(request,response){
        const {name, email, password, avatar} = request.body;

        const user ={name, email, password, avatar};
        
        /* generate hash for pasword*/
        user.password = await hash(user.password, 8);
        

        await knex("users").insert(user);
        
        response.status(201).json(user);
    }
}


module.exports = UsersController;

