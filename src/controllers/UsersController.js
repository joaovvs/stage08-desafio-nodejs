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

    async update(request, response) {
        const { name, email, password, old_password, avatar} = request.body;
        const { id } = request.params;
        
        const [user] = await knex("users").where({id});

        /*check with user exists*/
        if(!user){
            throw new AppError("Usuário inexistente!");
        }

       
        const [userWithUpdatedEmail] = await knex("users").where({email});

        console.log(userWithUpdatedEmail.id);

        /*check if email is used to another user*/
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !=id){
            throw new AppError("Este e-mail já está em uso por outro usuário");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.avatar = avatar ?? user.avatar;

        /* check if exists a old_password on request*/
        if(password && !old_password){
            throw new AppError("É necessário informar a senha antiga para alterar a senha!");
        }

        /* check if old+passwords match with password*/
        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);
            console.log(checkOldPassword);
            console.log("senha informada:"+password);
            console.log("senha na base"+user.password);
            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere!");
            }

            user.password = await hash(password,8);
            
        }

        await knex("users").update({
                    name:user.name,
                    email:user.email,
                    password: user.password, 
                    avatar: user.avatar,
                    updated_at: knex.fn.now() 
                    }).where({id});

        response.json(await knex("users").where({id}));

    }
}
module.exports = UsersController;

