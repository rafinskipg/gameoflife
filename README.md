Conway's Game of Life
=====================

The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
The "game" is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.

Variation
-----

The following implementation is board-agnostic. It means that cells are not expected to be in a bidimensional array. 
Cells are related with a "neighbour" relationship that can be used to generate bidimensional or tridimensional relationships.

![image-cells](https://github.com/rafinskipg/gameoflife/blob/master/static/cells.png?raw=true)

This provides the ability to use this code to generate WebGl simulations of the Conway's Game of Life, wich is one of the purposes of this experiment.

This code has been tested with mocha and chai, but it may suffer furder variation.

Actually it has a function to create the relationship for the NxN grid patter. Generating the classic output that is used on the canvas demo.

The next things I want to develop are the algorithms to create grids and 3D spheres or cubes.

Other things to take into consideration for further development are the memoization of the "step" function, and making the code really functional. At this momment the state of the cells is really changing in time and functional  programming says that the state must not change, it has to create new clones of the original object.

That would allow to store the "states"  in a list and create "go back" functionality. Also this would allow to detect repeating patterns.


Rules
-----

Any live cell with fewer than two live neighbours dies, as if caused by under-population.

Any live cell with two or three live neighbours lives on to the next generation.

Any live cell with more than three live neighbours dies, as if by overcrowding.

Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.



Dependencies
------------

The core library is tested with mocha & chai

  npm install -g mocha
  npm install
  mocha test.js