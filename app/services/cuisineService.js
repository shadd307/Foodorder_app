const cuisineRepository = require("../database/repositories/cuisineRepository");
const expressAsyncHandler = require("express-async-handler");

const createCuisine = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const result = await cuisineRepository.createCuisine(name, description, image);

    if (result) {
      res.status(201).json({
        message: "Cuisine created successfully",
      });
    } else {
      res.status(400);
      throw new Error(`Cuisine creation failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating cuisine",
      error: err.message,
    });
  }
});

const editCuisine = expressAsyncHandler(async (req, res) => {
  try {
    const cuisineId = req.params.id;
    const result = await cuisineRepository.editCuisine(cuisineId, req.body);

    if (result) {
      res.status(200).json({
        message: "Cuisine is successfully edited",
      });
    } else {
      res.status(400);
      throw new Error(`Cuisine editing failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error editing cuisine details",
      error: err.message,
    });
  }
});

const deleteCuisine = expressAsyncHandler(async (req, res) => {
  try {
    const cuisineId = req.params.id;
    const result = await cuisineRepository.deleteCuisine(cuisineId);

    if (result) {
      res.status(200).json({
        message: "Cuisine is successfully deleted",
      });
    } else {
      res.status(400);
      throw new Error(`Cuisine deletion failed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting cuisine",
      error: err.message,
    });
  }
});

const getCuisine = expressAsyncHandler(async (req, res) => {
  try {
    const cuisineId = req.params.id;
    const result = await cuisineRepository.getCuisine(cuisineId);

    if (result) {
      res.status(200).json({
        data: result,
        message: "Sucessfully fetched cuisine details.",
      });
    } else {
      res.status(204);
      throw new Error(
        `Not able to find the cuisine based on the cuisine id: ${cuisineId}`
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching cuisine details",
      error: err.message,
    });
  }
});

const getAllCuisines = expressAsyncHandler(async (req, res) => {
  try {
    const result = await cuisineRepository.getAllCuisines();
    res.status(200).json({
      data: result,
      message: "Successfully fetched all cuisines.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching cuisines",
      error: err.message,
    });
  }
});

module.exports = {
  createCuisine,
  editCuisine,
  deleteCuisine,
  getCuisine,
  getAllCuisines,
};
