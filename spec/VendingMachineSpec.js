describe("Jasmine Test Runner", function() {

  it("Runs", function() {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(42).toEqual(42);
  });

  describe("Vending Machine", function() {

    beforeEach(function() {
      this.vm = VendingMachine;
      this.vm.init();
    });

    it("can be initialized", function() {
      this.vm.init();
      expect(this.vm._products).toEqual({});
      expect(this.vm._change).toEqual({});
      expect(this.vm._coinIntake).toEqual({});
      expect(this.vm.coinReturn).toEqual({});
    });

    it("can be stocked with goodies", function() {
      this.vm.stockWithGoodies('goodies');
      expect(this.vm._products).toBe('goodies');
    });

    it("can be filled with change", function() {
      this.vm.fillWithChange('change');
      expect(this.vm._change).toBe('change');
    });

    describe("detecting which coins are acceptable", function() {
      it("accepts nickels", function() {
        expect(this.vm._isCoinAcceptable('nickel')).toBe(true);
      });
      it("accepts dimes", function() {
        expect(this.vm._isCoinAcceptable('dime')).toBe(true);
      });
      it("accepts quarters", function() {
        expect(this.vm._isCoinAcceptable('quarter')).toBe(true);
      });
      it("rejects pennies", function() {
        expect(this.vm._isCoinAcceptable('penny')).toBe(false);
      });
      it("rejects a washer on a string", function() {
        //Why test this? Because without it the
        //implementation ends up looking like:
        //  return coin === 'penny' ? false : true;
        expect(this.vm._isCoinAcceptable('suspicious washer')).toBe(false);
      });
    });

    describe("knowing the value of coins", function() {
      it("knows the value of a nickel", function() {
        expect(this.vm._valueOfCoin('nickel')).toBe(0.05);
      });
      it("knows the value of a dime", function() {
        expect(this.vm._valueOfCoin('dime')).toBe(0.1);
      });
      it("knows the value of a quarter", function() {
        expect(this.vm._valueOfCoin('quarter')).toBe(0.25);
      });
      it("knows that pennies are a ridiculous form of currency", function() {
        expect(this.vm._valueOfCoin('penny')).toBe(0);
      });
      it("knows that everything else is valueless", function() {
        expect(this.vm._valueOfCoin('good-looks')).toBe(0);
      });
    });

    describe("computing the current balance of the coin intake", function() {
      it("handles an empty intake", function() {
        this.vm._coinIntake = {};
        expect(this.vm._computeBalance()).toBe(0);
      });
      it("handles a single coin with a value of 1", function() {
        spyOn(this.vm, '_valueOfCoin').and.returnValue(1);
        this.vm._coinIntake = {
          'single coin': 1
        };
        expect(this.vm._computeBalance()).toBe(1);
      });
      it("handles a single coin with a non-1 value", function() {
        spyOn(this.vm, '_valueOfCoin').and.returnValue(5);
        this.vm._coinIntake = {
          'single coin': 1
        };
        expect(this.vm._computeBalance()).toBe(5);
      });
      it("handles multiple coins with a non-1 value", function() {
        spyOn(this.vm, '_valueOfCoin').and.returnValue(5);
        this.vm._coinIntake = {
          'coins': 4
        };
        expect(this.vm._computeBalance()).toBe(20);
      });
      it("handles multiple coins of different values", function() {
        spyOn(this.vm, '_valueOfCoin').and.callFake(function(coin) {
          var coins = {
            'coin type 1': 5,
            'coin type 2': 10,
            'coin type 3': 1
          };
          return coins[coin];
        });
        this.vm._coinIntake = {
          'coin type 1': 4,
          'coin type 2': 1,
          'coin type 3': 100
        };
        expect(this.vm._computeBalance()).toBe(5*4 + 10*1 + 1*100);
      });

    });

    describe("The Display", function() {

      it("shows the current display when asked", function() {
        this.vm._display = 'current display';
        expect(this.vm.display()).toBe('current display');
      });

      it("updates the display when I ask it to", function() {
        this.vm._display = 'whatever it used to be';
        this.vm._updateDisplay('something new');
        expect(this.vm.display()).toBe('something new');
      });

      xdescribe("returning back to the current default state", function() {
        xit("it resets after SOLD OUT", function() {
        });
        xit("it resets after PRICE $price_of_product", function() {
        });
        xit("it resets after THANK YOU", function() {
        });
      });

    });

    describe("Inserting Coins", function() {

      describe("rejecting invalid coins", function() {
        beforeEach(function() {
          spyOn(this.vm, '_isCoinAcceptable').and.returnValue(false);
          spyOn(this.vm, '_computeBalance').and.returnValue(.10);
        });
        it("doesn't put the coin into the coin intake", function() {
          this.vm._coinIntake = {
            'a few somethings already in there': 4,
            'acceptable coin': 2
          };
          this.vm.insertCoin('acceptable coin');
          expect(this.vm._coinIntake).toEqual({
            'a few somethings already in there': 4,
            'acceptable coin': 2
          });
        });
        it("it puts the coin into the coin return", function() {
          this.vm.coinReturn = {
            'a few somethings already in there': 4,
            'unacceptable coin': 2
          };
          this.vm.insertCoin('unacceptable coin');
          expect(this.vm.coinReturn).toEqual({
            'a few somethings already in there': 4,
            'unacceptable coin': 3
          });
        });
      });

      describe("accepting valid coins", function() {
        beforeEach(function() {
          spyOn(this.vm, '_isCoinAcceptable').and.returnValue(true);
          spyOn(this.vm, '_computeBalance').and.returnValue(.10);
        });
        it("puts the coin into the coin intake and updates", function() {
          this.vm._coinIntake = {
            'a few somethings already in there': 4,
            'acceptable coin': 2
          };
          this.vm.insertCoin('acceptable coin');
          expect(this.vm._coinIntake).toEqual({
            'a few somethings already in there': 4,
            'acceptable coin': 3
          });
        });
        it("doesn't put the coin into the coin return", function() {
          this.vm.coinReturn = {
            'a few somethings already in there': 4,
            'unacceptable coin': 2
          };
          this.vm.insertCoin('acceptable coin');
          expect(this.vm.coinReturn).toEqual({
            'a few somethings already in there': 4,
            'unacceptable coin': 2
          });
        });
        it("updates the display with the new balance", function() {
          spyOn(this.vm, '_updateDisplay');
          this.vm.insertCoin('acceptable coin');
          expect(this.vm._updateDisplay).toHaveBeenCalledWith('$0.10');
        });
      });

    });

    describe("Return Coins", function() {
      describe("when the coin return is empty", function() {
        beforeEach(function() {
          this.vm.coinReturn = {};
        });
        describe("and there is nothing to return", function() {
          beforeEach(function() {
            this.vm._coinIntake = {};
          });
          it("returns nothing", function() {
            this.vm.returnCoins();
            expect(this.vm.coinReturn).toEqual({});
          });
        });
        describe("and there is something to return", function() {
          beforeEach(function() {
            this.vm._coinIntake = {
              type1: 10,
              type2: 3
            };
          });
          it("returns something", function() {
            this.vm.returnCoins();
            expect(this.vm.coinReturn).toEqual({
              type1: 10,
              type2: 3
            });
            expect(this.vm._coinIntake).toEqual({});
          });
        });
      });

      describe("when the coin return already has stuff in it", function() {
        beforeEach(function() {
          this.vm.coinReturn = {
            junk: 2,
            type1: 3
          };
        });
        describe("and there is nothing to return", function() {
          beforeEach(function() {
            this.vm._coinIntake = {};
          });
          it("returns nothing, but leaves existing stuff alone", function() {
            this.vm.returnCoins();
            expect(this.vm.coinReturn).toEqual({
              junk: 2,
              type1: 3
            });
          });
        });
        describe("and there is something to return", function() {
          beforeEach(function() {
            this.vm._coinIntake = {
              type1: 10,
              type2: 3
            };
          });
          it("adds something to existing coins in return tray", function() {
            this.vm.returnCoins();
            expect(this.vm.coinReturn).toEqual({
              junk: 2,
              type1: 13,
              type2: 3
            });
            expect(this.vm._coinIntake).toEqual({});
          });
        });
      });
    });

    xdescribe("Make Change", function() {
      //NOTE: check for exact change only scenario...
      //just make sure it's triggered from here
    });
    xdescribe("Exact Change Only", function() {
      //this is a some-what vague requirement because it
      //could be possible to be able to make change for one product
      //but not another. Also you might be able to make change for
      //someone who only went over by 10 cents, but not by 15 (for example).
      //Will think about these use cases tomorrow.
    });
    describe("dispensingTray", function() {
      beforeEach(function() {
        this.vm._dispensingTray = {
          'my snacks': 2
        };
      });
      it("returns what is in the dispensing tray", function() {
        expect(this.vm.dispensingTray()).toEqual({
          'my snacks': 2
        });
      });
    });
    describe("Dispense Product", function() {
      //remove from inventory and place in dispensing bin
      beforeEach(function() {
        this.vm._products = {
          'stale thing': 2,
          'tempting thing': 4
        };
        this.vm._dispensingTray = {
          'nice! free snack': 1
        };
      });
      it("removes the product from it's inventory", function() {
        this.vm._dispense('tempting thing');
        expect(this.vm._products['tempting thing']).toBe(3);
      });
      it("drops the product in the dispensing tray (what do you really call this thing?)", function() {
        this.vm._dispense('tempting thing');
        expect(this.vm.dispensingTray()).toEqual({
          'nice! free snack': 1,
          'tempting thing': 1
        });
      });
    });
    describe("Can Afford?", function() {
      beforeEach(function() {
        spyOn(this.vm, '_computeBalance').and.returnValue(100);
      });
      describe("when product is too expensive", function() {
        beforeEach(function() {
          spyOn(this.vm, '_priceOfProduct').and.returnValue(100.01);
        });
        it("it says 'no snack for you'", function() {
          var canAfford = this.vm._canAfford('expensive product');
          expect(canAfford).toBe(false);
        });
      });
      describe("when product is just right", function() {
        beforeEach(function() {
          spyOn(this.vm, '_priceOfProduct').and.returnValue(100);
        });
        it("it says 'let them eat cake'", function() {
          var canAfford = this.vm._canAfford('goldilocks product');
          expect(canAfford).toBe(true);
        });
      });
    });
    describe("Consume Coins in Coin Intake", function() {
      //gonna use this from _makeChange
      beforeEach(function() {
        this.vm._coinIntake = {
          type1: 3,
          type3: 1
        };
        this.vm._change = {
          type1: 1,
          type2: 10
        };
      });
      it("empties the coin intake", function() {
        this.vm._consumeCoins();
        expect(this.vm._coinIntake).toEqual({});
      });
      it("adds coins to it's change bucket", function() {
        this.vm._consumeCoins();
        expect(this.vm._change).toEqual({
          type1: 4,
          type2: 10,
          type3: 1
        });
      });
    });

    describe("Select a Product", function() {
      beforeEach(function() {
        spyOn(this.vm, '_dispense');
        spyOn(this.vm, '_updateDisplay');
        spyOn(this.vm, '_makeChange');
      });
      describe("when the product is sold out", function() {
        beforeEach(function() {
          this.vm._products['the best snack'] = 0; //none left
        });
        //check both to make sure SOLD OUT has precedence over PRICE
        describe("and enough money has been inserted", function() {
          beforeEach(function() {
            spyOn(this.vm, '_canAfford').and.returnValue(true);
          });
          it("doesn't try to dispense anything", function() {
            this.vm.selectProduct('the best snack');
            expect(this.vm._dispense).not.toHaveBeenCalled();
          });
          it("displays SOLD OUT", function() {
            this.vm.selectProduct('the best snack');
            expect(this.vm._updateDisplay).toHaveBeenCalledWith('SOLD OUT');
          });
        });
        describe("and enough money has NOT been inserted", function() {
          beforeEach(function() {
            spyOn(this.vm, '_canAfford').and.returnValue(false);
          });
          it("doesn't try to dispense anything", function() {
            this.vm.selectProduct('the best snack');
            expect(this.vm._dispense).not.toHaveBeenCalled();
          });
          it("displays SOLD OUT", function() {
            this.vm.selectProduct('the best snack');
            expect(this.vm._updateDisplay).toHaveBeenCalledWith('SOLD OUT');
          });
        });
      });
      describe("when the product is available", function() {
        beforeEach(function() {
          this.vm._products["that'll have to do snack"] = 3; //there are some
        });
        describe("and enough money has NOT been inserted", function() {
          beforeEach(function() {
            spyOn(this.vm, '_canAfford').and.returnValue(false);
            spyOn(this.vm, '_priceOfProduct').and.returnValue(1000000);
          });
          it("doesn't try to dispense anything", function() {
            this.vm.selectProduct("that'll have to do snack");
            expect(this.vm._dispense).not.toHaveBeenCalled();
          });
          it("doesn't try to make change", function() {
            this.vm.selectProduct("that'll have to do snack");
            expect(this.vm._makeChange).not.toHaveBeenCalled();
          });
          it("displays PRICE $price_of_item", function() {
            this.vm.selectProduct("that'll have to do snack");
            expect(this.vm._updateDisplay).toHaveBeenCalledWith("PRICE $1000000.00");
          });
        });
        describe("and enough money has been inserted", function() {
          beforeEach(function() {
            spyOn(this.vm, '_canAfford').and.returnValue(true);
            this.vm._coinIntake = { 'some coins': 2 };
          });
          it("dispenses the product", function() {
            this.vm.selectProduct("that'll have to do snack");
            expect(this.vm._dispense).toHaveBeenCalledWith("that'll have to do snack");
          });
          it("displays THANK YOU", function() {
            this.vm.selectProduct("that'll have to do snack");
            expect(this.vm._updateDisplay).toHaveBeenCalledWith('THANK YOU');
          });
          //xit("it consumes the coins in the intake, bringing balance to $0", function() {
            //I think I'll move this check into the spec for _makeChange
            //this.vm.selectProduct("that'll have to do snack");
            //expect(this.vm._consumeCoins).toHaveBeenCalled();
          //});
          it("it makes change as applicable", function() {
            this.vm.selectProduct("that'll have to do snack");
            //make sure it calls make change method
            expect(this.vm._makeChange).toHaveBeenCalled();
          });
        });
      });
    });

  });

});

