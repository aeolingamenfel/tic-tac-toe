import {GameStatus} from "GameStatus";
import {GameBoard} from "GameBoard";

const TURN_STATUS = {
    X_TURN: 0,
    O_TURN: 1
};

const PLAYERS = {
    X: 1,
    O: 2
};

const GAME_STATES = {
    ACTIVE: 0,
    COMPLETE: 1
};

export class TicTacToeGame {

    constructor() {
        // UI Elements
        this.status = new GameStatus();
        this.board = new GameBoard();

        // Game Status
        this.turn = TURN_STATUS.O_TURN;
        this.boardState = [];
        this.gameState = GAME_STATES.ACTIVE;

        this.bind();
    }

    bind() {
        this.board.addTileClickListener((tile) => {
            this.tileClicked(tile);
        });

        this.board.resetButton.addClickListener(() => {
            this.resetButtonClicked();
        });
    }

    tileClicked(tile) {
        // Don't do anything if the tile is already filled, or the game isn't 
        // running.
        if(this.gameState !== GAME_STATES.ACTIVE
            || this.squareFilled(tile.x, tile.y)) {
            return;
        }

        this.placeSymbol(tile);
    }

    resetButtonClicked() {
        this.reset();
    }

    reset() {
        // reset turn
        this.turn = TURN_STATUS.O_TURN;

        // reset game state
        this.gameState = GAME_STATES.ACTIVE;

        // reset game board
        for(let x = 0; x < TicTacToeGame.BOARD_WIDTH; x++) {
            for(let y = 0; y < TicTacToeGame.BOARD_HEIGHT; y++) {
                if(this.boardState[x]) {
                    this.boardState[x][y] = null;
                }
            }
        }

        // reset UI
        this.board.reset();

        if(this.status.isFlipped) {
            this.status.flip();
        }
    }

    placeSymbol(tile) {
        // fill the appropriate square
        this.fillSquare(tile.x, tile.y, this.getFillValueForTurn());

        // set the tile to show the visible symbol
        if(this.turn === TURN_STATUS.O_TURN) {
            tile.fillWithO();
        } else {
            tile.fillWithX();
        }

        // swap the turn
        this.nextTurn();
    }

    /**
     * Increments the turn and updates the UI appropriately.
     */
    nextTurn() {
        if(this.turn === TURN_STATUS.O_TURN) {
            this.turn = TURN_STATUS.X_TURN;
        } else {
            this.turn = TURN_STATUS.O_TURN;
        }

        this.checkWinCondition();

        this.status.flip();
    }

    /**
     * Examines the board state and determines whether the game has been won.
     * If the game has been won, will stop the game.
     */
    checkWinCondition() {
        const winningPlayer = this.boardContainsCompleteLine();

        if(winningPlayer) {
            this.completeGame();
        }
    }

    /**
     * Sets the game state as completed, including updating the state of the 
     * game and updating the UI.
     */
    completeGame() {
        this.gameState = GAME_STATES.COMPLETE;
        this.board.setComplete();
    }

    /**
     * Checks the board to see if any complete line exists.
     * 
     * @returns {Number|null} The ID of the player that owns the complete line,
     *  or null if no such complete line exists.
     */
    boardContainsCompleteLine() {
        return this.columnsContainsCompleteLine()
            || this.rowsContainsCompleteLine()
            || this.diagonalsContainsCompleteLine();
    }

    /**
     * Checks all diagonals to see if any given diagonal contains a complete 
     * line.
     * 
     * @returns {Number|null} Either the player ID of the player owning the 
     *  completed line, or null if no complete line exists.
     */
    diagonalsContainsCompleteLine() {
        let result = null;

        for(let x = 0; x < TicTacToeGame.BOARD_WIDTH; x++) {
            result = this.diagonalContainsCompleteLine(x, 0);

            if(result) {
                return result;
            }
        }

        return null;
    }

    /**
     * Checks a diagonal on the board starting at the coordinate specified and 
     * going down and left and down and right looking for complete matches.
     * 
     * @param {Number} x The x coordinate of the position to start at.
     * @param {Number} y The y coordniate of the position to start at.
     * 
     * @returns {Number|null} The player ID of the player owning the complete 
     *  line or null if no complete line exists.
     */
    diagonalContainsCompleteLine(x, y) {
        return this.checkDiagonal(x, y)
            || this.checkDiagonal(x, y, true)
            || null;
    }

    /**
     * Checks a specific diagonal for a complete line starting at the given 
     * x and y coordinates, going left or right depending on the specified 
     * direction.
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} goLeft If true, will go left, otherwise will go right.
     * 
     * @returns {Number|null}
     */
    checkDiagonal(x, y, goLeft = false) {
        let endX = 0;
        let endY = y + 3;

        if(goLeft) {
            endX = x - 3;
        } else {
            endX = x + 3;
        }

        if(!this.isValidCoordinates(goLeft ? endX + 1 : endX - 1, endY - 1)) {
            return null;
        }

        let currX = x;
        let currY = y;
        let xCount = 0;
        let oCount = 0;
        let value = null;

        while((goLeft ? currX > endX : currX < endX) && currY < endY) {
            value = this.getValueAt(currX, currY);

            switch(value) {
                case "x":
                    xCount++;
                    break;
                case "o":
                    oCount++;
                    break;
                default:
                    break;
            }

            currX = goLeft ? currX - 1 : currX + 1;
            currY++;
        }

        if(xCount === 3) {
            return PLAYERS.X;
        } else if(oCount === 3) {
            return PLAYERS.O;
        } else {
            return null;
        }
    }

