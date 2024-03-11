const chai = require("chai");
const request = require("supertest");

const expect = chai.expect;
const { app } = require("../server");
const CategoryModel = require("../app/models/categoryModel");

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Category APIs Tests", function () {
  var sessionToken;
  before(async () => {
    console.log = function () {};
    console.error = function () {};

    await CategoryModel.deleteMany();
    let credentials = {
      username: "testuser",
      password: "testpassword",
    };

    const res = await request(app).post("/api/v1/users/login").send(credentials);

    sessionToken = res.body.data.sessionToken;
    console.log("Token Generated", sessionToken);
  });

  after(async () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  const testCategory = {
    name: "testCategory",
    description: "Test Category description",
    image: "Test Category Image URL"
  };

  describe("POST /api/v1/categories/", async () => {
    it("should add a new category", async () => {
      const res = await request(app)
        .post("/api/v1/categories/")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send(testCategory);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("Category created successfully");
    });

    it("should return 401 incase token is not provided in request", async () => {
      const res = await request(app)
        .post("/api/v1/categories/")
        .send(testCategory);

      expect(res.status).to.equal(401);
    });
  });
  describe("GET /api/v1/categories", function () {
    it("should return 200 OK with categories", async function () {
      const response = await request(app)
        .get("/api/v1/categories")
        .expect(200)
        .expect("Content-Type", /json/);

      const categories = response.body.data;
      expect(categories).to.be.an("array");
      expect(categories).length.greaterThanOrEqual(0);

      categories.forEach((category) => {
        expect(category.name).to.be.an("string");
        expect(category.description).to.be.an("string");
        expect(category.image).to.be.an("string");
      });
      
    });
  });
});
