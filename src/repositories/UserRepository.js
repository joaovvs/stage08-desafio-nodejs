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

    async update(user_data, user_id){
        const result = await knex("users").update({
            name: user_data.name,
            email: user_data.email,
            password: user_data.password, 
            updated_at: knex.fn.now() 
            }).where({id: user_id});

        return result;
    }
}


module.exports = UserRepository;