const restaurantRepository = require("../database/repositories/restaurantRepository");
const expressAsyncHandler = require("express-async-handler");
const cuisineRepository = require("../database/repositories/cuisineRepository");
const categoryRepository = require("../database/repositories/categoryRepository");
const fooditemRepository = require("../database/repositories/fooditemRepository");
const menuitemRepository = require("../database/repositories/menuitemRepository");
const menuRepository = require("../database/repositories/menuRepository");

const createRestaurant = expressAsyncHandler(async (req, res) => {
  try {
    const { name, address, contact, image } = req.body;
    const result = await restaurantRepository.createRestaurant(name, address, contact, image);

    if (result) {
      res.status(201).json({
        message: "Restaurant created successfully",
      });
    } else {
      res.status(400);
      throw new Error(`Restaurant creation failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating restaurant",
      error: err.message,
    });
  }
});

const editRestaurant = expressAsyncHandler(async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const result = await restaurantRepository.editRestaurant(restaurantId, req.body);

    if (result) {
      res.status(200).json({
        message: "Restaurant is successfully edited",
      });
    } else {
      res.status(400);
      throw new Error(`Restaurant editing failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error editing restaurant details",
      error: err.message,
    });
  }
});

const deleteRestaurant = expressAsyncHandler(async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const result = await restaurantRepository.deleteRestaurant(restaurantId);

    if (result) {
      res.status(200).json({
        message: "Restaurant is successfully deleted",
      });
    } else {
      res.status(400);
      throw new Error(`Restaurant deletion failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting restaurant",
      error: err.message,
    });
  }
});

const getRestaurant = expressAsyncHandler(async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const result = await restaurantRepository.getRestaurant(restaurantId);
    console.log(result,"hey");
    if (result) {
      res.status(200).json({
        data: result,
        message: "Sucessfully fetched restaurant details.",
      });
    } else {
      res.status(204);
      throw new Error(
        `Not able to find the restaurant based on the restaurant id: ${restaurantId}`
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching restaurant details",
      error: err.message,
    });
  }
});

const getAllRestaurants = expressAsyncHandler(async (req, res) => {
  try {
    let result;
    if (req.query.cuisine) {

      // Step 1: Find cuisine id of the matching cuisine
      const cuisineId = await cuisineRepository.getCuisineIdByName(req.query.cuisine);

      // Step 2: Find food items matching the selected cuisine
      const selectedCuisineFooditems = await fooditemRepository.getFooditemsByCuisineId(cuisineId);

      //Step 3 : Find ids of the fooditems matching the selected cuisine
      const selectedCuisineFooditemsIds = selectedCuisineFooditems.map(fooditem => fooditem.id);

      // Step 4: Find menu items with food items matching the selected cuisine
      const selectedCuisineMenuitems = await menuitemRepository.getAllMenuitemsByFooditemIds(selectedCuisineFooditemsIds);

      // Step 5: Find ids of the menus having menu items matching the selected cuisine
      const selectedCuisineMenuIds = selectedCuisineMenuitems.map(menuitem => menuitem.menuId);
      
      // Step 6: Find menus having the selected menu ids
      const selectedCuisineMenus = await menuRepository.getMenusByIds(selectedCuisineMenuIds);

      //Step 7: Find ids of the restaurants offering the selected menus
      const selectedRestaurantIds = selectedCuisineMenus.map(menu => menu.restaurantId);

      // Step 6: Find restaurants with menus matching the selected cuisine
      result = await restaurantRepository.getRestaurantsByIds(selectedRestaurantIds);
    }
    else if (req.query.category) {
      // Step 1: Find category id of the matching category
      const categoryId = await categoryRepository.getCategoryIdByName(req.query.category);

      // Step 2: Find food items matching the selected category
      const selectedCategoryFooditems = await fooditemRepository.getFooditemsByCategoryId(categoryId);

      //Step 3 : Find ids of the fooditems matching the selected category
      const selectedCategoryFooditemsIds = selectedCategoryFooditems.map(fooditem => fooditem.id);

      // Step 4: Find menu items with food items matching the selected category
      const selectedCategoryMenuitems = await menuitemRepository.getAllMenuitemsByFooditemIds(selectedCategoryFooditemsIds);

      // Step 5: Find ids of the menus having menu items matching the selected category
      const selectedCategoryMenuIds = selectedCategoryMenuitems.map(menuitem => menuitem.menuId);
      
      // Step 6: Find menus having the selected menu ids
      const selectedCategoryMenus = await menuRepository.getMenusByIds(selectedCategoryMenuIds);

      //Step 7: Find ids of the restaurants offering the selected menus
      const selectedRestaurantIds = selectedCategoryMenus.map(menu => menu.restaurantId);

      // Step 6: Find restaurants with menus matching the selected category
      result = await restaurantRepository.getRestaurantsByIds(selectedRestaurantIds);
    }
    else {
      result = await restaurantRepository.getAllRestaurants();
    }
    if (result) {
      res.status(200).json({
        data: result,
        message: "Sucessfully fetched restaurants details.",
      });
    } else {
      console.log(result);
      res.status(204);
      throw new Error(
        `Not able to find the restaurants based on the cuisine: ${req.query.cuisine}`
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching restaurants",
      error: err.message,
    });
  }
});


module.exports = {
  createRestaurant,
  editRestaurant,
  deleteRestaurant,
  getRestaurant,
  getAllRestaurants,
};
