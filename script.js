$(document).ready(function() {
  Controller.init();
});



var View = {

  init: function(gameBoard, position) {
    this.render(gameBoard, position);
    this.checkforMove();
  },

  render: function(gameBoard, position) {
    var $grid = $('.grid');
    $grid.html("");
    this.buildGrid(gameBoard, $grid);
    this.addGuy(position);
    this.addBadGuy();
    $('.remaining').text('Remaining: ' + Controller.getRemaining());
    $('.time').text('Time Remaining: ' + Controller.getTime());
    Controller.gameOver();
  },

  buildGrid: function(gameBoard, grid) {
    for (var i = 0; i < gameBoard.length; i++) {
      for (var j = 0; j < gameBoard[i].length; j++) {
        var piece = this.buildPiece(gameBoard[i][j], [i,j]);
        grid.append(piece.addClass('gridpiece'));
      }
    }
  },

  checkforMove: function() {
    $('body').keydown(function(e) {
      Controller.move(e.keyCode);
    });
  },

  buildPiece: function(value, id) {
    var piece = $('<div>').addClass('gridPiece');
    var idString = id.join(",");
    return piece.attr("data-id", idString).text(value);
  },

  buildGuy: function() {
    return $('<div>').addClass('guy');
  },

  buildBadGuy: function() {
    return $('<div>').addClass('badguy');
  },

  addGuy: function(position) {
    var positionString = position.join(",");
    $('div[data-id="' + positionString + '"]').append(this.buildGuy());
  },

  addBadGuy: function() {
    var positionString = Model.badPosition.join(",");
    $('div[data-id="' + positionString + '"]').append(this.buildBadGuy());
  },
};

var Controller = {

  KEYCODE: {
    '38': 'n',
    '37': 'w',
    '40': 's',
    '39': 'e',
    '13': 'enter'
  },

  init: function() {
    Model.init();
    View.init(Model.dataArray, Model.position);
    setInterval(function() {
      Model.decTime();
      Model.badMove();
      View.render(Model.dataArray, Model.position);
    }, 1000);
  },

  move: function(keyCode) {
    var direction = this.KEYCODE[keyCode];
    Model.move(direction, Model.position);
    View.render(Model.dataArray, Model.position);
  },

  getRemaining: function() {
    return Model.correct.length - Model.eaten;
  },

  gameOver: function() {
    if (this.getRemaining() === 0) {
      this.gameWin();
    } else if (Model.time === 0) {
      this.gameLose();
    } else if (String(Model.position) === String(Model.badPosition)) {
      this.gameLose();
    }
  },

  getTime: function() {
    return Model.time;
  },

  gameLose: function() {
    var answer = confirm("You lose. Want to play again?");
    if (answer) {
      location.reload();
    }
  },

  gameWin: function() {
    var answer = confirm("You win!!!! Good job. Play again?");
    if (answer) {
      location.reload();
    }
  },
};

var Model = {

  BADIRECTION: {
    1: 'n',
    2: 'w',
    3: 's',
    4: 'e'
  },

  init: function() {
    this.buildBoard(this.dataArray);
    this.populateBoard(this.dataArray);
  },

  dataArray: new Array(5),

  correct: [],

  eaten: 0,

  position: [0,0],

  badPosition: [4,4],

  time: 60,

  buildBoard: function(array) {
    for (var i = 0; i < array.length; i++) {
      array[i] = new Array(5);
    }
  },

  populateBoard: function(array) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var rand = Math.floor(Math.random() * 2 + 1);
        if (rand === 2) {
          var select = this.PRIME[Math.floor(Math.random()*this.PRIME.length)]
          array[i][j] = select;
          this.correct.push(i + "," + j);
        } else {
          var select = this.NONPRIME[Math.floor(Math.random()*this.NONPRIME.length)]
          array[i][j] = select;
        }
      }
    }
  },

  move: function(direction, position) {
    if (direction === 'n') {
      position[0] = position[0] - 1;
    } else if (direction === 's') {
      position[0] = position[0] + 1;
    } else if (direction === 'e') {
      position[1] = position[1] + 1;
    } else if (direction === 'w') {
      position[1] = position[1] - 1;
    } else if (direction === 'enter') {
      this.eat();
    }
    for (var i = 0; i < position.length; i++) {
      if (position[i] === 5) {
        position[i] = 0;
      } else if (position[i] === -1) {
        position[i] = 4;
      }
    }
  },

  badMove: function() {
    var dir = Math.floor(Math.random() * 4 + 1);
    this.move(this.BADIRECTION[dir], this.badPosition);
  },

  eat: function() {
    if (this.correct.indexOf(this.position.join(",")) > -1) {
      this.addEat();
      this.dataArray[this.position[0]][this.position[1]] = "CORRECT";
    } else {
      Controller.gameLose();
    }
  },

  addEat: function() {
    if (this.dataArray[this.position[0]][this.position[1]] !== "CORRECT") {
      this.eaten += 1;
    }
  },

  decTime: function() {
    Model.time -= 1;
  },

  PRIME: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],

  NONPRIME: [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99]

};