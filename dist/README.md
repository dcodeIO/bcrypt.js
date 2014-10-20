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
  
The standard version, which is slightly smaller, is recommended if you are already using a Web Crypto API polyfill or
intend to not support anything else / intend to use a custom random fallback.

### Including ISAAC PRNG as default random fallback

The Web Crypto API is fairly new and not supported by all / older browsers. For maximum compatibility this version
includes [isaac.js](https://github.com/rubycon/isaac.js), a JavaScript implementation of the ISAAC CSPRNG, in conjunction
with an [entropy accumulator](https://github.com/dcodeIO/bcrypt.js/blob/master/src/bcrypt/prng/accum.js) for initial
seeding, which are then used as the default random fallback if neither node's crypto module nor the Web Crypto API is
available.

**See also:** [fallback random number generators considered insecure](https://github.com/dcodeIO/bcrypt.js/issues/16)

* **[bcrypt-isaac.js](https://github.com/dcodeIO/bcrypt.js/blob/master/dist/bcrypt-isaac.js)**
  contains the commented source code.

* **[bcrypt-isaac.min.js](https://github.com/dcodeIO/bcrypt.js/blob/master/dist/bcrypt-isaac.min.js)**
  has been compiled with Closure Compiler using advanced optimizations.
