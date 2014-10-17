var bcrypt = require("bcrypt"),
    bcryptjs = require("../index.js"),
    pass = "ä☺𠜎️☁",
    testRounds = [8, 9, 10, 11, 12, 13, 14, 15];

function testSync(name, salt, impl) {
    var res;
    console.time(name);
    res = impl.hashSync(pass, salt);
    console.timeEnd(name);
    console.log("`"+res+"`  ");
}

function testAsync(name, salt, impl, cb) {
    console.time(name);
    impl.hash(pass, salt, function(err, res) {
        console.timeEnd(name);
        console.log("`"+res+"`  ");
        if (cb) cb();
    });
}

function testMax(name, impl) {
    var s = "",
        salt = bcryptjs.genSaltSync(4),
        last = null;
    while (s.length < 100) {
        s += "0";
        var hash = impl.hashSync(s, salt);
        if (hash === last) {
            console.log(name+" maximum input length is: "+(s.length-1));
            break;
        }
        last = hash;
    }
}

testMax("bcrypt.js", bcryptjs);

console.log("## Comparing bcryptjs with bcrypt\n");

function next() {
    if (testRounds.length === 0)
        return;
    (function(rounds) {
        var salt = bcryptjs.genSaltSync(rounds);
        console.log("#### Using "+rounds+" rounds");
        console.log("Salt: `"+salt+"`  ");
        testSync("* **bcrypt** sync", salt, bcrypt);
        testSync("* **bcrypt.js** sync", salt, bcryptjs);
        testAsync("* **bcrypt** async", salt, bcrypt, function() {
            testAsync("* **bcrypt.js** async", salt, bcryptjs, function() {
                console.log("");
                next();
            });
        });
    })(testRounds.shift());
}
next();
