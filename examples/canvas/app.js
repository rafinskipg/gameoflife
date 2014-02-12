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