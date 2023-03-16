// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const process = require("node:process");
const path = require("node:path");

// ===============
// EXPORTS
// ===============

module.exports = {
  get env() {
    return process.env.NODE_ENV || "test";
  },
  get port() {
    return process.env.PORT || "3000";
  },

  get logPath() {
    return process.env.LOG_PATH || path.resolve(__dirname, "../logs");
  },
};
