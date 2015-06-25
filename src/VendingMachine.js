(function() {
  var VendingMachine = VendingMachine || {};

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

  //export
  window.VendingMachine = VendingMachine;
})();
