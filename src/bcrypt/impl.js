var utils = require('./util.js');
var base64Utils = require('./util/base64.js');
var constants = require('./constants.js');
var BCRYPT_SALT_LEN = constants.BCRYPT_SALT_LEN;
var GENSALT_DEFAULT_LOG2_ROUNDS = constants.GENSALT_DEFAULT_LOG2_ROUNDS;
var BLOWFISH_NUM_ROUNDS = constants.BLOWFISH_NUM_ROUNDS;
var MAX_EXECUTION_TIME = constants.MAX_EXECUTION_TIME;
var P_ORIG = constants.P_ORIG;
var S_ORIG = constants.S_ORIG;
var C_ORIG = constants.C_ORIG;

function Impl() {}

/**
 * @param {Array.<number>} lr
 * @param {number} off
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @returns {Array.<number>}
 * @inner
 */
function _encipher(lr, off, P, S) { // This is our bottleneck: 1714/1905 ticks / 90% - see profile.txt
    var n,
        l = lr[off],
        r = lr[off + 1];

    l ^= P[0];

    /*
    for (var i=0, k=BLOWFISH_NUM_ROUNDS-2; i<=k;)
        // Feistel substitution on left word
        n  = S[l >>> 24],
        n += S[0x100 | ((l >> 16) & 0xff)],
        n ^= S[0x200 | ((l >> 8) & 0xff)],
        n += S[0x300 | (l & 0xff)],
        r ^= n ^ P[++i],
        // Feistel substitution on right word
        n  = S[r >>> 24],
        n += S[0x100 | ((r >> 16) & 0xff)],
        n ^= S[0x200 | ((r >> 8) & 0xff)],
        n += S[0x300 | (r & 0xff)],
        l ^= n ^ P[++i];
    */

    //The following is an unrolled version of the above loop.
    //Iteration 0
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[1];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[2];
    //Iteration 1
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[3];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[4];
    //Iteration 2
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[5];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[6];
    //Iteration 3
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[7];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[8];
    //Iteration 4
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[9];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[10];
    //Iteration 5
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[11];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[12];
    //Iteration 6
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[13];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[14];
    //Iteration 7
    n  = S[l >>> 24];
    n += S[0x100 | ((l >> 16) & 0xff)];
    n ^= S[0x200 | ((l >> 8) & 0xff)];
    n += S[0x300 | (l & 0xff)];
    r ^= n ^ P[15];
    n  = S[r >>> 24];
    n += S[0x100 | ((r >> 16) & 0xff)];
    n ^= S[0x200 | ((r >> 8) & 0xff)];
    n += S[0x300 | (r & 0xff)];
    l ^= n ^ P[16];

    lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
    lr[off + 1] = l;
    return lr;
}

/**
 * @param {Array.<number>} data
 * @param {number} offp
 * @returns {{key: number, offp: number}}
 * @inner
 */
function _streamtoword(data, offp) {
    for (var i = 0, word = 0; i < 4; ++i)
        word = (word << 8) | (data[offp] & 0xff),
        offp = (offp + 1) % data.length;
    return { key: word, offp: offp };
}

/**
 * @param {Array.<number>} key
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @inner
 */
function _key(key, P, S) {
    var offset = 0,
        lr = [0, 0],
        plen = P.length,
        slen = S.length,
        sw;
    for (var i = 0; i < plen; i++)
        sw = _streamtoword(key, offset),
        offset = sw.offp,
        P[i] = P[i] ^ sw.key;
    for (i = 0; i < plen; i += 2)
        lr = _encipher(lr, 0, P, S),
        P[i] = lr[0],
        P[i + 1] = lr[1];
    for (i = 0; i < slen; i += 2)
        lr = _encipher(lr, 0, P, S),
        S[i] = lr[0],
        S[i + 1] = lr[1];
}

/**
 * Expensive key schedule Blowfish.
 * @param {Array.<number>} data
 * @param {Array.<number>} key
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @inner
 */
function _ekskey(data, key, P, S) {
    var offp = 0,
        lr = [0, 0],
        plen = P.length,
        slen = S.length,
        sw;
    for (var i = 0; i < plen; i++)
        sw = _streamtoword(key, offp),
        offp = sw.offp,
        P[i] = P[i] ^ sw.key;
    offp = 0;
    for (i = 0; i < plen; i += 2)
        sw = _streamtoword(data, offp),
        offp = sw.offp,
        lr[0] ^= sw.key,
        sw = _streamtoword(data, offp),
        offp = sw.offp,
        lr[1] ^= sw.key,
        lr = _encipher(lr, 0, P, S),
        P[i] = lr[0],
        P[i + 1] = lr[1];
    for (i = 0; i < slen; i += 2)
        sw = _streamtoword(data, offp),
        offp = sw.offp,
        lr[0] ^= sw.key,
        sw = _streamtoword(data, offp),
        offp = sw.offp,
        lr[1] ^= sw.key,
        lr = _encipher(lr, 0, P, S),
        S[i] = lr[0],
        S[i + 1] = lr[1];
}

/**
 * Internaly crypts a string.
 * @param {Array.<number>} b Bytes to crypt
 * @param {Array.<number>} salt Salt bytes to use
 * @param {number} rounds Number of rounds
 * @param {function(Error, Array.<number>=)=} callback Callback receiving the error, if any, and the resulting bytes. If
 *  omitted, the operation will be performed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {!Array.<number>|undefined} Resulting bytes if callback has been omitted, otherwise `undefined`
 * @inner
 */
