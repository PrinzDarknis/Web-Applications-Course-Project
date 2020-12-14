const debugColor = "\u001b[34m";
const initColor = "\u001b[36;1m";
const infoColor = "\u001b[32m";
const warningColor = "\u001b[33m";
const errorColor = "\u001b[35m";
const critColor = "\u001b[31m";

const resetColor = "\u001b[0m";
const DEBUG = process.env.DEBUG
  ? process.env.DEBUG.toLowerCase() == "true"
  : false;

exports.logDebug = function (msg) {
  if (DEBUG) {
    console.log("%s[DEBUG] %s%s", debugColor, String(msg), resetColor);
  }
};

exports.logInit = function (msg) {
  console.log("%s[INIT] %s%s", initColor, String(msg), resetColor);
};

exports.logInfo = function (msg) {
  console.log("%s[Info] %s%s", infoColor, String(msg), resetColor);
};

exports.logWarn = function (msg) {
  console.log("%s[WARNING] %s%s", warningColor, String(msg), resetColor);
};

exports.logError = function (msg, err = null) {
  console.log("%s[ERROR] %s%s", errorColor, String(msg), resetColor);
  if (err != null) {
    console.error(err);
  }
};

exports.logCrit = function (msg, err = null) {
  console.log("%s[CRITICAL] %s%s", critColor, String(msg), resetColor);
  if (err != null) {
    console.error(err);
  }
};
