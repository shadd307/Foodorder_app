const fooditemRepository = require("../database/repositories/fooditemRepository");
const expressAsyncHandler = require("express-async-handler");

const createFooditem = expressAsyncHandler(async (req, res) => {
  const foodItem = await fooditemRepository.createFooditem(req.body);
  res.status(201).json(foodItem);
});

const editFooditem = expressAsyncHandler(async (req, res) => {
  const foodItem = await fooditemRepository.editFooditem(req.params.id, req.body);
  if (!foodItem) {
    res.status(404).json({ message: 'Food item not found' });
  } else {
    res.json(foodItem);
  }
});

const deleteFooditem = expressAsyncHandler(async (req, res) => {
  const foodItem = await fooditemRepository.deleteFooditem(req.params.id);
  if (!foodItem) {
    res.status(404).json({ message: 'Food item not found' });
  } else {
    res.json({ message: 'Food item deleted' });
  }
});

const getFooditem = expressAsyncHandler(async (req, res) => {
  const foodItem = await fooditemRepository.getFooditem(req.params.id);
  if (!foodItem) {
    res.status(404).json({ message: 'Food item not found' });
  } else {
    res.json(foodItem);
  }
});

const getAllFooditems = expressAsyncHandler(async (req, res) => {
  const foodItems = await fooditemRepository.getAllFooditems();
  res.json(foodItems);
});

module.exports = {
  createFooditem,
  editFooditem,
  deleteFooditem,
  getFooditem,
  getAllFooditems,
};
