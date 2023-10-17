const { Router } = require("express");

const MovieNotesController = require('../controllers/MovieNotesController');

movienotesRoutes = Router();

const movieNotesController = new MovieNotesController();

movienotesRoutes.post("/:user_id", movieNotesController.create)

module.exports = movienotesRoutes;