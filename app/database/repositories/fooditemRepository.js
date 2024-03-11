const FooditemModel = require("../../models/fooditemModel");

const createFooditem = async (name, description, image, categoryId, cuisineId, isVeg) => {
  try {
    const newFooditem = await FooditemModel.create({
      name: name,
      description: description,
      image: image,
      categoryId: categoryId,
      cuisineId: cuisineId,
      isVeg: isVeg
    });
    return newFooditem;
  } catch (err) {
    throw new Error(`Error while creating fooditem: ${err.message}`);
  }
};

const editFooditem = async (fooditemId, newData) => {
  try {
    const fooditemObject = await FooditemModel.findOne({
      _id: fooditemId,
      isActive: true,
    });

    if (!fooditemObject) {
      return null;
    }

    fooditemObject.name = newData.name;
    fooditemObject.description = newData.description;
    fooditemObject.image = newData.image;
    fooditemObject.categoryId = newData.categoryId;
    fooditemObject.cuisineId = newData.cuisineId;
    fooditemObject.isVeg = newData.isVeg;

    const updatedFooditem = await fooditemObject.save();
    return updatedFooditem;
  } catch (err) {
    throw new Error(`Error while editing fooditem: ${err.message}`);
  }
};

const deleteFooditem = async (fooditemId) => {
  try {
    const fooditemObject = await FooditemModel.findById(fooditemId);

    if (!fooditemObject) {
      return null;
    }

    fooditemObject.isActive = false;
    const updatedFooditem = await fooditemObject.save();
    return updatedFooditem;
  } catch (err) {
    throw new Error(`Error while deleting fooditem: ${err.message}`);
  }
};

const getFooditem = async (fooditemId) => {
  try {
    const fooditemObject = await FooditemModel.findOne({
      _id: fooditemId,
      isActive: true,
    });
    return fooditemObject;
  } catch (err) {
    throw new Error(`Error while fetching fooditem: ${err.message}`);
  }
};

const getAllFooditems = async () => {
  try {
    const fooditems = await FooditemModel.find({ isActive: true });
    return fooditems;
  } catch (err) {
    throw new Error(`Error while fetching fooditems: ${err.message}`);
  }
};

const getFooditemsByCuisineId = async(cuisineId) => {
  try {
    const fooditemObjects = await FooditemModel.find({
      cuisineId: cuisineId,
      isActive: true,
    });
    return fooditemObjects;
  } catch (err) {
    throw new Error(`Error while fetching fooditem: ${err.message}`);
  }
}

const getFooditemsByCategoryId = async(categoryId) => {
  try {
    const fooditemObjects = await FooditemModel.find({
      categoryId: categoryId,
      isActive: true,
    });
    return fooditemObjects;
  } catch (err) {
    throw new Error(`Error while fetching fooditem: ${err.message}`);
  }
}
module.exports = {
  createFooditem,
  editFooditem,
  deleteFooditem,
  getFooditem,
  getAllFooditems,
  getFooditemsByCuisineId,
  getFooditemsByCategoryId,
};
