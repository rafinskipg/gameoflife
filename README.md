[Conway's Game of Life](https://github.com/rafinskipg/gameoflife)
=====================

The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
The "game" is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.

Variation
-----

The following implementation is board-agnostic. It means that cells are not expected to be in a bidimensional array. 
Cells are related to other cells with a "neighbour" relationship that can be used to generate bidimensional or tridimensional relationships.

![image-cells](https://github.com/rafinskipg/gameoflife/blob/master/static/cells.png?raw=true)

This provides the ability to use this code to generate WebGL simulations of the Conway's Game of Life, wich is one of the purposes of this experiment.

This code has been tested with mocha and chai, but it may suffer further variation.

Actually it has a function to create the relationship for the NxN grid pattern. Generating the classic output that is used on the [Canvas demo](http://rvpg.me/experiments/gameoflife/canvas/).

The next I want to develop is the algorithm to create grids in a better way and 3D spheres or 3D cubes.

Other things to take into consideration for further development are the memoization of the "step" function and making the code really functional. At this momment the state of the cells is really "changing" and functional  programming says that the state must not change, it has to create new clones of the actual state of the application.

That would allow to store the "states" in a list and create "time machine" functionality. Also this would allow to detect repeating patterns.


Rules
-----

* Any live cell with fewer than two live neighbours dies, as if caused by under-population.
* Any live cell with two or three live neighbours lives on to the next generation.
* Any live cell with more than three live neighbours dies, as if by overcrowding.
* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

Demos
-----
* [Canvas implementation](http://rvpg.me/experiments/gameoflife/canvas/)


Dependencies
------------

The core library is tested with mocha & chai (which is included in the package.json)

    npm install -g mocha
    npm install
    mocha test.js -R spec

The code for the Canvas demo is generated with [browserify](https://github.com/substack/node-browserify)

    npm install -g browserify
    browserify experiments/canvas/app.js > experiments/canvas/bundle.js  

