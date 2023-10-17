const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController{
    async create(request,response){
        const { title, description, rating } = request.body
        const {user_id} = request.params;

        const [userIdExists] = await knex("users").where({id: user_id});
        /* chack if user exists before create a new movienote*/
        if(!userIdExists){
            throw new AppError("Usuário não cadastrado"); 
        }
        
        await knex("movie_notes").insert({ title, description, rating, user_id});

        response.json({ title, description, rating, user_id});
    }
}

module.exports = MovieNotesController;