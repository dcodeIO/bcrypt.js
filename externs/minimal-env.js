/**
 * @fileoverview Minimal environment for dojo-bcrypt.
 * @externs
 */

/**
 * @param {string} moduleName
 * returns {*}
 */
function require(moduleName) {}

/**
 * @constructor
 * @private
 */
var Module = function() {};

/**
 * @type {*}
 */
Module.prototype.exports;

/**
 * @type {Module}
 */
var module;

/**
 * @type {string}
 */
var __dirname;

/**
 * @type {Object.<string,*>}
 */
var process = {};

/**
 * @param {function()} func
 */
process.nextTick = function(func) {};

/**
 * @param {string} s
 * @constructor
 * @extends Array
 */
var Buffer = function(s) {};

/**
 BEGIN_NODE_INCLUDE
 var crypto = require('crypto');
 END_NODE_INCLUDE
 */

/**
 * @type {Object.<string,*>}
 */
var crypto = {};

/**
 * @param {number} n
 * @returns {Array.<number>}
 */
crypto.randomBytes = function(n) {};
