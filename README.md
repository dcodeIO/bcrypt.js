![bcrypt.js - bcrypt in plain JavaScript](https://raw.github.com/dcodeIO/bcrypt.js/master/bcrypt.png)
===========
Optimized bcrypt in plain JavaScript with zero dependencies. Compatible to the C++ [bcrypt](https://npmjs.org/package/bcrypt)
binding and also working in the browser.

Features ![Build Status](https://travis-ci.org/dcodeIO/bcrypt.js.png?branch=master)
--------
* CommonJS compatible (via [crypto](http://nodejs.org/api/crypto.html)), also available via [npm](https://npmjs.org/package/bcryptjs) 
* Browser compatible (via [WebCryptoAPI](http://www.w3.org/TR/WebCryptoAPI))
* AMD compatible
* Zero production dependencies
* Small footprint
* ISAAC PRNG as default fallback with bcrypt-isaac.js
* Compiled with Closure Compiler using advanced optimizations, [externs included](https://github.com/dcodeIO/bcrypt.js/blob/master/externs/bcrypt.js)

Security considerations
-----------------------
Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the
iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with
increasing computation power. ([see](http://en.wikipedia.org/wiki/Bcrypt))

While bcrypt.js is compatible to the C++ bcrypt binding, it is written in pure JavaScript and thus slower, effectively
reducing the number of iterations that can be processed in an equal time span.

Usage
-----

#### node.js
`npm install bcryptjs`

```javascript
var bcrypt = require('bcryptjs');
...
```

#### RequireJS/AMD
```javascript
require.config({
    "paths": {
        "bcrypt": "/path/to/bcrypt.js"
    }
});
require(["bcrypt"], function(bcrypt) {
    ...
});
```

#### Shim/browser
```html
<script src="//raw.github.com/dcodeIO/bcrypt.js/master/bcrypt.min.js"></script>
```
```javascript
var bcrypt = dcodeIO.bcrypt;
...
```

Usage - Sync
------------
To hash a password: 

```javascript
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
// Store hash in your password DB.
```

To check a password: 

```javascript
// Load hash from your password DB.
bcrypt.compareSync("B4c0/\/", hash); // true
bcrypt.compareSync("not_bacon", hash); // false
```

Auto-gen a salt and hash:

```javascript
var hash = bcrypt.hashSync('bacon', 8);
```

Usage - Async
-------------
To hash a password: 

```javascript
var bcrypt = require('bcryptjs');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
```

To check a password: 

```javascript
// Load hash from your password DB.
bcrypt.compare("B4c0/\/", hash, function(err, res) {
    // res == true
});
bcrypt.compare("not_bacon", hash, function(err, res) {
    // res = false
});
```

Auto-gen a salt and hash:

```javascript
bcrypt.hash('bacon', 8, function(err, hash) {
});
```

API
---
### setRandomFallback(random)

Sets the random number generator to use as a fallback if neither node's `crypto` module nor the Web Crypto API
is available.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| random          | *function(number):!Array.&lt;number&gt;* | Function taking the number of bytes to generate as its sole argument, returning the corresponding array of cryptographically secure random byte values. 
| **@see**        |                 | http://nodejs.org/api/crypto.html 
| **@see**        |                 | http://www.w3.org/TR/WebCryptoAPI/ 

### genSaltSync(rounds=, seed_length=)

Synchronously generates a salt.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| rounds          | *number*        | Number of rounds to use, defaults to 10 if omitted 
| seed_length     | *number*        | Not supported. 
| **@returns**    | *string*        | Resulting salt 
| **@throws**     | *Error*         | If a random fallback is required but not set 

### genSalt(rounds=, seed_length=, callback)

Asynchronously generates a salt.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| rounds          | *number &#124; function(Error, string=)* | Number of rounds to use, defaults to 10 if omitted 
| seed_length     | *number &#124; function(Error, string=)* | Not supported. 
| callback        | *function(Error, string=)* | Callback receiving the error, if any, and the resulting salt 

### hashSync(s, salt=)

Synchronously generates a hash for the given string.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| s               | *string*        | String to hash 
| salt            | *number &#124; string* | Salt length to generate or salt to use, default to 10 
| **@returns**    | *string*        | Resulting hash 

### hash(s, salt, callback, progressCallback=)

Asynchronously generates a hash for the given string.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| s               | *string*        | String to hash 
| salt            | *number &#124; string* | Salt length to generate or salt to use 
| callback        | *function(Error, string=)* | Callback receiving the error, if any, and the resulting hash 
| progressCallback | *function(number)* | Callback successively called with the percentage of rounds completed (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms. 

### compareSync(s, hash)

Synchronously tests a string against a hash.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| s               | *string*        | String to compare 
| hash            | *string*        | Hash to test against 
| **@returns**    | *boolean*       | true if matching, otherwise false 
| **@throws**     | *Error*         | If an argument is illegal 

### compare(s, hash, callback, progressCallback=)

Asynchronously compares the given data against the given hash.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| s               | *string*        | Data to compare 
| hash            | *string*        | Data to be compared to 
| callback        | *function(Error, boolean)* | Callback receiving the error, if any, otherwise the result 
| progressCallback | *function(number)* | Callback successively called with the percentage of rounds completed (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms. 
| **@throws**     | *Error*         | If the callback argument is invalid 

### getRounds(hash)

Gets the number of rounds used to encrypt the specified hash.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| hash            | *string*        | Hash to extract the used number of rounds from 
| **@returns**    | *number*        | Number of rounds used 
| **@throws**     | *Error*         | If hash is not a string 

### getSalt(hash)

Gets the salt portion from a hash. Does not validate the hash.

| Parameter       | Type            | Description
|-----------------|-----------------|---------------
| hash            | *string*        | Hash to extract the salt from 
| **@returns**    | *string*        | Extracted salt part 
| **@throws**     | *Error*         | If `hash` is not a string or otherwise invalid 


Command line
------------
`Usage: bcrypt <input> [salt]`

If the input has spaces inside, simply surround it with quotes.

Downloads
---------
* [Distributions](https://github.com/dcodeIO/bcrypt.js/tree/master/dist)
* [ZIP-Archive](https://github.com/dcodeIO/bcrypt.js/archive/master.zip)
* [Tarball](https://github.com/dcodeIO/bcrypt.js/tarball/master)

Credits
-------
Based on work started by Shane Girish at [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs) (MIT-licensed),
which is itself based on [javascript-bcrypt](http://code.google.com/p/javascript-bcrypt/) (New BSD-licensed).

License
-------
Apache License, Version 2.0 if not stated otherwise
