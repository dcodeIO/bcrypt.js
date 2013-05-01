/**
 * @fileoverview Definitions for dojo-bcrypt.
 * @externs
 * @author Daniel Wirtz <dcode@dcode.io>
 */

/**
 * @type {Object.<string,*>}
 */
var bcrypt = {};

/**
 * @param {number=} rounds
 * @param {number=} seed_length
 * @returns {string}
 */
bcrypt.genSaltSync = function(rounds, seed_length) {};

/**
 * @param {(number|function(Error, ?string))=} rounds
 * @param {(number|function(Error, ?string))=} seed_length
 * @param {function(Error, ?string)=} callback
 */
bcrypt.genSalt = function(rounds, seed_length, callback) {};

/**
 * @param {string} s
 * @param {(number|string)=} salt
 * @returns {?string}
 */
bcrypt.hashSync = function(s, salt) {};

/**
 * @param {string} s
 * @param {number|string} salt
 * @param {function(Error, ?string)} callback
 * @expose
 */
bcrypt.hash = function(s, salt, callback) {};

/**
 * @param {string} s
 * @param {string} hash
 * @returns {boolean}
 * @throws {Error}
 */
bcrypt.compareSync = function(s, hash) {};

/**
 * @param {string} s
 * @param {string} hash
 * @param {function(Error, boolean)} callback
 * @throws {Error}
 */
bcrypt.compare = function(s, hash, callback) {};

/**
 * @param {string} hash
 * @returns {number}
 * @throws {Error}
 */
bcrypt.getRounds = function(hash) {};

/**
 * @param {string} hash
 * @returns {string}
 * @throws {Error}
 * @expose
 */
bcrypt.getSalt = function(hash) {};
