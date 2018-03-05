/**
 * Continues with the callback on the next tick.
 * @function
 * @param {function(...[*])} callback Callback to execute
 * @inner
 */
var nextTick = typeof process !== 'undefined' && process && typeof process.nextTick === 'function'
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
var stringToBytes = utf8Array;

//? include("util/base64.js");

Date.now = Date.now || function() { return +new Date; };
