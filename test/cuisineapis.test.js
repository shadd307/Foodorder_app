const chai = require("chai");
const request = require("supertest");

const expect = chai.expect;
const { app } = require("../server");
const CuisineModel = require("../app/models/cuisineModel");

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Cuisine APIs Tests", function () {
  var sessionToken;
  before(async () => {
    console.log = function () {};
    console.error = function () {};

    await CuisineModel.deleteMany();
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

  const testCuisine = {
    name: "testCuisine",
    description: "Test Cuisine description",
    image:"Test Cuisine Image URL"
  };

  describe("POST /api/v1/cuisines/", async () => {
    it("should add a new cuisine", async () => {
      const res = await request(app)
        .post("/api/v1/cuisines/")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send(testCuisine);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("Cuisine created successfully");
    });

    it("should return 401 incase token is not provided in request", async () => {
      const res = await request(app)
        .post("/api/v1/cuisines/")
        .send(testCuisine);

      expect(res.status).to.equal(401);
    });
  });
  describe("GET /api/v1/cuisines", function () {
    it("should return 200 OK with cuisines", async function () {
      const response = await request(app)
        .get("/api/v1/cuisines")
        .expect(200)
        .expect("Content-Type", /json/);

      const cuisines = response.body.data;
      expect(cuisines).to.be.an("array");
      expect(cuisines).length.greaterThanOrEqual(0);

      cuisines.forEach((cuisine) => {
        expect(cuisine.name).to.be.an("string");
        expect(cuisine.description).to.be.an("string");
        expect(cuisine.image).to.be.an("string");
      });
    });
  });
});
