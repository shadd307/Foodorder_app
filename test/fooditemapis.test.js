const chai = require("chai");
const request = require("supertest");

const expect = chai.expect;
const { app } = require("../server");
const FooditemModel = require("../app/models/fooditemModel");
const CategoryModel = require("../app/models/categoryModel");
const CuisineModel = require("../app/models/cuisineModel");

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Fooditem APIs Tests", function () {
  var sessionToken;
  var category;
  var cuisine;
  var testFooditem;
  before(async () => {
    console.log = function () {};
    console.error = function () {};

    FooditemModel.deleteMany();

    let credentials = {
      username: "testuser",
      password: "testpassword",
    };

    const res = await request(app).post("/api/v1/users/login").send(credentials);

    sessionToken = res.body.data.sessionToken;
    console.log("Token Generated", sessionToken);

    category = await CategoryModel.findOne({ isActive: true });
    cuisine = await CuisineModel.findOne({isActive: true});
  });

  after(async () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe("POST /api/v1/fooditems/", () => {
    it("should add a new fooditem", async () => {
      const newFooditem = {
        name: "Test Food",
        description: "This is a test food item",
        price: 9.99,
        imageUrl: "test-image-url",
        categoryId: category._id,
        cuisineId: cuisine._id,
      };
      const res = await request(app)
      .post("/api/v1/fooditems/")
      .set("Authorization", `Bearer ${sessionToken}`)
      .send(newFooditem);

    expect(res).to.have.status(201);
    expect(res.body.data).to.have.property("_id");
    expect(res.body.data.name).to.equal("Test Food");
    testFooditem = res.body.data;

    const savedFooditem = await FooditemModel.findOne({ _id: testFooditem._id });
    expect(savedFooditem).to.not.be.null;
  });
  it("should return 401 incase token is not provided in request", async () => {
    const newFooditem = {
      name: "Test Food",
      description: "This is a test food item",
      price: 9.99,
      imageUrl: "test-image-url",
      categoryId: category._id,
      cuisineId: cuisine._id,
    };

    const res = await request(app).post("/api/v1/fooditems/").send(newFooditem);

    expect(res).to.have.status(401);
    });
  });
  describe("GET /api/v1/fooditems", () => {
    it("should return 200 OK with fooditems", async function () {
      const res = await request(app)
        .get("/api/v1/fooditems")
        .set("Authorization", `Bearer ${sessionToken}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an("array");
    });
  });
});
