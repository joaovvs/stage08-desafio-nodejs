const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController{

    async create(request,response){
        const { title, description, rating, tags } = request.body
        const user_id = request.user.id;

        const [userIdExists] = await knex("users").where({id: user_id});
        /* check if user exists before create a new movie_note*/
        if(!userIdExists){
            throw new AppError("Usuário não cadastrado"); 
        }

        if(rating<0 || rating>5){
            throw new AppError("Informe uma nota entre 1 e 5");
        }
        
        let [note_id] = await knex("movie_notes").insert({ title, description, rating, user_id});

        /*return tags */
        const tagsInsert = tags.map(tag =>{
            return{
                note_id,
                name: tag,
                user_id
            }
        });
        /*insert tags at movie_tags table*/
        if(tagsInsert.length>0){
            await knex("movie_tags").insert(tagsInsert);
        }

        const movieTags = await knex("movie_tags").where({note_id});

        const note = await knex("movie_notes").where({id: note_id});


        const movieNotesWithTags = note.map(note =>
            {
            const noteTags = movieTags.filter( tag => tag.note_id === note_id);

            return {
                ...note,
                tags: noteTags
            }
        });


        return response.json(...movieNotesWithTags);


    }

    async update(request, response){
        const { id: note_id, title, description, rating, tags } = request.body
        const user_id = request.user.id;
        const [movieNote] = await knex("movie_notes").where({id: note_id, user_id});

        const [userIdExists] = await knex("users").where({id: user_id});
        if(!userIdExists){
            throw new AppError("Usuário não cadastrado"); 
        }

        if(!movieNote){
            throw new AppError("Filme não encontrado!");
        }

        if(rating<1 || rating>5){
            throw new AppError("Informe uma nota entre 1 e 5");
        }
        movieNote.title= title ?? movieNote.title;
        movieNote.description= description ?? movieNote.description;
        movieNote.rating = rating ?? movieNote.rating;

        let movieTags = await knex("movie_tags").where({note_id, "user_id": user_id});

        const newTags = [];
        const removedTags = [];
        

         
            /*valid if not exists received tag includes on newTags array*/
            tags.forEach(tagReceived => {
                if(movieTags.some(tag => tag.name === tagReceived)){
                    console.log("tag já existe");
                }else {
                    newTags.push({name: tagReceived, user_id, note_id });
                }
            })
            /*inserts newTags*/
            if(newTags.length>0){
                await knex("movie_tags").insert(newTags);
            }

            movieTags.forEach(movieTag => 
                {
                    /*valid if tag received not exits*/
                    if(!tags.some(tag => tag === movieTag.name)){  
                        removedTags.push(movieTag);
                    }
                });
            /*delete removedTags*/
            if(removedTags.length>0){
                
                await knex("movie_tags")
                .whereIn(["id", "user_id", "note_id"],removedTags.map(removed=> [removed.id, removed.user_id, removed.note_id]))
                .delete();
            }

            movieTags=await knex("movie_tags").where({note_id, "user_id": user_id});
     
        
        await knex("movie_notes").update({ title, description, rating , "updated_at" : knex.fn.now() }).where({id: note_id});  
        return response.status(201).json({movieNote,"tags":movieTags});  
        

    }

    async show(request,response){
        const { id } = request.params;  
        const user_id = request.user.id;
        
        const movie_note = await knex("movie_notes").where({id, user_id}).first();
        const movie_tag = await knex("movie_tags").where({note_id: id}).orderBy("name");
        const [user] = await knex("users").where({id: user_id});

        if (movie_note){
            return response.json({...movie_note,tags: movie_tag.map(tag => tag.name),author: {"name": user.name,"avatar": user.avatar} });
        } else {
            throw new AppError("Nota não encontrada!",404);
        }
    }

    async index(request,response){
        const { title, tags} = request.query;
        const user_id = request.user.id;

        let notes;

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
            if(title){
                notes = await knex("movie_notes")
                .where({user_id})
                .whereLike("title",`%${title}%`)
                .orderBy("title");
            }
            else{
                notes = await knex("movie_notes")
                .where({user_id})
            }
        }


        const userTags = await knex("movie_tags").where({user_id}).orderBy("name");
        
        const movieNotesWithTags  = notes.map(note =>{
            const noteTags = userTags.filter( tag => tag.note_id === note.id);
            const tags = noteTags.map(noteTag => noteTag.name);
            return {
                ...note,
                tags
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