function _crypt(b, salt, rounds, callback, progressCallback) {
    var cdata = C_ORIG.slice(),
        clen = cdata.length,
        err;

    // Validate
    if (rounds < 4 || rounds > 31) {
        err = Error("Illegal number of rounds (4-31): "+rounds);
        if (callback) {
            utils.nextTick(callback.bind(this, err));
            return;
        } else
            throw err;
    }
    if (salt.length !== BCRYPT_SALT_LEN) {
        err =Error("Illegal salt length: "+salt.length+" != "+BCRYPT_SALT_LEN);
        if (callback) {
            utils.nextTick(callback.bind(this, err));
            return;
        } else
            throw err;
    }
    rounds = (1 << rounds) >>> 0;

    var P, S, i = 0, j;

    //Use typed arrays when available - huge speedup!
    if (Int32Array) {
        P = new Int32Array(P_ORIG);
        S = new Int32Array(S_ORIG);
    } else {
        P = P_ORIG.slice();
        S = S_ORIG.slice();
    }

    _ekskey(salt, b, P, S);

    /**
     * Calcualtes the next round.
     * @returns {Array.<number>|undefined} Resulting array if callback has been omitted, otherwise `undefined`
     * @inner
     */
    function next() {
        if (progressCallback)
            progressCallback(i / rounds);
        if (i < rounds) {
            var start = Date.now();
            for (; i < rounds;) {
                i = i + 1;
                _key(b, P, S);
                _key(salt, P, S);
                if (Date.now() - start > MAX_EXECUTION_TIME)
                    break;
            }
        } else {
            for (i = 0; i < 64; i++)
                for (j = 0; j < (clen >> 1); j++)
                    _encipher(cdata, j << 1, P, S);
            var ret = [];
            for (i = 0; i < clen; i++)
                ret.push(((cdata[i] >> 24) & 0xff) >>> 0),
                ret.push(((cdata[i] >> 16) & 0xff) >>> 0),
                ret.push(((cdata[i] >> 8) & 0xff) >>> 0),
                ret.push((cdata[i] & 0xff) >>> 0);
            if (callback) {
                callback(null, ret);
                return;
            } else
                return ret;
        }
        if (callback)
            utils.nextTick(next);
    }

    // Async
    if (typeof callback !== 'undefined') {
        next();

        // Sync
    } else {
        var res;
        while (true)
            if (typeof(res = next()) !== 'undefined')
                return res || [];
    }
}

/**
 * Internally hashes a string.
 * @param {string} s String to hash
 * @param {?string} salt Salt to use, actually never null
 * @param {function(Error, string=)=} callback Callback receiving the error, if any, and the resulting hash. If omitted,
 *  hashing is perormed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {string|undefined} Resulting hash if callback has been omitted, otherwise `undefined`
 * @inner
 */
Impl.prototype.hash = function(s, salt, callback, progressCallback) {
    var err;
    if (typeof s !== 'string' || typeof salt !== 'string') {
        err = Error("Invalid string / salt: Not a string");
        if (callback) {
            utils.nextTick(callback.bind(this, err));
            return;
        }
        else
            throw err;
    }

    // Validate the salt
    var minor, offset;
    if (salt.charAt(0) !== '$' || salt.charAt(1) !== '2') {
        err = Error("Invalid salt version: "+salt.substring(0,2));
        if (callback) {
            utils.nextTick(callback.bind(this, err));
            return;
        }
        else
            throw err;
    }
    if (salt.charAt(2) === '$')
        minor = String.fromCharCode(0),
        offset = 3;
    else {
        minor = salt.charAt(2);
        if ((minor !== 'a' && minor !== 'b' && minor !== 'y') || salt.charAt(3) !== '$') {
            err = Error("Invalid salt revision: "+salt.substring(2,4));
            if (callback) {
                utils.nextTick(callback.bind(this, err));
                return;
            } else
                throw err;
        }
        offset = 4;
    }

    // Extract number of rounds
    if (salt.charAt(offset + 2) > '$') {
        err = Error("Missing salt rounds");
        if (callback) {
            utils.nextTick(callback.bind(this, err));
            return;
        } else
            throw err;
    }
    var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10,
        r2 = parseInt(salt.substring(offset + 1, offset + 2), 10),
        rounds = r1 + r2,
        real_salt = salt.substring(offset + 3, offset + 25);
    s += minor >= 'a' ? "\x00" : "";

    var passwordb = utils.stringToBytes(s),
        saltb = base64Utils.decode(real_salt, BCRYPT_SALT_LEN);

    /**
     * Finishes hashing.
     * @param {Array.<number>} bytes Byte array
     * @returns {string}
     * @inner
     */
    function finish(bytes) {
        var res = [];
        res.push("$2");
        if (minor >= 'a')
            res.push(minor);
        res.push("$");
        if (rounds < 10)
            res.push("0");
        res.push(rounds.toString());
        res.push("$");
        res.push(base64Utils.encode(saltb, saltb.length));
        res.push(base64Utils.encode(bytes, C_ORIG.length * 4 - 1));
        return res.join('');
    }

    // Sync
    if (typeof callback == 'undefined')
        return finish(_crypt(passwordb, saltb, rounds));

    // Async
    else {
        _crypt(passwordb, saltb, rounds, function(err, bytes) {
            if (err)
                callback(err, null);
            else
                callback(null, finish(bytes));
        }, progressCallback);
    }
}

module.exports = new Impl();
