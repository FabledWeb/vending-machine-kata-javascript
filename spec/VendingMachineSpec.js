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
      expect(this.vm._coinReturn).toEqual({});
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

    });

    describe("Inserting Coins", function() {

      describe("rejecting invalid coins", function() {
        beforeEach(function() {
          spyOn(this.vm, '_isCoinAcceptable').andReturn(false);
          spyOn(this.vm, '_computeBalance').andReturn(.10);
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
          this.vm._coinReturn = {
            'a few somethings already in there': 4,
            'unacceptable coin': 2
          };
          this.vm.insertCoin('unacceptable coin');
          expect(this.vm._coinReturn).toEqual({
            'a few somethings already in there': 4,
            'unacceptable coin': 3
          });
        });
      });

      describe("accepting valid coins", function() {
        beforeEach(function() {
          spyOn(this.vm, '_isCoinAcceptable').andReturn(true);
          spyOn(this.vm, '_computeBalance').andReturn(.10);
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
          this.vm._coinReturn = {
            'a few somethings already in there': 4,
            'unacceptable coin': 2
          };
          this.vm.insertCoin('acceptable coin');
          expect(this.vm._coinReturn).toEqual({
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
    
  });

});

