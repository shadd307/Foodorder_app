const menuRepository = require("../database/repositories/menuRepository");
const cuisineRepository = require("../database/repositories/cuisineRepository");
const categoryRepository = require("../database/repositories/categoryRepository");
const fooditemRepository = require("../database/repositories/fooditemRepository");
const menuitemRepository = require("../database/repositories/menuitemRepository");
const expressAsyncHandler = require("express-async-handler");

const createMenu = expressAsyncHandler(async (req, res) => {
  try {
    const { restaurantId, description, menuForRestaurant } = req.body;
    const savedMenu = await menuRepository.createMenu(restaurantId, description, menuForRestaurant);

    if (savedMenu) {
      // Create an array to store the menu items to be inserted.
      const menuItemsArray = Object.entries(menuForRestaurant).map(([fooditemId, fooditemName, fooditemImage, fooditemPrice]) => ({
        menuId: savedMenu._id, // Associate the menu item with the newly created menu.
        fooditemId,
        fooditemName,
        fooditemImage,
        fooditemPrice,
      }));
      // Insert the menu items into the MenuItem model.
      try {
        const savedMenuItems = await menuitemRepository.createMenuitems(menuItemsArray);
        if (savedMenuItems) {
          res.status(201).json({
            message: "Menu created successfully",
          });
        } else {
          const result = await menuRepository.deleteMenu(savedMenu._id);
          res.status(400);
          throw new Error(`Menuitem creation failed`);
        }
      }
      catch (err) {
        const result = await menuRepository.deleteMenu(savedMenu._id);
        res.status(400);
        throw new Error(`Menu creation failed`);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating menu",
      error: err.message,
    });
  }
});

const editMenu = expressAsyncHandler(async (req, res) => {
  try {
    const menuId = req.params.id;
    const { description, menuitemsWithNewPrices } = req.body;
    const result = await menuRepository.editMenu(menuId, description);

    if (result) {
      try {
        const updatedMenuitems = await menuitemRepository.editMenuitems(menuitemsWithNewPrices);
        if (updatedMenuitems) {
          res.status(200).json({
            message: "Menuitems are successfully edited",
          });
        }
        else {
          res.status(400);
          throw new Error(`Menuitems editing failed`);
        }
      }
      catch (err) {
        console.log(err)
        res.status(400);
        throw new Error(`Menuitems editing failed`);
      }
    } else {
      res.status(400);
      throw new Error(`Menu editing failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error editing menu details",
      error: err.message,
    });
  }
});

const deleteMenu = expressAsyncHandler(async (req, res) => {
  try {
    const menuId = req.params.id;
    const result = await menuRepository.deleteMenu(menuId);

    if (result) {
      try {
        const deletedMenuitems = await menuitemRepository.deleteMenuitems(menuId);
        res.status(200).json({
          message: "Menu is successfully deleted",
        });
      } catch (err) {
        res.status(400);
        throw new Error(`Menuitem deletion failed`);
      }
    } else {
      res.status(400);
      throw new Error(`Menu deletion failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting menu",
      error: err.message,
    });
  }
});

const getMenuByRestaurant = expressAsyncHandler(async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const result = await menuRepository.getMenuByRestaurant(restaurantId);

    if (result) {
      try {
        const menuItems = await menuitemRepository.getAllMenuitemsByMenuId(result._id);
        const extractedItems = menuItems.map(({ _id, fooditemId, fooditemName, fooditemImage, fooditemPrice }) => ({
          _id,
          fooditemId,
          fooditemName,
          fooditemImage,
          fooditemPrice,
        }));
        if (req.query) {
          if (Object.keys(req.query)[0] == "cuisine") {
            // Step 1: Find cuisine id of the matching cuisine
            const cuisineId = await cuisineRepository.getCuisineIdByName(Object.values(req.query)[0]);
            // Step 2: Find food items matching the selected cuisine
            const selectedCuisineFooditems = await fooditemRepository.getFooditemsByCuisineId(cuisineId);
            // Step 3 : Find ids of the fooditems matching the selected cuisine
            const selectedCuisineFooditemsIds = selectedCuisineFooditems.map(fooditem => fooditem.id);
            // Create a map of fooditemIds from selectedCuisineFooditemsIds for quick lookup
            const selectedFooditemIdsMap = {};
            selectedCuisineFooditemsIds.forEach(id => {
              selectedFooditemIdsMap[id] = true;
            });
            // Sort the extractedItems array based on the selectedFooditemIdsMap
            extractedItems.sort((a, b) => {
              const aIsSelected = selectedFooditemIdsMap[a.fooditemId];
              const bIsSelected = selectedFooditemIdsMap[b.fooditemId];

              if (aIsSelected && !bIsSelected) {
                return -1;
              } else if (!aIsSelected && bIsSelected) {
                return 1;
              } else {
                return 0;
              }
            });

            console.log(extractedItems);
          }

          else if (Object.keys(req.query)[0] == "category") {
            // Step 1: Find category id of the matching category
            const categoryId = await categoryRepository.getCategoryIdByName(Object.values(req.query)[0]);
            // Step 2: Find food items matching the selected category
            const selectedCategoryFooditems = await fooditemRepository.getFooditemsByCategoryId(categoryId);
            //Step 3 : Find ids of the fooditems matching the selected category
            const selectedCategoryFooditemsIds = selectedCategoryFooditems.map(fooditem => fooditem.id);
            // Create a map of fooditemIds from selectedCategoryFooditemsIds for quick lookup
            const selectedFooditemIdsMap = {};
            selectedCategoryFooditemsIds.forEach(id => {
              selectedFooditemIdsMap[id] = true;
            });
            // Sort the extractedItems array based on the selectedFooditemIdsMap
            extractedItems.sort((a, b) => {
              const aIsSelected = selectedFooditemIdsMap[a.fooditemId];
              const bIsSelected = selectedFooditemIdsMap[b.fooditemId];

              if (aIsSelected && !bIsSelected) {
                return -1;
              } else if (!aIsSelected && bIsSelected) {
                return 1;
              } else {
                return 0;
              }
            });

          }
        }
        res.status(200).json({
          data: {
            _id: result._id,
            restaurantId: result.restaurantId,
            menu: extractedItems
          },
          message: "Sucessfully fetched menu details.",
        });
      } catch (err) {
        console.log(err);
        res.status(204);
        throw new Error(
          `Not able to find the menuitems based on the restaurant id: ${restaurantId}`
        );
      }
    } else {
      res.status(204);
      throw new Error(
        `Not able to find the menu based on the restaurant id: ${restaurantId}`
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching menu details",
      error: err.message,
    });
  }
});


module.exports = {
  createMenu,
  editMenu,
  deleteMenu,
  getMenuByRestaurant,
};
