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
        
        let [note_id] = await knex("movie_notes").insert({ title, description, rating, user_id});

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

        const movieTags = await knex("movie_tags").where({note_id});

        const note = await knex("movie_notes").where({id: note_id});

        const movieNotesWithTags = note.map(note =>{
            const noteTags = movieTags.filter( tag => tag.note_id === note_id);

            return {
                ...note,
                tags: noteTags
            }
        });

        return response.json(movieNotesWithTags);


    }

    async show(request,response){
        const { id } = request.params;  
        
        const movie_note = await knex("movie_notes").where({id}).first();
        const movie_tag = await knex("movie_tags").where({note_id: id}).orderBy("name");

        const movieNotesWithTags={...movie_note,movie_tag};
        return response.json(movieNotesWithTags);
    }

    async index(request,response){
        const { user_id, title,tags} = request.query;

        let notes;

        if(!user_id){
            throw new AppError("Nâo foi informado um id de usuário válido");
        }

        if(tags){
            const filterTags = tags.split(",").map(tag => tag.trim());


            notes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.description",
                "movie_notes.user_id",
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movie_notes","movie_notes.id","movie_tags.note_id")
            .orderBy("movie_notes.title");
        } else {
            notes = await knex("movie_notes")
            .where({user_id})
            .whereLike("title",`%${title}%`)
            .orderBy("title");
        }





        console.log(notes);

        const userTags = await knex("movie_tags").where({user_id}).orderBy("name");
        
        const movieNotesWithTags  = notes.map(note =>{
            const noteTags = userTags.filter( tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            }
        });


        return response.json(movieNotesWithTags);
    }
    
    async delete(request,response){
       const { id } = request.params;

       const movieNote = await knex("movie_notes")
       .where({id})
       .delete();

       return response.json();
    }
}

module.exports = MovieNotesController;