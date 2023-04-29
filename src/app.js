#!/usr/bin/env node

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const console = require("node:console");
const process = require("node:process");

/**
 * Module dependencies.
 */

const debug = require("debug")("bulk-buy-be:server");

const express = require("express");
const logger = require("morgan");
const compression = require("compression");

/**
 * Internal dependencies.
 */

const config = require("./config");
const router = require("./router");

// ===============
// EXPRESS CONFIG
// ===============

const app = express();
app.use(
  logger("dev", {
    skip: () => config.env === "test",
  })
);
app.use(express.json());
app.use(compression());

app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.use(router);

// ===============
// HTTP SERVER
// ===============

/**
 * Normalize a port into a number, string, or false.
 * @param {string} val
 */

/* istanbul ignore next */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.port);

/**
 * Listen on provided port, on all network interfaces.
 */

let server;
const start = (cb) => {
  if (server && server.listening) {
    // will throw error because server is already listening
    try {
      server.listen();
    } catch (err) {
      /* istanbul ignore else: there is no else path */
      if (typeof cb === "function") cb(err);
      return;
    }
  }
  server = app.listen(port);
  server.start = start;

  /**
   * Event listener for HTTP server "error" event.
   * @param {Error} error
   */

  /* istanbul ignore next */
  server.on("error", (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  /**
   * Event listener for HTTP server "listening" event.
   */

  server.once("listening", () => {
    if (typeof cb === "function") cb();
  });

  /* istanbul ignore next */
  server.on("listening", () => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? `Pipe ${addr}` : `Port ${addr.port}`;
    debug(`Listening on ${bind}`);
  });

  /**
   * Event listener for custom "closed" event.
   * @param {Error} err
   */

  server.on("closed", (err) => {
    if (!err) debug("HTTP server closed");
  });
};
start();

// ===============
// GRACEFUL SHUTDOWN
// ===============

process.on("SIGTERM", () => {
  debug(
    `SIGTERM signal received: ${
      server.listening ? "closing HTTP server" : "HTTP server already closed"
    }`
  );

  server.close((err) => {
    // custom "closed" event as "close" event does not contain params
    server.emit("closed", err);
  });
});

// ===============
// EXPORTS
// ===============

module.exports = {
  get server() {
    return server;
  },
};
