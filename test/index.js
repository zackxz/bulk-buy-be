/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const assert = require("node:assert").strict;

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

  describe("graceful shutdown", () => {
    const process = require("node:process");

    describe("SIGTERM when server is running", () => {
      it("should stop listening", (done) => {
        assert.equal(app.listening, true, "should be listening");

        app.once("closed", (err) => {
          assert.ifError(err, "callback should not have error param");
          assert.equal(app.listening, false, "should not be listening");
          done();
        });

        process.emit("SIGTERM");
      });
    });

    describe("SIGTERM when server is not running", () => {
      it("should not throw error", (done) => {
        assert.equal(app.listening, false, "should not be listening");

        app.once("closed", (err) => {
          assert.ok(err, "callback should have error param");
          assert.equal(app.listening, false, "should not be listening");
          done();
        });

        process.emit("SIGTERM");
      });
    });
  });
});
