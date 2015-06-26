(function() {
  var VendingMachine = VendingMachine || {};
  var COINS = {
    nickel:  0.05,
    dime:    0.10,
    quarter: 0.25
  };
  var PRODUCTS = {
    cola: 1,
    chips: 0.5,
    candy: 0.65
  };

  VendingMachine.init = function() {
    this._products = {};
    this._change = {};
    this._coinIntake = {};
    this.coinReturn = {};
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
  VendingMachine._priceOfProduct = function(product) {
  };

  VendingMachine.insertCoin = function(coin) {
    var destination = this._isCoinAcceptable(coin) ? '_coinIntake' : 'coinReturn';
    this[destination][coin] = (this[destination][coin] || 0) + 1;
    this._updateDisplay('$'+(this._computeBalance()).toFixed(2));
  };

  VendingMachine.returnCoins = function() {
    for(var k in this._coinIntake) {
      this.coinReturn[k] = (this.coinReturn[k] || 0) + this._coinIntake[k];
    }
    this._coinIntake = {};
  };

  VendingMachine._computeBalance = function() {
    // You might ask yourself, "why would you want to compute
    // this every time? Why wouldn't you just update some balance
    // variable as coins are added/returned?"
    // Well, it's because I believe that keeping track of the same thing
    // in 2 ways only ever leads to pain. I need to store the coins in
    // the intake so that they can be returned (without making change),
    // so I don't want to store that info and also store the sum of those
    // coins in separate variable. Future bugs appear when you have to
    // be sure to keep 2 things like that in sync.
    var balance = 0;
    for(var k in this._coinIntake) {
      balance += this._valueOfCoin(k) * this._coinIntake[k];
    }
    return balance;
  };

  VendingMachine._consumeCoins = function() {
    for(var k in this._coinIntake) {
      this._change[k] = (this._change[k] || 0) + this._coinIntake[k];
    }
    this._coinIntake = {};
  };

  VendingMachine._makeChange = function() {
  };

  VendingMachine.selectProduct = function(product) {
    if(this._products[product]) {
      if(this._canAfford(product)) {
        this._dispense(product);
        this._updateDisplay('THANK YOU');
        this._makeChange();
      }
      else {
        this._updateDisplay('PRICE $'+this._priceOfProduct(product).toFixed(2));
      }
    }
    else {
      this._updateDisplay('SOLD OUT');
    }
  };

  //not sure I care to have this abstraction/encapsulation yet, but
  //going with it for now
  VendingMachine.display = function() {
    return this._display;
  };
  VendingMachine._updateDisplay = function(text) {
    this._display = text;
  };

  VendingMachine._canAfford = function(product) {
    return this._computeBalance() >= this._priceOfProduct(product) ? true : false;
  };

  VendingMachine._dispense = function(product) {
  };

  //export
  window.VendingMachine = VendingMachine;
})();
