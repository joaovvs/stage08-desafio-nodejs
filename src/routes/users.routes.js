const { Router } = require("express");

const UsersController = require('../controllers/UsersController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

userRoutes = Router();

const userController = new UsersController();

userRoutes.post("/",  userController.create);
userRoutes.put("/", ensureAuthenticated, userController.update);

module.exports = userRoutes;