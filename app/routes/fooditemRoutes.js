const express = require("express");
const { auth, isAdmin } = require("../middleware/authenticationHandler");
const fooditemRouter = express.Router();

const {
    createFooditem,
    editFooditem,
    deleteFooditem,
    getFooditem,
    getAllFooditems
} = require("../services/fooditemService");

fooditemRouter.route("/").post(auth, isAdmin, createFooditem);
fooditemRouter.route("/:id").put(auth, isAdmin, editFooditem);
fooditemRouter.route("/:id").delete(auth, isAdmin, deleteFooditem);
fooditemRouter.route("/:id").get(getFooditem);
fooditemRouter.route("/").get(getAllFooditems);

module.exports =  fooditemRouter
