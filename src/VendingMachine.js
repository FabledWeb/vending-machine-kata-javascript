(function() {
  var VendingMachine = VendingMachine || {};
  var COINS = {
    nickel:  { value: 0.05 },
    dime:    { value: 0.10 },
    quarter: { value: 0.25 }
  };

  VendingMachine.init = function() {
    VendingMachine._products = {};
    VendingMachine._change = {};
  };

  VendingMachine.stockWithGoodies = function(goodies) {
    //choosing not to put any validation here
    //goodies should be passed as an object like so:
    //  { cola: 10, chips: 4, candy: 1 }
    this._products = goodies;
  };
  VendingMachine.fillWithChange = function(change) {
    //choosing not to put any validation here
    //change should be passed as an object like so:
    //  { nickels: 30, dimes: 100, quarters: 10 }
    this._change = change;
  };
  VendingMachine._isCoinAcceptable = function(coin) {
    return COINS[coin] ? true : false;
  };
  VendingMachine._valueOfCoin = function(coin) {
    return (COINS[coin] || {value:0}).value;
  };

  //export
  window.VendingMachine = VendingMachine;
})();
