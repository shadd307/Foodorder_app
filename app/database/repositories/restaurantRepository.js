const RestaurantModel = require("../../models/restaurantModel");

const createRestaurant = async (name, address, contact, image) => {
  try {
    const newRestaurant = await RestaurantModel.create({
      name: name,
      address: address,
      contact: contact,
      image: image
    });
    return newRestaurant;
  } catch (err) {
    throw new Error(`Error while creating restaurant: ${err.message}`);
  }
};

const editRestaurant = async (restaurantId, newData) => {
  try {
    const restaurantObject = await RestaurantModel.findOne({
      _id: restaurantId,
      isActive: true,
    });

    if (!restaurantObject) {
      return null;
    }

    restaurantObject.name = newData.name;
    restaurantObject.address = newData.address;
    restaurantObject.contact = newData.contact;
    restaurantObject.image = newData.image;

    const updatedRestaurant = await restaurantObject.save();
    return updatedRestaurant;
  } catch (err) {
    throw new Error(`Error while editing restaurant: ${err.message}`);
  }
};

const deleteRestaurant = async (restaurantId) => {
  try {
    const restaurantObject = await RestaurantModel.findById(restaurantId);

    if (!restaurantObject) {
      return null;
    }

    restaurantObject.isActive = false;
    const updatedRestaurant = await restaurantObject.save();
    return updatedRestaurant;
  } catch (err) {
    throw new Error(`Error while deleting restaurant: ${err.message}`);
  }
};

const getRestaurant = async (restaurantId) => {
  try {
    const restaurantObject = await RestaurantModel.findOne({
      _id: restaurantId,
      isActive: true,
    });
    return restaurantObject;
  } catch (err) {
    throw new Error(`Error while fetching restaurant: ${err.message}`);
  }
};

const getAllRestaurants = async () => {
  try {
    const restaurants = await RestaurantModel.find({ isActive: true });
    return restaurants;
  } catch (err) {
    throw new Error(`Error while fetching restaurants: ${err.message}`);
  }
};

const getRestaurantsByIds = async (restaurantIdsArray) => {
  try {
    const restaurantObjects = await RestaurantModel.find({
      _id: { $in : restaurantIdsArray },
      isActive: true,
    });
    return restaurantObjects;
  } catch (err) {
    throw new Error(`Error while fetching restaurant: ${err.message}`);
  }
};

module.exports = {
  createRestaurant,
  editRestaurant,
  deleteRestaurant,
  getRestaurant,
  getAllRestaurants,
  getRestaurantsByIds,
};
