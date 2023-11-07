const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserUpdateService {
    constructor(userRepository){
        this.userRepository = userRepository; 
    }

    async execute({name, email, password, old_password}, user_id){  
        const user = await this.userRepository.findById(user_id);

         /*check with user exists*/
         if(!user){
            throw new AppError("Usuário não encontrado!");
        }

        const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

        /*check if email is used to another user*/
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !=user_id){
            throw new AppError("Este e-mail já está em uso por outro usuário");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        /* check if exists a old_password on request*/
        if(password && !old_password){
            throw new AppError("É necessário informar a senha antiga para alterar a senha!");
        }

        /* check if old+passwords match with password*/
        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);
            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere!");
            }

            user.password = await hash(password,8);
            
        }
        
        const userUpdated = await this.userRepository.update(user, user_id);


        return userUpdated;
    }
}

module.exports = UserUpdateService;