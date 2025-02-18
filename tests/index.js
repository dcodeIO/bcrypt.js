import assert from "node:assert";
import { createRequire } from "node:module";
import bcryptcpp from "bcrypt";
import bcrypt from "../index.js";

const require = createRequire(import.meta.url);

const tests = [
  function encodeBase64(done) {
    var str = bcrypt.encodeBase64(
      [
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f, 0x10,
      ],
      16,
    );
    assert.strictEqual(str, "..CA.uOD/eaGAOmJB.yMBu");
    done();
  },
  function decodeBase64(done) {
    var bytes = bcrypt.decodeBase64("..CA.uOD/eaGAOmJB.yMBv.", 16);
    assert.deepEqual(
      bytes,
      [
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f,
      ],
    );
    done();
  },
  function genSaltSync(done) {
    var salt = bcrypt.genSaltSync(10);
    assert(salt);
    assert(typeof salt === "string");
    assert(salt.length > 0);
    done();
  },
  function genSalt(done) {
    bcrypt.genSalt(10, function (err, salt) {
      assert(!err);
      assert(salt);
      assert(typeof salt === "string");
      assert(salt.length > 0);
      done();
    });
  },
  function hashSync(done) {
    assert.doesNotThrow(function () {
      bcrypt.hashSync("hello", 10);
    });
    assert.notEqual(bcrypt.hashSync("hello", 10), bcrypt.hashSync("hello", 10));
    done();
  },
  function hash(done) {
    bcrypt.hash("hello", 10, function (err, hash) {
      assert(!err);
      assert(hash);
      done();
    });
  },
  function compareSync(done) {
    var salt1 = bcrypt.genSaltSync(),
      hash1 = bcrypt.hashSync("hello", salt1); // $2b$
    var salt2 = bcrypt.genSaltSync().replace(/\$2b\$/, "$2y$"),
      hash2 = bcrypt.hashSync("world", salt2);
    var salt3 = bcrypt.genSaltSync().replace(/\$2b\$/, "$2a$"),
      hash3 = bcrypt.hashSync("hello world", salt3);

    assert.strictEqual(hash1.substring(0, 4), "$2b$");
    assert(bcrypt.compareSync("hello", hash1));
    assert(!bcrypt.compareSync("hello", hash2));
    assert(!bcrypt.compareSync("hello", hash3));

    assert.strictEqual(hash2.substring(0, 4), "$2y$");
    assert(bcrypt.compareSync("world", hash2));
    assert(!bcrypt.compareSync("world", hash1));
    assert(!bcrypt.compareSync("world", hash3));

    assert.strictEqual(hash3.substring(0, 4), "$2a$");
    assert(bcrypt.compareSync("hello world", hash3));
    assert(!bcrypt.compareSync("hello world", hash1));
    assert(!bcrypt.compareSync("hello world", hash2));

    done();
  },
  function compare(done) {
    var salt1 = bcrypt.genSaltSync(),
      hash1 = bcrypt.hashSync("hello", salt1); // $2a$
    var salt2 = bcrypt.genSaltSync();
    salt2 = salt2.substring(0, 2) + "y" + salt2.substring(3); // $2y$
    var hash2 = bcrypt.hashSync("world", salt2);
    bcrypt.compare("hello", hash1, function (err, same) {
      assert(!err);
      assert(same);
      bcrypt.compare("hello", hash2, function (err, same) {
        assert(!err);
        assert(!same);
        bcrypt.compare("world", hash2, function (err, same) {
          assert(!err);
          assert(same);
          bcrypt.compare("world", hash1, function (err, same) {
            assert(!err);
            assert(!same);
            done();
          });
        });
      });
    });
  },
  function getSalt(done) {
    var hash1 = bcrypt.hashSync("hello", bcrypt.genSaltSync());
    var salt = bcrypt.getSalt(hash1);
    var hash2 = bcrypt.hashSync("hello", salt);
    assert.equal(hash1, hash2);
    done();
  },
  function getRounds(done) {
    var hash1 = bcrypt.hashSync("hello", bcrypt.genSaltSync());
    assert.equal(bcrypt.getRounds(hash1), 10);
    done();
  },
  function truncates(done) {
    assert(!bcrypt.truncates(""));
    assert(!bcrypt.truncates("a".repeat(72)));
    assert(bcrypt.truncates("a".repeat(73)));
    assert(bcrypt.truncates("๏ เป็นมนุษย์สุดประเสริฐเลิศคุณค่า"));
    done();
  },
  function progress(done) {
    bcrypt.genSalt(12, function (err, salt) {
      assert(!err);
      var progress = [];
      bcrypt.hash(
        "hello world",
        salt,
        function (err, hash) {
          assert(!err);
          assert(typeof hash === "string");
          assert(progress.length >= 2);
          assert.strictEqual(progress[0], 0);
          assert.strictEqual(progress[progress.length - 1], 1);
          done();
        },
        function (n) {
          progress.push(n);
        },
      );
    });
  },
  function promise(done) {
    bcrypt.genSalt(10).then(
      function (salt) {
        bcrypt.hash("hello", salt).then(
          function (hash) {
            assert(hash);
            bcrypt.compare("hello", hash).then(
              function (result) {
                assert(result);
                bcrypt.genSalt(/* no args */).then(
                  function (salt) {
                    assert(salt);
                    done();
                  },
                  function (err) {
                    assert(false);
                  },
                );
              },
              function (err) {
                assert(false);
              },
            );
          },
          function (err) {
            assert(false);
          },
        );
      },
      function (err) {
        assert(false);
      },
    );
  },
  function compat_hash(done) {
    var pass = [
      "",
      " ",
      " a ",
      "a".repeat(72),
      "a".repeat(73),
      "Heizölrückstoßabdämpfung",
      "Ξεσκεπάζω τὴν ψυχοφθόρα βδελυγμία",
      "El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y ",
      "Où l'obèse jury mûr",
      "Úrmhac na hÓighe Beannaithe",
      "Árvíztűrő tükörfúrógép",
      "Sævör grét áðan því úlpan var ónýt",
      "わかよたれそつねならむ",
      "ケフコエテ アサキユメミシ",
      "דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך הקליטה",
      "Pchnąć w tę łódź jeża lub ośm skrzyń fig",
      "В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!",
      "๏ เป็นมนุษย์สุดประเสริฐเลิศคุณค่า",
      "Pijamalı hasta, yağız şoföre çabucak güvendi.",
    ];
    for (var i = 0; i < pass.length; i++) {
      var salt = bcrypt.genSaltSync(),
        hash1 = bcryptcpp.hashSync(pass[i], salt),
        hash2 = bcrypt.hashSync(pass[i], salt);
      assert.equal(hash1, hash2);
    }
    done();
  },
  function compat_rounds(done) {
    var salt1 = bcrypt.genSaltSync(0), // $10$ like not set
      salt2 = bcryptcpp.genSaltSync(0);
    assert.strictEqual(salt1.substring(0, 7), "$2b$10$");
    assert.strictEqual(salt2.substring(0, 7), "$2b$10$");

    salt1 = bcrypt.genSaltSync(3); // $04$ is lower cap
    salt2 = bcryptcpp.genSaltSync(3);
    assert.strictEqual(salt1.substring(0, 7), "$2b$04$");
    assert.strictEqual(salt2.substring(0, 7), "$2b$04$");

    salt1 = bcrypt.genSaltSync(32); // $31$ is upper cap
    salt2 = bcryptcpp.genSaltSync(32);
    assert.strictEqual(salt1.substring(0, 7), "$2b$31$");
    assert.strictEqual(salt2.substring(0, 7), "$2b$31$");

    done();
  },
  function commonJS(done) {
    var umd = require("../umd/index.js");
    umd.genSalt().then(done);
  },
];

function next() {
  if (!tests.length) return;
  var test = tests.shift();
  console.log(test.name);
  test(next);
}
next();
