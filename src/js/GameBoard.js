import {GameTile} from "GameTile";
import {ResetButton} from "ResetButton";

export class GameBoard {

    constructor() {
        this.element = window.board;
        this.resetButton = new ResetButton();
        this.tiles = [];
        this.tileClickListeners = [];

        this.setupTiles();
    }

    addTileClickListener(callback) {
        this.tileClickListeners.push(callback);
    }

    notifyTileClickListeners(tile) {
        for(let x = 0; x < this.tileClickListeners.length; x++) {
            const callback = this.tileClickListeners[x];

            callback(tile);
        }
    }

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

    setComplete() {
        this.element.classList.add(GameBoard.COMPLETE_CLASS);
        this.resetButton.show();
    }

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

    static get COMPLETE_CLASS() {
        return "complete";
    }

}