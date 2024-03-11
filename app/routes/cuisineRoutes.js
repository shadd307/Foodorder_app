const express = require("express");
const { auth, isAdmin } = require("../middleware/authenticationHandler");
const cuisineRouter = express.Router();

const {
    createCuisine,
    editCuisine,
    deleteCuisine,
    getCuisine,
    getAllCuisines
} = require("../services/cuisineService");

cuisineRouter.route("/").post(auth, isAdmin, createCuisine);
cuisineRouter.route("/:id").put(auth, isAdmin, editCuisine);
cuisineRouter.route("/:id").delete(auth, isAdmin, deleteCuisine);
cuisineRouter.route("/:id").get(getCuisine);
cuisineRouter.route("/").get(getAllCuisines);

module.exports =  cuisineRouter
