const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserCreateService {
    constructor(userRepository){
        this.userRepository = userRepository; 
    }

    async execute(user){  
        
        const checkUserExist = await this.userRepository.findByEmail(user.email);
        if(checkUserExist){
         throw new AppError("E-mail de usuário já está cadastrado!");
        }

        /* generate hash for password*/
        const hashedPassword = await hash(user.password, 8);
        user.password=hashedPassword;

        const userCreated = await this.userRepository.create(user);

        return userCreated;
    }
}

module.exports = UserCreateService;