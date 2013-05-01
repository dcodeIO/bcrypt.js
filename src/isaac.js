// ifdef UNDEFINED
/*
 Copyright (c) 2012 Yves-Marie K. Rinquin
 Copyright (c) 2013 Daniel Wirtz <dcode@dcode.io>
 
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// endif
var Isaac = (function() {
    
    /**
     * Constructs a new Isaac pseudo random number generator.
     * @class Isaac PRNG.
     * @constructor
     */
    var Isaac = function() {
        /** @type {Array.<number>} */
        this.m = Array(256);
        /** @type {number} */
        this.acc = 0;
        /** @type {number} */
        this.brs = 0;
        /** @type {number} */
        this.cnt = 0;
        /** @type {Array.<number>} */
        this.r = Array(256);
        /** @type {number} */
        this.gnt = 0;
        
        // Pre-seed
        this.seed(Math.random() * 0xffffffff);
    };
    
    /**
     * Safely adds two 32-bit integers.
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    Isaac.add = function(x, y) {
        var lsb = (x & 0xffff) + (y & 0xffff);
        var msb = (x >>>   16) + (y >>>   16) + (lsb >>> 16);
        return (msb << 16) | (lsb & 0xffff);
    };
    
    /**
     * Resets the internal state.
     */
    Isaac.prototype.reset = function() {
        this.acc = this.brs = this.cnt = 0;
        for(var i = 0; i < 256; ++i)
            this.m[i] = this.r[i] = 0;
        this.gnt = 0;
    };
    
    /**
     * Seeds the generator.
     * @param s Seed
     */
    Isaac.prototype.seed = function(s) {
        var a, b, c, d, e, f, g, h, i;
    
        // seeding the seeds of love
        a = b = c = d = e = f = g = h = 0x9e3779b9; // the golden ratio
    
        if(s && typeof(s) === 'number') s = [s];
        if(s instanceof Array) {
            this.reset();
            for(i = 0; i < s.length; i++)
                this.r[i & 0xff] += (typeof(s[i]) === 'number') ? s[i] : 0;
        }
    
        // seed mixer
        function mix() {
            a ^= b <<  11; d = Isaac.add(d, a); b = Isaac.add(b, c);
            b ^= c >>>  2; e = Isaac.add(e, b); c = Isaac.add(c, d);
            c ^= d <<   8; f = Isaac.add(f, c); d = Isaac.add(d, e);
            d ^= e >>> 16; g = Isaac.add(g, d); e = Isaac.add(e, f);
            e ^= f <<  10; h = Isaac.add(h, e); f = Isaac.add(f, g);
            f ^= g >>>  4; a = Isaac.add(a, f); g = Isaac.add(g, h);
            g ^= h <<   8; b = Isaac.add(b, g); h = Isaac.add(h, a);
            h ^= a >>>  9; c = Isaac.add(c, h); a = Isaac.add(a, b);
        }
    
        for(i = 0; i < 4; i++) mix(); // scramble it
        for(i = 0; i < 256; i += 8) {
            if(s) { // use all the information in the seed
                a = Isaac.add(a, this.r[i + 0]); b = Isaac.add(b, this.r[i + 1]);
                c = Isaac.add(c, this.r[i + 2]); d = Isaac.add(d, this.r[i + 3]);
                e = Isaac.add(e, this.r[i + 4]); f = Isaac.add(f, this.r[i + 5]);
                g = Isaac.add(g, this.r[i + 6]); h = Isaac.add(h, this.r[i + 7]);
            }
            mix();
            // fill in m[] with messy stuff
            this.m[i + 0] = a; this.m[i + 1] = b; this.m[i + 2] = c; this.m[i + 3] = d;
            this.m[i + 4] = e; this.m[i + 5] = f; this.m[i + 6] = g; this.m[i + 7] = h;
        }
        if (s) { // do a second pass to make all of the seed affect all of m[]
            for(i = 0; i < 256; i += 8) {
                a = Isaac.add(a, this.m[i + 0]); b = Isaac.add(b, this.m[i + 1]);
                c = Isaac.add(c, this.m[i + 2]); d = Isaac.add(d, this.m[i + 3]);
                e = Isaac.add(e, this.m[i + 4]); f = Isaac.add(f, this.m[i + 5]);
                g = Isaac.add(g, this.m[i + 6]); h = Isaac.add(h, this.m[i + 7]);
                mix();
                // fill in m[] with messy stuff (again)
                this.m[i + 0] = a; this.m[i + 1] = b; this.m[i + 2] = c; this.m[i + 3] = d;
                this.m[i + 4] = e; this.m[i + 5] = f; this.m[i + 6] = g; this.m[i + 7] = h;
            }
        }
        this.prng(); // fill in the first set of results */
        this.gnt = 256; // prepare to use the first set of results */
    };
    
    /**
     * Runs the generator.
     * @param {number=} n Number of runs, defaults to 1
     */
    Isaac.prototype.prng = function(n) {
        var i, x, y;
        
        n = n && typeof(n) === 'number' ? Math.abs(Math.floor(n)) : 1;
        
        while(n--) {
            this.cnt = Isaac.add(this.cnt, 1);
            this.brs = Isaac.add(this.brs, this.cnt);
    
            for(i = 0; i < 256; i++) {
                switch(i & 3) {
                    case 0: this.acc ^= this.acc <<  13; break;
                    case 1: this.acc ^= this.acc >>>  6; break;
                    case 2: this.acc ^= this.acc <<   2; break;
                    case 3: this.acc ^= this.acc >>> 16; break;
                }
                this.acc = Isaac.add(this.m[(i +  128) & 0xff], this.acc); x = this.m[i];
                this.m[i] = y = Isaac.add(this.m[(x >>>  2) & 0xff], Isaac.add(this.acc, this.brs));
                this.r[i] = this.brs = Isaac.add(this.m[(y >>> 10) & 0xff], x);
            }
        }
    };
    
    /**
     * Generates a random 32-bit number.
     * @returns {number}
     */
    Isaac.prototype.rand = function() {
        if(!this.gnt--) {
            this.prng();
            this.gnt = 255;
        }
        return this.r[this.gnt];
    };
    
    /**
     * Generates a cryptographically secure array of bytes.
     * @param {number} len Length
     * @returns {Array.<number>} Random bytes
     */
    Isaac.prototype.randomBytes = function(len) {
        var a = [], r;
        for (var i=0; i<len; i++) {
            a.push(Math.floor((0.5 + this.rand() * 2.3283064365386963e-10)*256));
        }
        return a;
    };
    
    return Isaac;
    
})();
