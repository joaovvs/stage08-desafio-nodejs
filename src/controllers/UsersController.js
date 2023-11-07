const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");
const UserUpdateService = require("../services/UserUpdateService");



class UsersController{


    async create(request,response){
        const {name, email, password} = request.body;
        const user ={name, email, password};

        const userRepository = new UserRepository();
        const userCreateService= new UserCreateService(userRepository);

        /* if request don't have username*/
        if(!user.name){
            throw new AppError("O nome do usuário é obrigatório");
        }

        /* if request don't have e-mail*/
        if(!user.email){
            throw new AppError("O e-mail é obrigatório");
        }

        /* if request don't have password*/
        if(!user.password){
            throw new AppError("A senha é obrigatória");
        }
       
        await userCreateService.execute(user);

        return response.status(201).json(user);
    }

    async update(request, response) {
        const { name, email, password, old_password} = request.body;
        const user={name, email, password, old_password};
        const user_id = request.user.id;

        const userRepository = new UserRepository();
        const userUpdateService= new UserUpdateService(userRepository);
        
       
        await userUpdateService.execute(user,user_id);

        response.json(user);

    }
}
module.exports = UsersController;

