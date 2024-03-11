const MenuitemModel = require("../../models/menuitemModel");

const createMenuitems = async (menuItemsToInsert) => {
  try {
    const newMenuitem = await MenuitemModel.insertMany(menuItemsToInsert);
    return newMenuitem;
  } catch (err) {
    console.log(err);
    throw new Error(`Error while creating menuitem: ${err.message}`);
  }
};

const editMenuitems = async (menuitemsToEdit) => {
  // Create an array of update operations
  const updateOperations = menuitemsToEdit.map(({ _id, fooditemPrice }) => ({
    updateOne: {
      filter: { _id }, // Match documents by _id
      update: {
        $set: {
          fooditemPrice,
        },
      },
    },
  }));
  try {
    // Bulk update all the matched documents
    MenuitemModel.bulkWrite(updateOperations)
      .then((result) => {
        console.log(`Updated ${result.modifiedCount} documents`);
      })
      .catch((error) => {
        console.error(error);
      });
      return "OK";
  } catch (err) {
    throw new Error(`Error while editing menuitem: ${err.message}`);
  }
};

const deleteMenuitems = async (menuId) => {
  try {
    const menuitemObject = await MenuitemModel.deleteMany({ menuId: menuId });
    return menuitemObject;
  } catch (err) {
    throw new Error(`Error while deleting menuitem: ${err.message}`);
  }
};

const getAllMenuitemsByMenuId = async (menuId) => {
  try {
    const menuitems = await MenuitemModel.find({
      menuId: menuId,
      isActive: true,
    });
    return menuitems;
  } catch (err) {
    throw new Error(`Error while fetching menuitem: ${err.message}`);
  }
};

const getAllMenuitemsByFooditemIds = async(fooditemIdsArray) => {
  try {
    const menuitems = await MenuitemModel.find({
      fooditemId: { $in: fooditemIdsArray },
      isActive: true,
    });
    return menuitems;
  } catch (err) {
    throw new Error(`Error while fetching menuitem: ${err.message}`);
  }
}
module.exports = {
  createMenuitems,
  editMenuitems,
  deleteMenuitems,
  getAllMenuitemsByMenuId,
  getAllMenuitemsByFooditemIds,
};
