const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");



class UsersController{


    async create(request,response){
        const {name, email, password, avatar} = request.body;

        const user ={name, email, password, avatar};
        const checkUserName = user.name;
        const checkEmail = user.email;
        const checkPassword = user.password;
        console.log(`user name: ${checkUserName}`);

        /* if request don't have username*/
        if(!checkUserName){
            throw new AppError("O nome do usuário é obrigatório");
        }

        /* if request don't have e-mail*/
        if(!checkEmail){
            throw new AppError("O e-mail é obrigatório");
        }

        /* if request don't have password*/
        if(!checkPassword){
            throw new AppError("A senha é obrigatória");
        }
        
        const [checkUserExist] = await knex("users").where({email});

        if(checkUserExist){
            throw new AppError("E-mail de usuário já está cadastrado!");
        }

        /* generate hash for password*/
        user.password = await hash(user.password, 8);
        

        await knex("users").insert(user);
        
        return response.status(201).json(user);
    }
}


module.exports = UsersController;

