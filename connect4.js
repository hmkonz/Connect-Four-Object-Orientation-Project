/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
// Once the startGame function is executed (when the start game button is clicked), a new class object is instantiated(new Game), the constructor function runs and assigns the HEIGHT, WIDTH, p1 and p2 properties. Also p1 and p2 are assigned as the elements of the array 'players', currPlayer is set equal to p1 and gameOver is set equal to false at the start of the game (before any cells are clicked). The two functions that create the board in memory and an HTML table with row of column tops are also executed so the game can begin.
class Game {
  constructor(p1, p2, HEIGHT, WIDTH) {
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }
  /** makeBoard: creates a memory board structure in-JS:
  board = array of rows, each row is an array of cells (board[y][x]) */

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      let boardArray = [];
      for (let j = 0; j < this.WIDTH; j++) {
        boardArray.push(null);
      }
      this.board.push(boardArray);
    }
  }
  /** makeHtmlBoard: makes an HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // store a reference to the handleClick bound function so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);

    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, returns top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: updates DOM to place piece into HTML table of board with a color corresponding to the currPlayer*/

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announces game end and removes the event listener on the top row so game ends when there's a winner or tie game*/
  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    // check for tie
    // if all the cells in the top row (x=0) are filled (not equal to null), it's a tie game

    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}
// the Player class assigns the value of each player's piece when the color is input at the start of the game
class Player {
  constructor(color) {
    this.color = color;
  }
}

// function startGame assigns p1 and p2 player colors from the Player class and instantiates a new class object (new Game) with the p1, p2, height and width properties
function startGame() {
  let p1Color = document.getElementById("player1-color").value;
  let p1 = new Player(p1Color);

  let p2Color = document.getElementById("player2-color").value;
  let p2 = new Player(p2Color);
  // a new object is instantiated when the start game button is clicked with the values of p1, p2, HEIGHT and WIDTH then being used when the constructor function is executed
  new Game(p1, p2, 6, 7);
}

// an event listener is added to the start game button causing the startGame function to be  executed
document.getElementById("btn").addEventListener("click", function (event) {
  event.preventDefault();
  startGame();
});
