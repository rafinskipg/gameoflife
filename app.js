var numberOfCells = 2,
    _cells = [];

function setNumberOfCells(number){
  if(number){
     numberOfCells = number;
  }
}

function init(){
  _cells = [];
  for(var i = 0; i<numberOfCells; i++){
    _cells.push({ state: 0, neighbours: [] });
  }
}

function getCells(){
  return _cells || [];
}

function isAlive(cell){
  return cell.state ? true: false;
}

function changeState(cells,index){
  //cells = cells.concat([]);
  var value = cells[index].state  ? 0 : 1;
  cells[index].state = value;
  return cells;
}
function createRelationOfNeighbours(neighbours){
  for(var i = 0; i < neighbours.length; i++){
    var neighboursToAdd = neighbours.concat([]);
    var currentCell = neighboursToAdd.splice(i,1);
    setNeighbours(currentCell[0], neighboursToAdd);
  }
}

function setNeighbours(cellIndex, neighbours){
  getCells()[cellIndex].neighbours = merge(getCells()[cellIndex].neighbours, neighbours);  
}

function step(){
  var cellsToChangeState = generateListOfCellsToChange();
  cellsToChangeState.map(function(item, index){
    changeState(getCells(),item);
  });
}

function merge (array1, array2){
  array2.map(function(item){
    if(array1.indexOf(item) == -1){
      array1.push(item);
    }
  })
  return array1;
}

function generateListOfCellsToChange(){
  var cells = getCells(),
      cellsToChangeState = [];
  cells.map(function(cell, i){
    var numberOfAliveNeighbours = getAliveNeighbours(cell),
        isLiving = isAlive(cell);

    if(lessThan2Neighbours(numberOfAliveNeighbours, isLiving) 
      || moreThan3Neighbours(numberOfAliveNeighbours, isLiving)
      || exactly3NeighBoursAndNotAlive(numberOfAliveNeighbours, isLiving)){
      cellsToChangeState.push(i);
    }
  });
  return cellsToChangeState;
}

function lessThan2Neighbours(numberOfLivingNeighbours, isAlive){
    return numberOfLivingNeighbours < 2 && isAlive;
}

function moreThan3Neighbours(numberOfLivingNeighbours, isAlive){
    return numberOfLivingNeighbours > 3 && isAlive;
}

function exactly3NeighBoursAndNotAlive(numberOfLivingNeighbours, isAlive){
    return numberOfLivingNeighbours === 3 && !isAlive;
}

function getAliveNeighbours(cell){
  var ammount = 0;
  for(var i = 0; i < cell.neighbours.length; i ++){
    ammount += +isAlive(getCells()[cell.neighbours[i]]);
  }
  return ammount;
}

function createGrid(numberXCells, numberYCells){
  var numberOfCells = numberXCells * numberYCells,
      cells;
  setNumberOfCells(numberOfCells);
  init();
  cells = getCells();
  
  //Creates a grid of cell positions
  var grid = [], counter = 0;
  for(var i = 0; i < numberYCells; i++){
    grid.push([]);
    for(var j = 0; j < numberXCells; j++){
      grid[i].push(counter);
      counter++;
    }
  }

  //use cell positions to stablish relation
  for(var i = 0; i < numberYCells; i++){
    for(var j = 0; j < numberXCells; j++){
      calculateGridNeighbours(i,j, grid);
    }
  }
}

function calculateGridNeighbours(x,y,grid){
  minX = x-1 >= 0 ? x-1: 0;
  maxX = x+1 < grid[y].length ? x+1: x ;
  minY = y-1 >= 0 ? y-1: 0;
  maxY = y+1 < grid.length ? y+1: y ;
  for(var i = minX; i<= maxX; i++){
    for(var j = minY; j<= maxY; j++){
      if(i != x || j != y){
        createRelationOfNeighbours([grid[x][y], grid[i][j]])
      }
    }
  }
}

module.exports = {
  init: init,
  getCells: getCells,
  setNumberOfCells : setNumberOfCells,
  isAlive: isAlive,
  changeState: changeState,
  step: step,
  createRelationOfNeighbours: createRelationOfNeighbours,
  createGrid: createGrid
}