(function() {
  var VendingMachine = VendingMachine || {};
  var COINS = {
    nickel:  0.05,
    dime:    0.10,
    quarter: 0.25
  };

  VendingMachine.init = function() {
    this._products = {};
    this._change = {};
    this._coinIntake = {};
    this._coinReturn = {};
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
    //only accept coins that have value to me
    return this._valueOfCoin(coin) > 0 ? true : false;
  };
  VendingMachine._valueOfCoin = function(coin) {
    return COINS[coin] || 0;
  };

  VendingMachine.insertCoin = function(coin) {
    var destination = this._isCoinAcceptable(coin) ? '_coinIntake' : '_coinReturn';
    this[destination][coin] = (this[destination][coin] || 0) + 1;
  };

  //export
  window.VendingMachine = VendingMachine;
})();
