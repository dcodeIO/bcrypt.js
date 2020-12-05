var utf8Utils = require('./util/utf8.js');

/**
 * Continues with the callback on the next tick.
 * @function
 * @param {function(...[*])} callback Callback to execute
 * @inner
 */
function Utils() {}
Utils.prototype.nextTick = typeof process !== 'undefined' && process && typeof process.nextTick === 'function'
    ? (typeof setImmediate === 'function' ? setImmediate : process.nextTick)
    : setTimeout;

//? include("util/utf8.js");

/**
 * Converts a JavaScript string to UTF8 bytes.
 * @function
 * @param {string} str String
 * @returns {!Array.<number>} UTF8 bytes
 * @inner
 */
Utils.prototype.stringToBytes = utf8Utils.getBuffer.bind(utf8Utils);

//? include("util/base64.js");

Date.now = Date.now || function() { return +new Date; };

module.exports = new Utils();
