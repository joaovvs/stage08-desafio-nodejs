const knex = require("../database/knex");
class MovieNoteRepository{

    async createMovieNote({ title, description, rating, user_id}){
        const result = await knex("movie_notes").insert({ title, description, rating, user_id});
        console.log("resultado: "+result)
        return result;
    }

    
    async findMovieNoteById(note_id){
        const [result] = await knex("movie_notes").where({id: note_id});
        return result;
    }
    
    async findMovieTagsByMovieNoteId(note_id){

        return await knex("movie_tags").where(note_id);
    }

    async createTags(tags){
        return await knex("movie_tags").insert(tags);
    }

    async deleteMovieNote(id){
        await knex("movie_notes")
        .where({id})
        .delete();
    }
}


module.exports = MovieNoteRepository;