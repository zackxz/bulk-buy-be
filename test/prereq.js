/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const process = require("node:process");

// ===============
// TESTS
// ===============

const clearRequireCache = function () {
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
  });
};

// using defaults from config
delete process.env.PORT;
delete process.env.NODE_ENV;
clearRequireCache();
require("./core");

// randomize port
process.env.PORT = 0;
process.env.NODE_ENV = "dev";
clearRequireCache();
require("./core");
