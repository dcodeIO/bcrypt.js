//? include("../../node_modules/utfx/dist/utfx-embeddable.js");

/**
 * Continues with the callback on the next tick.
 * @param {function(...[*])} callback Callback to execute
 * @inner
 */
function nextTick(callback) {
    if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
        if (typeof setImmediate === 'function')
            setImmediate(callback);
        else
            process.nextTick(callback);
    } else
        setTimeout(callback, 0);
}

/**
 * Converts a JavaScript string to UTF8 bytes.
 * @param {string} str String
 * @returns {!Array.<number>} UTF8 bytes
 * @inner
 */
function stringToBytes(str) {
    var out = [],
        i = 0;
    utfx.encodeUTF16toUTF8(function() {
        if (i >= str.length) return null;
        return str.charCodeAt(i++);
    }, function(b) {
        out.push(b);
    });
    return out;
}
