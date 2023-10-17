const { Router } = require("express");

const usersRouter = require("./users.routes");
const movieNotesRouter = require("./movie.notes.routes");
const movieTagsRouter = require("./movie.tags.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/movie-notes", movieNotesRouter);
routes.use("/movie-tags", movieTagsRouter);


module.exports = routes;