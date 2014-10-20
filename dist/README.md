Distributions
=============
bcrypt.js is available either without a random fallback or with ISAAC:

### Standard

This version relies on the crypto module under node.js and the Web Crypto API in the browser, providing you with the
option to specify a random fallback for browser environments that do not support the Web Crypto API natively (use
`bcrypt.setRandomFallback`).

* **[bcrypt.js](https://github.com/dcodeIO/bcrypt.js/blob/master/dist/bcrypt.js)**
  contains the commented source code.

* **[bcrypt.min.js](https://github.com/dcodeIO/bcrypt.js/blob/master/dist/bcrypt.min.js)**
  has been compiled with Closure Compiler using advanced optimizations.
