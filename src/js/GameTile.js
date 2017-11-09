/**
 * Wrapper class that manages the state for each tile of the game.
 */
export class GameTile {

    /**
     * 
     * @param {HTMLElement} element The element to be wrapped.
     * @param {Number} x The x coordniate of the tile on the game board.
     * @param {Number} y The y coordinate of the tile on the game board.
     */
    constructor(element, x, y) {
        this.element = element;
        this.symbolElement = this.element.querySelector(".symbol");
        this.x = x;
        this.y = y;
        this.clickListeners = [];

        this.bind();
    }

    /**
     * Binds all events needed to make this tile work properly.
     */
    bind() {
        this.element.addEventListener("click", (event) => {
            this.clicked(event);
        });
    }

    /**
     * Sets the tile as filled, and fills the tile with an O.
     */
    fillWithO() {
        this.setSymbol("O");
        this.element.classList.add("filled", "o-filled");
    }

    /**
     * Sets the tile as filled, and fills the tile with an X.
     */
    fillWithX() {
        this.setSymbol("X");
        this.element.classList.add("filled", "x-filled");
    }

    /**
     * Removes any symbol from the tile and sets the tile as unfilled.
     */
    reset() {
        this.setSymbol("");
        this.element.classList.remove("filled", "x-filled", "o-filled");
    }

    /**
     * Sets the value of the symbol element in the tile.
     * 
     * @param {String} symbol The symbol to set. 
     */
    setSymbol(symbol) {
        this.symbolElement.textContent = symbol;
    }

    /**
     * Adds a listener to be called when this element is clicked.
     * 
     * @param {Function} callback The callback to be called.
     */
    addClickListener(callback) {
        this.clickListeners.push(callback);
    }

    /**
     * Notifies any and all click listeners that this tile was clicked.
     */
    notifyClickListeners() {
        for(let x = 0; x < this.clickListeners.length; x++) {
            const listener = this.clickListeners[x];

            listener(this);
        }
    }

    /**
     * Called automatically when this tile is clicked.
     * 
     * @param {ClickEvent} event The event object generated for the click.
     */
    clicked(event) {
        this.notifyClickListeners();
    }

}