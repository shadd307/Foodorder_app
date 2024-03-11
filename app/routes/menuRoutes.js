const express = require("express");
const { auth, isAdmin } = require("../middleware/authenticationHandler");
const menuRouter = express.Router();

const {
    createMenu,
    editMenu,
    deleteMenu,
    getMenuByRestaurant
} = require("../services/menuService");

menuRouter.route("/").post(auth, isAdmin, createMenu);
menuRouter.route("/:id").put(auth, isAdmin, editMenu);
menuRouter.route("/:id").delete(auth, isAdmin, deleteMenu);
menuRouter.route("/:id").get(getMenuByRestaurant);


module.exports =  menuRouter
