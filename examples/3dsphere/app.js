var app = require('../../app.js'),
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
    THREE = require('./three.js'),
    Stats = require('./stats.js');



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

/*
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
*/

window.addEventListener('load', init, false);


var container, stats, particleSystem;
  var camera, scene, renderer;
  var mesh;
  animate();

function init() {

  container = document.getElementById( 'container' );
  //
  camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
  camera.position.z = 2750;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

  //

  var particles = 5000;

  var geometry = new THREE.BufferGeometry();

  geometry.addAttribute( 'position', Float32Array, particles, 3 );
  geometry.addAttribute( 'color', Float32Array, particles, 3 );

  var positions = geometry.attributes.position.array;
  var colors = geometry.attributes.color.array;

  var color = new THREE.Color();

  var n = 1000, n2 = n / 2; // particles spread in the cube

  for ( var i = 0; i < positions.length; i += 3 ) {

    // positions

    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;

    positions[ i ]     = x;
    positions[ i + 1 ] = y;
    positions[ i + 2 ] = z;

    // colors

    var vx = ( x / n ) + 0.5;
    var vy = ( y / n ) + 0.5;
    var vz = ( z / n ) + 0.5;

    color.setRGB( vx, vy, vz );

    colors[ i ]     = color.r;
    colors[ i + 1 ] = color.g;
    colors[ i + 2 ] = color.b;

  }

  geometry.computeBoundingSphere();

  //

  var material = new THREE.ParticleSystemMaterial( { size: 15, vertexColors: true } );

  particleSystem = new THREE.ParticleSystem( geometry, material );
  scene.add( particleSystem );

  //

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color, 1 );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  //
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  //
  window.addEventListener( 'resize', onWindowResize, false );
  animate();
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {
  requestAnimFrame( animate );
  render();
  stats.update();
}

function render() {

  var time = Date.now() * 0.001;

  particleSystem.rotation.x = time * 0.25;
  particleSystem.rotation.y = time * 0.5;

  renderer.render( scene, camera );

}