    /**
     * Checks all rows, returning the player ID of the player that owns a
     * complete line in the rows, or null if no complete line exists.
     * 
     * @returns {Number|null}
     */
    rowsContainsCompleteLine() {
        let result = null;

        for(let y = 0; y < TicTacToeGame.BOARD_HEIGHT; y++) {
            result = this.rowContainsCompleteLine(y);

            if(result) {
                return result;
            }
        }

        return null;
    }

    /**
     * Checks the row specified with the y parameter to see if it has a complete
     * line.
     * 
     * @param {Number} y The y coordinate of the row to check.
     * 
     * @returns {Number|null} Either the player ID or null if no player has a 
     *  complete line in this row. 
     */
    rowContainsCompleteLine(y) {
        let xCount = 0;
        let oCount = 0;
        let value = null;

        for(let x = 0; x < TicTacToeGame.BOARD_WIDTH; x++) {
            value = this.getValueAt(x, y);

            switch(value) {
                case "x":
                    xCount++;
                    break;
                case "o":
                    oCount++;
                    break;
                default:
                    break;
            }
        }

        if(xCount === TicTacToeGame.BOARD_WIDTH) {
            return PLAYERS.X;
        } else if(oCount === TicTacToeGame.BOARD_WIDTH) {
            return PLAYERS.O;
        } else {
            return null;
        }
    }

    /**
     * Goes through all columns and checks whether any contain a complete line.
     * If one does, will return the player that owns the line, otherwise null.
     */
    columnsContainsCompleteLine() {
        let result = null;

        for(let x = 0; x < TicTacToeGame.BOARD_WIDTH; x++) {
            result = this.columnContainsCompleteLine(x);

            if(result) {
                return result;
            }
        }

        return null;
    }

    /**
     * Determines whether the column specified with the x parameter contains a 
     * complete line. Will return null if a complete line could not be found, or
     * the player who owns the complete line.
     * 
     * @param {Number} x The x coordinate for the column to check.
     * 
     * @returns {Number|null}
     */
    columnContainsCompleteLine(x) {
        let xCount = 0;
        let oCount = 0;
        let value = null;

        for(let y = 0; y < TicTacToeGame.BOARD_HEIGHT; y++) {
            value = this.getValueAt(x, y);

            switch(value) {
                case "x":
                    xCount++;
                    break;
                case "o":
                    oCount++;
                    break;
                default:
                    break;
            }
        }

        if(xCount === TicTacToeGame.BOARD_HEIGHT) {
            return PLAYERS.X;
        } else if(oCount === TicTacToeGame.BOARD_HEIGHT) {
            return PLAYERS.O;
        } else {
            return null;
        }
    }

    /**
     * Gets the value contained in the tile specified with the coordinates.
     * 
     * @param {Integer} x The x coordinate of the tile to check.
     * @param {Integer} y The y coordniate of the tile to check.
     * 
     * @returns {String|null}
     */
    getValueAt(x, y) {
        if(!this.boardState[x] || !this.boardState[x][y]) {
            return null;
        }

        return this.boardState[x][y];
    }

    /**
     * Given a set of (x, y) coordinates, determines whether they are valid, aka
     * whether or not they fall on the board.
     * 
     * @param {Number} x 
     * @param {Number} y
     * 
     * @returns {Boolean}
     */
    isValidCoordinates(x, y) {
        if(x < 0 || y < 0) {
            return false;
        }

        if(x > TicTacToeGame.BOARD_WIDTH - 1
            || y > TicTacToeGame.BOARD_HEIGHT - 1) {
            return false;
        }

        return true;
    }

    /**
     * Gets the appropriate string value to fill a square with given the current
     * turn state.
     * 
     * @returns {String}
     */
    getFillValueForTurn() {
        switch(this.turn) {
            case TURN_STATUS.O_TURN:
                return "o";
                break;
            case TURN_STATUS.X_TURN:
                return "x";
                break;
            default:
                throw new Error("Unknown turn state!");
        }
    }

    /**
     * Fills a given square in the board state with the specified value, at the 
     * position specified with the x and y coordinates. Will return false if the
     * square specified is already filled.
     * 
     * @param {Integer} x The x coordinate of the square to fill.
     * @param {Integer} y The y coordinate of the square to fill.
     * @param {String} value The value to fill the square with.
     * 
     * @returns {Boolean} Returns true if the square was filled successfully, or
     *  false if the square already had a value in it.
     */
    fillSquare(x, y, value) {
        if(!this.boardState[x]) {
            this.boardState[x] = [];
        }

        if(this.boardState[x][y]) {
            return false;
        }

        this.boardState[x][y] = value;

        return true;
    }

    /**
     * Returns true if the square specified by the given coordinates is filled,
     * or false otherwise.
     * 
     * @param {Integer} x The x coordinate of the square to check.
     * @param {Integer} y The y coordinate of the square to check.
     * 
     * @returns {Boolean}
     */
    squareFilled(x, y) {
        if(!this.boardState[x]) {
            return false;
        }

        if(!this.boardState[x][y]) {
            return false;
        }

        return true;
    }

    static get BOARD_WIDTH() {
        return 3;
    }

    static get BOARD_HEIGHT() {
        return 3;
    }

}