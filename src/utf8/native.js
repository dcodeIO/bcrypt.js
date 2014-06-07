// #include "utf8/codepoint.js"

/**
 * Encodes a unicode code point to bytes.
 * @param {number} codePoint Code point to encode
 * @param {Array.<number>} out Output array
 */
function utf8_encode_char(codePoint, out) {
    if (codePoint < 0)
        throw RangeError("Illegal code point: "+codePoint);
    if (codePoint < 0x80) {
        out.push(  codePoint     &0x7F);
    } else if (codePoint < 0x800) {
        out.push(((codePoint>>6 )&0x1F)|0xC0);
        out.push(( codePoint     &0x3F)|0x80);
    } else if (codePoint < 0x10000) {
        out.push(((codePoint>>12)&0x0F)|0xE0);
        out.push(((codePoint>>6 )&0x3F)|0x80);
        out.push(( codePoint     &0x3F)|0x80);
    } else if (codePoint < 0x110000) {
        out.push(((codePoint>>18)&0x07)|0xF0);
        out.push(((codePoint>>12)&0x3F)|0x80);
        out.push(((codePoint>>6 )&0x3F)|0x80);
        out.push(( codePoint     &0x3F)|0x80);
    } else
        throw RangeError("Illegal code point: "+codePoint);
}
