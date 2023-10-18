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

        if(rating<1 || rating>5){
            throw new AppError("Informe uma nota entre 1 e 5");
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

    async show(request,response){
        console.log("entrou aqui");
        const { id } = request.params;  
        
        const movie_note = await knex("movie_notes").where({id}).first();
        const movie_tag = await knex("movie_tags").where({note_id: id}).orderBy("name");
        console.log({...movie_note,movie_tag});

        return response.json({...movie_note,movie_tag});
    }
    
}

module.exports = MovieNotesController;