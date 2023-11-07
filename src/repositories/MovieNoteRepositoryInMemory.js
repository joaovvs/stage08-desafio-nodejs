class MovieNoteRepositoryInMemory{
    movie_notes =[];
    movie_tags = [];
    async createMovieNote({ title, description, rating, user_id}){
        const newMovieNote= {
            id: Math.floor(Math.random()*1000+1),
            user_id,
            title,
            description,
            created_at: Date.now(),
            updated_at: Date.now(),
            rating
        };

        this.movie_notes.push(newMovieNote);
        
        const result = await this.movie_notes.filter(movieNote => movieNote.id ===newMovieNote.id);
        return result ;
    }


    async findMovieNoteById(note_id){
        const [result] = await this.movie_notes.filter(movie => 
           movie.id === note_id.id);
        return  result;
    }
    
    async findMovieTagsByMovieNoteId(note_id){
        const result = this.movie_tags.map(tag => tag.note_id ===note_id);
         return await result;
    }

    async createTags(tags){
        const newTags = tags.map(tag => [{
            id: Math.floor(Math.random()*1000+1),
            name: tag.name,
            user_id: tag.user_id,
            note_id: tag.note_id}]);
        this.movie_tags.push(newTags);
        return await newTags;
    }

    async deleteMovieNote(id){
        this.movie_notes = this.movie_notes.filter(movie_note => movie_note.id === id);
    }

}


module.exports = MovieNoteRepositoryInMemory;