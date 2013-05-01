// #ifdef UNDEFINED
//
// TODO (dcode): Now that it's optimized, find out if we really need this. The only advantage over using Buffer to do
// this actually is decoding to a fixed output length, which is much faster than calling Buffer.toString for each
// character separately.
//
// #endif
/**
 * @type {Array.<string>}
 * @const
 * @private
 **/
var BASE64_CODE = ['.', '/', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
    '9'];

/**
 * @type {Array.<number>}
 * @const
 * @private
 **/
var BASE64_INDEX = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1,
    54, 55, 56, 57, 58, 59, 60, 61, 62, 63, -1, -1, -1, -1, -1, -1, -1,
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, -1, -1, -1, -1, -1, -1, 28, 29, 30, 31,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51, 52, 53, -1, -1, -1, -1, -1];

/**
 * Length-delimited base64 encoder and decoder.
 * @type {Object.<string,function(string, number)>}
 * @private
 */
var base64 = {};

/**
 * Encodes a byte array to base64 with up to len bytes of input.
 * @param {Array.<number>} b Byte array
 * @param {number} len Maximum input length
 * @returns {string}
 * @private
 */
base64.encode = function(b, len) {
    var off = 0;
    var rs = [];
    var c1;
    var c2;
    if (len <= 0 || len > b.length) {
        throw(new Error("Invalid 'len': "+len));
    }
    while (off < len) {
        c1 = b[off++] & 0xff;
        rs.push(BASE64_CODE[(c1 >> 2) & 0x3f]);
        c1 = (c1 & 0x03) << 4;
        if (off >= len) {
            rs.push(BASE64_CODE[c1 & 0x3f]);
            break;
        }
        c2 = b[off++] & 0xff;
        c1 |= (c2 >> 4) & 0x0f;
        rs.push(BASE64_CODE[c1 & 0x3f]);
        c1 = (c2 & 0x0f) << 2;
        if (off >= len) {
            rs.push(BASE64_CODE[c1 & 0x3f]);
            break;
        }
        c2 = b[off++] & 0xff;
        c1 |= (c2 >> 6) & 0x03;
        rs.push(BASE64_CODE[c1 & 0x3f]);
        rs.push(BASE64_CODE[c2 & 0x3f]);
    }
    return rs.join('');
};

/**
 * Decodes a base64 encoded string to up to len bytes of output.
 * @param {string} s String to decode
 * @param {number} len Maximum output length
 * @returns {Array.<number>}
 * @private
 */
base64.decode = function(s, len) {
    var off = 0;
    var slen = s.length;
    var olen = 0;
    var rs = [];
    var c1, c2, c3, c4, o, code;
    if (len <= 0) throw(new Error("Illegal 'len': "+len));
    while (off < slen - 1 && olen < len) {
        code = s.charCodeAt(off++);
        c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        code = s.charCodeAt(off++);
        c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        if (c1 == -1 || c2 == -1) {
            break;
        }
        o = (c1 << 2) >>> 0;
        o |= (c2 & 0x30) >> 4;
        rs.push(String.fromCharCode(o));
        if (++olen >= len || off >= slen) {
            break;
        }
        code = s.charCodeAt(off++);
        c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        if (c3 == -1) {
            break;
        }
        o = ((c2 & 0x0f) << 4) >>> 0;
        o |= (c3 & 0x3c) >> 2;
        rs.push(String.fromCharCode(o));
        if (++olen >= len || off >= slen) {
            break;
        }
        code = s.charCodeAt(off++);
        c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        o = ((c3 & 0x03) << 6) >>> 0;
        o |= c4;
        rs.push(String.fromCharCode(o));
        ++olen;
    }
    var res = [];
    for (off = 0; off<olen; off++) {
        res.push(rs[off].charCodeAt(0));
    }
    return res;
};