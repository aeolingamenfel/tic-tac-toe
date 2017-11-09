import {GameTile} from "GameTile";
import {ResetButton} from "ResetButton";

/**
 * UI controller that manages and exposes an API for the game board itself.
 */
export class GameBoard {

    constructor() {
        this.element = window.board;
        this.resetButton = new ResetButton();
        this.tiles = [];
        this.tileClickListeners = [];

        this.setupTiles();
    }

    /**
     * Adds a callback that will be called when a tile is clicked. The tile that 
     * is clicked will be passed to the callback.
     * 
     * @param {Function} callback The function to be called when any tile is 
     *  clicked.
     */
    addTileClickListener(callback) {
        this.tileClickListeners.push(callback);
    }

    /**
     * Notifies all tile click listeners that a tile was clicked. Must pass in 
     * the tile that was clicked to pass through to the listeners.
     * 
     * @param {GameTile} tile The tile that should be sent to listeners. 
     */
    notifyTileClickListeners(tile) {
        for(let x = 0; x < this.tileClickListeners.length; x++) {
            const callback = this.tileClickListeners[x];

            callback(tile);
        }
    }

    /**
     * Locates, stores, and binds events to all the tiles on the game board.
     */
    setupTiles() {
        const tileElements = this.element.querySelectorAll(".tile");

        let xCoord = -1;
        let yCoord = -1;

        for(let x = 0; x < tileElements.length; x++) {
            xCoord = x % 3;
            yCoord = Math.floor(x / 3);

            const tileElement = tileElements[x];
            const tile = new GameTile(tileElement, xCoord, yCoord);

            tile.addClickListener((tile) => {
                this.tileClicked(tile);
            });

            if(!this.tiles[xCoord]) {
                this.tiles[xCoord] = [];
            }

            this.tiles[xCoord][yCoord] = tile;
        }
    }

    /**
     * Called automatically when one of the tiles on the board is clicked.
     * 
     * @param {GameTile} tile The tile that was clicked. 
     */
    tileClicked(tile) {
        this.notifyTileClickListeners(tile);
    }

    /**
     * Sets the board to its "complete" state.
     */
    setComplete() {
        this.element.classList.add(GameBoard.COMPLETE_CLASS);
        this.resetButton.show();
    }

    /**
     * Resets the board (and all tiles on the board) for a fresh game.
     */
    reset() {
        let tilesList = null;
        let tile = null;

        this.element.classList.remove(GameBoard.COMPLETE_CLASS);
        this.resetButton.hide();

        for(let x = 0; x < this.tiles.length; x++) {
            tilesList = this.tiles[x];

            for(let y = 0; y < tilesList.length; y++) {
                tile = tilesList[y];

                tile.reset();
            }
        }
    }

    /**
     * CSS class applied to the board wrapper to indicate that the game is
     * complete.
     */
    static get COMPLETE_CLASS() {
        return "complete";
    }

}