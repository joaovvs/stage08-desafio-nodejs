const knex = require("../database/knex");
class UserRepository{


    async findByEmail(email){
        const [user] = await knex("users").where({email});

        return user;
    }

    async findById(user_id){
        const [user] = await knex("users").where({id: user_id});

        return user;
    }


    async create(user){
       const userId = await knex("users").insert(user);
       return { id: userId};
    }

    async update(user, user_id){
        const result = await knex("users").update({
            name: user.name,
            email: user.email,
            password: user.password, 
            updated_at: knex.fn.now() 
            }).where({id: user_id});

        return result;
    }
}


module.exports = UserRepository;