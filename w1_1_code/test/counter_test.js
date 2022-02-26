const { assert } = require("console");

const Counter = artifacts.require("Counter");

contract('Counter', (accounts) => {
  it('Gets the value of the count', async () => {
    await Counter.deployed().then(function (i) {
      i.count().then(function (c) {
        assert.equal(c, 1);
      });
    });
  });
});
