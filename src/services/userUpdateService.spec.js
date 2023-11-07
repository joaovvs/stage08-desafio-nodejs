const UserCreateService = require("./UserCreateService");
const UserUpdateService = require("./UserUpdateService");

const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const AppError = require("../utils/AppError");

describe("UserUpdateService", ()=> {
    let userRepository =  null;
    let userCreateService = null;
    let userUpdateService = null;

    beforeEach(() => {
        userRepository =  new UserRepositoryInMemory();
        userCreateService = new UserCreateService(userRepository);
        userUpdateService = new UserUpdateService(userRepository);
    });
    
    it("user should be updated",async ()=> {
        const user = 
        {
        name:"teste", 
        email: "teste@test.com",
        password: "123"
        };

        const userEdited = 
        {
            name:"teste editado", 
            email: "teste@test.com",
            password: "123",
            old_password:"123"
        };
        /*cria usuario*/
        const userCreated = await userCreateService.execute(user);
        const userUpdated= await userUpdateService.execute(userEdited, userCreated.id);
       expect(userUpdated.name).toEqual("teste editado");
    });

    it("user password shouldn't be updated without a old password",async ()=> {
        const user = 
        {
        name:"teste", 
        email: "teste@test.com",
        password: "123"
        };

        const userEdited = 
        {
            name:"teste editado", 
            email: "teste@test.com",
            password: "123",
            old_password:""
        };

        const userCreated = await userCreateService.execute(user);
        await expect( userUpdateService
            .execute(userEdited, userCreated.id))
            .rejects
            .toEqual(new AppError("É necessário informar a senha antiga para alterar a senha!"));
    });

    it("user password shouldn't be updated without old password matches with password",async ()=> {
        const user = 
        {
        name:"teste", 
        email: "teste@test.com",
        password: "123"
        };

        const userEdited = 
        {
            name:"teste editado", 
            email: "teste@test.com",
            password: "123",
            old_password:"1243"
        };

        const userCreated = await userCreateService.execute(user);
        await expect( userUpdateService.execute(userEdited, userCreated.id)).rejects.toEqual(new AppError("A senha antiga não confere!"));
    });



})
