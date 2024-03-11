const MenuModel = require("../../models/menuModel");

const createMenu = async (restaurantId, description) => {
  try {
    const newMenu = await MenuModel.create({
      restaurantId: restaurantId,
      description: description,
    });
    return newMenu;
  } catch (err) {
    throw new Error(`Error while creating menu: ${err.message}`);
  }
};

const editMenu = async (menuId, description) => {
  try {
    const menuObject = await MenuModel.findOne({
      _id: menuId,
      isActive: true,
    });

    if (!menuObject) {
      return null;
    }

    menuObject.description = description;

    const updatedMenu = await menuObject.save();
    return updatedMenu;
  } catch (err) {
    throw new Error(`Error while editing menu: ${err.message}`);
  }
};

const deleteMenu = async (menuId) => {
  try {
    const menuObject = await MenuModel.deleteOne({_id:menuId});
    return menuObject
  } catch (err) {
    throw new Error(`Error while deleting menu: ${err.message}`);
  }
};

const getMenuById = async (id) => {
  try {
    const menuObject = await MenuModel.findOne({
      _id: id,
      isActive: true,
    });
    return menuObject;
  } catch (err) {
    throw new Error(`Error while fetching menu: ${err.message}`);
  }
};

const getMenusByIds = async (idsArray) => {
  try {
    const menuObjects = await MenuModel.find({
      _id: { $in : idsArray},
      isActive: true,
    });
    return menuObjects;
  } catch (err) {
    throw new Error(`Error while fetching menu: ${err.message}`);
  }
};

const getMenuByRestaurant = async (restaurantId) => {
  try {
    const menuObject = await MenuModel.findOne({
      restaurantId: restaurantId,
      isActive: true,
    });
    return menuObject;
  } catch (err) {
    throw new Error(`Error while fetching menu: ${err.message}`);
  }
};


module.exports = {
  createMenu,
  editMenu,
  deleteMenu,
  getMenuById,
  getMenusByIds,
  getMenuByRestaurant,
};
