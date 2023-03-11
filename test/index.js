/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Module dependencies.
 */

const request = require("supertest");

describe("express", () => {
  const app = require("../src/app");
  app.start();

  describe("favicon", () => {
    it("should return 204", (done) => {
      request(app).get("/favicon.ico").expect(204, done);
    });
  });

  describe("path found", () => {
    it("should return 200", (done) => {
      request(app).get("/").expect(200, done);
    });
  });

  describe("path not found", () => {
    it("should return 404", (done) => {
      request(app).get("/random").expect(404, done);
    });
  });

  // clean up
  after((done) => {
    app.close(done);
  });
});
