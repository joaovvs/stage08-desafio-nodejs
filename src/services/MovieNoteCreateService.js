const AppError = require("../utils/AppError");

class MovieNoteCreateService{
    constructor(movieNoteRepository){
        this.movieNoteRepository = movieNoteRepository; 
    }


    async execute({ title, description, rating, tags, user_id}){
        if(rating<0 || rating>5){
            throw new AppError("Informe uma nota entre 1 e 5");
        }
        
        const [note_id] = await this.movieNoteRepository.createMovieNote({ title, description, rating, user_id});
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
            await this.movieNoteRepository.createTags(tagsInsert);
        }
        const note = await this.movieNoteRepository.findMovieNoteById(note_id);
        
        const movieTags = await this.movieNoteRepository.findMovieTagsByMovieNoteId({note_id});

        return {...note, tags: movieTags};
    }
}


module.exports = MovieNoteCreateService;