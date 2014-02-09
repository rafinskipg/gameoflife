var should = require('chai').should,
    expect = require('chai').expect,
    app = require('./app');

describe('The game of life', function(){
  before(function(){
    // ...
  });

  describe('Setup', function(){
    it('should initState', function(){
      app.init();
      expect(app.getCells()).not.to.be.undefined;
      expect(app.getCells().length).to.be.above(0);
    });
    it('should allow to set up the number of cells', function(){
      app.setNumberOfCells(32);
      app.init();
      expect(app.getCells().length).to.be.equals(32);
    })
    it('Should have the posibility to check if a cell is alive', function(){
      app.init();
      expect(app.isAlive(app.getCells()[1])).to.be.a('boolean');
    })
    it('Should have the ability to change the state of one cell', function(){
      app.init();
      var state = app.isAlive(app.getCells()[1]);
      var newState= app.isAlive(app.changeState(app.getCells(),1)[1]);
      expect(state).not.to.be.equals(newState);
    })
    /*
    it('should not update the value of the original cells list in order to be more functional', function(){
      app.init();
      var state = app.isAlive(app.changeState(app.getCells(),1)[1]);
      var expectedState = app.isAlive(app.getCells()[1]);
      expect(state).not.to.be.equals(expectedState);
    })*/
  });


  describe('First law:Any live cell with fewer than two live neighbours dies, as if caused by under-population.', function(){
    var cells;
    beforeEach(function(){
      app.setNumberOfCells(4);
      app.init();
      cells = app.changeState(app.getCells(),0);
    })
    it('should die if an active cell has no neighbours', function(){
      app.step();
      expect(app.isAlive(cells[0])).to.be.equals(false);
    })
    it('should die if an active cell has 1 neighbours', function(){
      app.changeState(cells,1);
      app.createRelationOfNeighbours([0,1]);
      app.step();
      expect(app.isAlive(app.getCells()[0])).to.be.equals(false);
      expect(app.isAlive(app.getCells()[1])).to.be.equals(false);
    })
  });

  describe('Any live cell with two or three live neighbours lives on to the next generation.', function(){
    var cells;
    beforeEach(function(){
      app.setNumberOfCells(4);
      app.init();
      app.createRelationOfNeighbours([0,1,2]);
      cells = app.changeState(app.changeState( app.changeState(app.getCells(),0),1), 2);

    })
    it('should live if has 2 neighbours', function(){
      app.step();
      expect(app.isAlive(cells[0])).to.be.equals(true);
      expect(app.isAlive(cells[1])).to.be.equals(true);
      expect(app.isAlive(cells[2])).to.be.equals(true);
    })
   
    it('should live if has 3 neighbours', function(){
      app.changeState(cells, 3);
      app.createRelationOfNeighbours([1,3]);
      app.step();
      expect(app.isAlive(cells[0])).to.be.equals(true);
      expect(app.isAlive(cells[1])).to.be.equals(true);
      expect(app.isAlive(cells[2])).to.be.equals(true);
      expect(app.isAlive(cells[3])).to.be.equals(false);
    })
  });

  describe('Any live cell with more than three live neighbours dies, as if by overcrowding.', function(){
    var cells;
    beforeEach(function(){
      app.setNumberOfCells(6);
      app.init();
      app.createRelationOfNeighbours([0,1,2,3,4]);
      cells = app.getCells();
      [0,1,2,3,4,5].map(function(item){
         cells = app.changeState(cells, item);
      })

    })
    it('should die with so much neighbours', function(){
      app.step();
      expect(app.isAlive(cells[0])).to.be.equals(false);
      expect(app.isAlive(cells[1])).to.be.equals(false);
      expect(app.isAlive(cells[2])).to.be.equals(false);
      expect(app.isAlive(cells[3])).to.be.equals(false);
      expect(app.isAlive(cells[4])).to.be.equals(false);
    })
   
    it('One more test with 3 or more neighbours and one item with 2 neighbours', function(){
      app.createRelationOfNeighbours([1,5]);
      app.createRelationOfNeighbours([2,5]);
      app.step();
      expect(app.isAlive(cells[0])).to.be.equals(false);
      expect(app.isAlive(cells[1])).to.be.equals(false);
      expect(app.isAlive(cells[2])).to.be.equals(false);
      expect(app.isAlive(cells[3])).to.be.equals(false);
      expect(app.isAlive(cells[5])).to.be.equals(true);
    })
  }); 
  
  describe('Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.', function(){
    var cells;
    beforeEach(function(){
      app.setNumberOfCells(6);
      app.init();
      app.createRelationOfNeighbours([0,1,2,3,4,5]);
      cells = app.getCells();
      [0,1,3].map(function(item){
         cells = app.changeState(cells, item);
      })

    })
    it('2,5,4 should live', function(){
      app.step();
      expect(app.isAlive(cells[2])).to.be.equals(true);
      expect(app.isAlive(cells[5])).to.be.equals(true);
      expect(app.isAlive(cells[4])).to.be.equals(true);

    })
   
  });

 
  
});


describe('The grid creator', function(){
 describe('Implementation of the grid, 2x2', function(){
    beforeEach(function(){
      app.createGrid(3,3);
    })
    /*
      0 1 2
      3 4 5
      6 7 8

     0=> [ 1, 3, 4 ]
      [ 0, 2, 3, 4, 5 ]
      [ 1, 4, 5 ]
      [ 0, 1, 4, 6, 7 ]
      [ 0, 1, 2, 3, 5, 6, 7, 8 ]
      [ 1, 2, 4, 7, 8 ]
      [ 3, 4, 7 ]
      [ 3, 4, 5, 6, 8 ]
      [ 4, 5, 7 ]

     */
    it('should have 0 with neighbours 1 ,3, 4', function(){
      var expected = [1,3,4];
      app.getCells()[0].neighbours.map(function(item,index){
        expect(item).to.be.equals(expected[index]);
      })
     
    })
    it('should have 4 with neighbours 0,1,2,3,5,6,7,8',function(){
      var expected = [0,1,2,3,5,6,7,8];

      app.getCells()[4].neighbours.map(function(item,index){
        expect(item).to.be.equals(expected[index]);
      })
    })
    it('should have 7 with neighbours 3,4,5,6,8', function(){
      var expected = [3,4,5,6,8];
      app.getCells()[7].neighbours.map(function(item,index){
        expect(item).to.be.equals(expected[index]);
      })
    })
  })

})
