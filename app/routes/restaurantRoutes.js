const express = require("express");
const { auth, isAdmin } = require("../middleware/authenticationHandler");
const restaurantRouter = express.Router();

const {
    createRestaurant,
    editRestaurant,
    deleteRestaurant,
    getRestaurant,
    getAllRestaurants
} = require("../services/restaurantService");

restaurantRouter.route("/").post(auth, isAdmin, createRestaurant);
restaurantRouter.route("/:id").put(auth, isAdmin, editRestaurant);
restaurantRouter.route("/:id").delete(auth, isAdmin, deleteRestaurant);
restaurantRouter.route("/:id").get(getRestaurant);
restaurantRouter.route("/").get(getAllRestaurants);

module.exports =  restaurantRouter
