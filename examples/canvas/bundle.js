(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Object.prototype.extend = function(x) {
  var props = Object.keys(x);
  var that = this;
  props.map(function(prop){
    that[prop] = x[prop]
  })
};

var numberOfCells = 2,
    _cells = [];

var Cell = function Cell(){
  this.state = 0;
  this.neighbours = [];
}




function setNumberOfCells(number){
  if(number){
     numberOfCells = number;
  }
}

function init(){
  _cells = [];
  for(var i = 0; i<numberOfCells; i++){
    _cells.push(new Cell());
  }
}

function getCells(){
  return _cells || [];
}

function isAlive(cell){
  return cell.state ? true: false;
}

function changeState(cells,index){
  var value = cells[index].state  ? 0 : 1;
  cells[index].state = value;
  if(cells[index].changeState){
    cells[index].changeState.call(cells[index]);
  }
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

//Custom properties
function setCustomProperties(props){
  Cell.prototype.extend(props);
}

function setCallbackState(cb){
  Cell.prototype.extend({changeState: cb});
}

//Grid implementation
function createGrid(numberXCells, numberYCells){
  var numberOfCells = numberXCells * numberYCells,
      cells;
  setNumberOfCells(numberOfCells);
  init();
  cells = getCells();
  
  //Creates a grid of cell positions
  var grid = [], counter = 0;
  for(var i = 0; i < numberXCells; i++){
    grid.push([]);
    for(var j = 0; j < numberYCells; j++){
      grid[i].push(counter);
      counter++;
    }
  }

  //use cell positions to stablish relation
  for(var i = 0; i < numberXCells; i++){
    for(var j = 0; j < numberYCells; j++){
      calculateGridNeighbours(i,j, grid);
    }
  }
  return grid;
}

function calculateGridNeighbours(x,y,grid){
  minX = x-1 >= 0 ? x-1: 0;
  maxX = x+1 < grid.length ? x+1: x ;
  minY = y-1 >= 0 ? y-1: 0;
  maxY = y+1 < grid[x].length ? y+1: y ;
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
  createGrid: createGrid,
  setCustomProperties: setCustomProperties,
  setCallbackState : setCallbackState
}
},{}],2:[function(require,module,exports){
var app = require('../../app.js'),
    canvas, 
    ctx,
    lastTime,
    cellSize = 20,
    numberRows,
    numberColumns,
    aliveColor = 'black',
    deadColor = 'white',
    unvisitedColor = 'blue',
    grid,
    button,
    started = false;

var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


 // The main game loop
var main = function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    if(dt > 0.15){
      update(dt);
      lastTime = now;
    }
    render();
    requestAnimFrame(main);
};

function update(dt){
  if(started){
    app.step();
  }
}

function start(){
  started = !started;
}

function render(){
  var cells = app.getCells();

  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid[i].length; j++){
      cell = cells[grid[i][j]];
      color = app.isAlive(cell) ? aliveColor: (cell.visited ? deadColor: unvisitedColor);
      drawCell(i*cellSize, j*cellSize, color);
    }
  }

}

function drawCell(x,y, color){
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x,y,cellSize,cellSize);
  ctx.fillRect(x,y,cellSize,cellSize);
}

function drawNumber(x,y,number){
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle ='black';
  ctx.fillText(number, x,y);
}

function initialize(){
   
    initCanvas();
    createGridOfCells();
    addCustomPropertiesToCells();

    button = document.getElementById("start_pause");
    button.addEventListener("click", start, false);
    lastTime = Date.now();
    
    main();
}

function addCustomPropertiesToCells(){
  app.setCustomProperties({
    visited : false
  })
  app.setCallbackState(function(){
    if(!this.visited){
      this.visited = true;  
    }
  })
}

function initCanvas(){
  // Create the canvas
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth - canvas.offsetLeft - 50;
  canvas.height = window.innerHeight;
  canvas.addEventListener("click", addCell, false);
}

function createGridOfCells(){
  numberRows = Math.floor((window.innerHeight -  canvas.offsetTop) / cellSize);
  numberColumns = Math.floor((window.innerWidth - canvas.offsetLeft) / cellSize);
  grid = app.createGrid(numberColumns,numberRows);

}

function addCell(e){

  var canvasPosition, mouse, cell
  canvasPosition = {
        x: canvas.offsetLeft,
        y: canvas.offsetTop
  }
  mouse = {
    x: e.pageX - canvasPosition.x,
    y: e.pageY - canvasPosition.y
  }
  cellPos = pickNumberOfCell(mouse.x, mouse.y);
  app.changeState(app.getCells(), cellPos);
}

function pickNumberOfCell(x,y){
  x = parseInt(x/cellSize, 10);
  y = parseInt(y/cellSize, 10);
  return grid[x][y];
}
window.addEventListener('load', initialize, false);
},{"../../app.js":1}]},{},[2])