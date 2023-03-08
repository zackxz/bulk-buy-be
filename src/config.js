const process = require("node:process");

module.exports = {
  get env() {
    return process.env.NODE_ENV || "test";
  },
  get port() {
    return process.env.PORT || "3000";
  },
};
