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
    this._dispensingTray = {};
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
    return PRODUCTS[product];
  };

  VendingMachine.insertCoin = function(coin) {
    var destination = this._isCoinAcceptable(coin) ? '_coinIntake' : 'coinReturn';
    this[destination][coin] = (this[destination][coin] || 0) + 1;
    //Set to default display.  Default display logic is somewhat complex,
    //so don't duplicate that logic here.
    this._setDisplayToDefault();
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

  VendingMachine._exactChangeRequired = function() {
    //TODO: implement
  };

  VendingMachine._formattedBalance = function() {
    return '$'+(this._computeBalance()).toFixed(2);
  };

  VendingMachine._setDisplayToDefault = function() {
    this._updateDisplay(this._defaultDisplay());
  };

  VendingMachine._defaultDisplay = function() {
    var display = 'INSERT COINS';
    if(this._computeBalance() > 0) {
      display = this._formattedBalance();
    }
    else if(this._exactChangeRequired()) {
      display = 'EXACT CHANGE ONLY';
    }
    return display;
  };

  VendingMachine._consumeCoins = function() {
    for(var k in this._coinIntake) {
      this._change[k] = (this._change[k] || 0) + this._coinIntake[k];
    }
    this._coinIntake = {};
  };

  VendingMachine._dispenseChange = function() {
    //TODO: implement
  };

  VendingMachine._makeChange = function(product) {
    var balance = this._computeBalance();
    var diff = balance - this._priceOfProduct(product);
    //consume the coins in the intake first to use as toward the change
    this._consumeCoins();
    this._dispenseChange(diff);
  };

  VendingMachine.selectProduct = function(product) {
    if(this._products[product]) {
      if(this._canAfford(product)) {
        this._dispense(product);
        this._updateDisplay('THANK YOU');
        this._makeChange(product);
      }
      else {
        this._updateDisplay('PRICE $'+this._priceOfProduct(product).toFixed(2));
      }
    }
    else {
      this._updateDisplay('SOLD OUT');
    }
  };

  VendingMachine.dispensingTray = function() {
    return this._dispensingTray;
  };

  //not sure I care to have this abstraction/encapsulation yet, but
  //going with it for now
  VendingMachine.display = function() {
    var output = this._display;
    this._setDisplayToDefault();
    return output;
  };
  VendingMachine._updateDisplay = function(text) {
    this._display = text;
  };

  VendingMachine._canAfford = function(product) {
    return this._computeBalance() >= this._priceOfProduct(product) ? true : false;
  };

  VendingMachine._dispense = function(product) {
    //again with the no validation, but it's a private method and this is just for an interview
    this._products[product]--;
    this._dispensingTray[product] = (this._dispensingTray[product] || 0) + 1;
  };

  //export
  window.VendingMachine = VendingMachine;
})();
