const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController{
    async create(request,response){
        const { title, description, rating, tags } = request.body
        const {user_id} = request.params;

        const [userIdExists] = await knex("users").where({id: user_id});
        /* check if user exists before create a new movie_note*/
        if(!userIdExists){
            throw new AppError("Usuário não cadastrado"); 
        }
        
        const [note_id] = await knex("movie_notes").insert({ title, description, rating, user_id});

        /*return tags */
        const tagsInsert = tags.map(name =>{
            return{
                note_id,
                name,
                user_id
            }
        });
        /*insert tags at movie_tags table*/
        await knex("movie_tags").insert(tagsInsert);

    }
}

module.exports = MovieNotesController;