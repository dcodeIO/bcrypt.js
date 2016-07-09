/**
 * Names of async bcrypt methods
 * @type {Array.<string>}
 * @inner
 */
var asyncMethodNames = [
  'hash',
  'genSalt',
  'compare'
];

asyncMethodNames.forEach(function(methodName) {
  bcrypt[methodName] = makePromisePolyfill(bcrypt[methodName]);
});

/**
 * Curries original method
 * Returns a promise if last argument passed to the curried function is a function
 * Calls a callback-style function if last argument passed to the curried function is not a function
 * @function
 * @param {function(data1,data2,callback,?progressCallback)} async bcrypt method
 * @returns {?Promise}
 * @inner
 */
function makePromisePolyfill(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var isPromise = typeof args[args.length] !== 'function';

    if (isPromise) return makePromise(method, args);
    else           return method.apply(bcrypt, args);
  }
}

/**
 * Wraps callback-style function in a promise
 * @function
 * @param {function(data1,data2,callback,?progressCallback)} callee method
 * @param {!Array.<(string|number|function)=>} array of callee method's arguments
 * @returns {Promise}
 * @inner
 */
function makePromise(method, args) {
  return new Promise(function(resolve, reject) {
    function callback(err, res) {
      if (err) return reject(err);

      resolve(res);
    }

    args.push(callback);
    method.apply(bcrypt, args);
  });
}
