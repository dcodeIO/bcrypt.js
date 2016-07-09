var bcrypt = require('../dist/bcrypt.js');

var asyncMethodNames = [
 'hash',
 'genSalt',
 'compare'
];

asyncMethodNames.forEach(function(methodName) {
  instanceTest(methodName);
  instanceTestWithCallback(methodName);
});

function instanceTest(methodName) {
  var instanceOfPromise = bcrypt[methodName]() instanceof Promise;

  console.log('Calling ' + methodName + ' returns a Promise instance: ' + instanceOfPromise);
}

function instanceTestWithCallback(methodName) {
  var instanceOfPromise = bcrypt[methodName](function(){}) instanceof Promise;

  console.log('Calling ' + methodName + ' with a callback returns a Promise instance: ' + !instanceOfPromise);
}


promiseFunctionalityTest('test', 'test')
.then(function() {
  return promiseFunctionalityTest('test', 'invalid');
})
.then(function() {
  return new Promise(function(res,rej) {
    callbackFunctionalityTest('test', 'test', res);
  });
})
.then(function() {
  return new Promise(function(res,rej) {
    callbackFunctionalityTest('test', 'invalid', res);
  });
});

function promiseFunctionalityTest(pass, comparison) {
  console.log('\nTesting promise functionality');
  console.log('Generating salt...')
  return bcrypt.genSalt(8)
  .then(function(salt) {
    console.log('Generated salt: ' + salt);
    console.log('Generating hash for password `' + pass + '`...')
    return bcrypt.hash(pass, salt);
  })
  .then(function(hash) {
    console.log('Generated hash: ' + hash);
    console.log('Testing against password `' + comparison + '`...')
    return bcrypt.compare(comparison, hash);
  })
  .then(function(result) {
    if (result) console.log('Password valid');
    else console.log('Password invalid');
  });
}

function callbackFunctionalityTest(pass, comparison, next) {
  console.log('\nTesting callback functionality');
  console.log('Generating salt...');
  bcrypt.genSalt(8, function(err, salt) {
    console.log('Generated salt: ' + salt);
    console.log('Generating hash for password `' + pass + '`...')
    bcrypt.hash(pass, salt, function(err, hash) {
      console.log('Generated hash: ' + hash);
      console.log('Testing against password `' + comparison + '`...')
      bcrypt.compare(comparison, hash, function(err, result) {
        if (result) console.log('Password valid');
        else console.log('Password invalid');

        next();
      });
    }, function(number) {
      var percents = number * 100;
      console.log('Progress: ' + percents + '%');
    });
  })
}
