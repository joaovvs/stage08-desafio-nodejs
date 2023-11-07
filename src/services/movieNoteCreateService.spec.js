const MovieNoteCreateService = require("./MovieNoteCreateService");
const MovieNoteRepositoryInMemory = require("../repositories/MovieNoteRepositoryInMemory");
const AppError = require("../utils/AppError");

describe("MovieNoteCreateService", ()=> {
    let movieNoteRepository =  null;
    let movieNoteCreateService = null;

    beforeEach(() => {
        movieNoteRepository =  new MovieNoteRepositoryInMemory();
        movieNoteCreateService = new MovieNoteCreateService(movieNoteRepository);
    });

    it("Movie note should be created", async () => 
    {
        const newMovieNote = {
            title: "Avatar 3",
            description: "Filme dos bichos azul de 2022",
            rating: "4",
            user_id: "1",
            tags: ["sifi","drama","action"]
        }
        const movieNoteCreated = await movieNoteCreateService.execute(newMovieNote);
        expect(movieNoteCreated).toHaveProperty("id");
    });

});