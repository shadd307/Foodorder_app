const express = require("express");
const { auth, isAdmin } = require("../middleware/authenticationHandler");
const categoryRouter = express.Router();

const {
    createCategory,
    editCategory,
    deleteCategory,
    getCategory,
    getAllCategories
} = require("../services/categoryService");

categoryRouter.route("/").post(auth, isAdmin, createCategory);
categoryRouter.route("/:id").put(auth, isAdmin, editCategory);
categoryRouter.route("/:id").delete(auth, isAdmin, deleteCategory);
categoryRouter.route("/:id").get(getCategory);
categoryRouter.route("/").get(getAllCategories);

module.exports =  categoryRouter
