export class GameTile {

    /**
     * 
     * @param {HTMLElement} element The element to be wrapped. 
     */
    constructor(element, x, y) {
        this.element = element;
        this.symbolElement = this.element.querySelector(".symbol");
        this.x = x;
        this.y = y;
        this.clickListeners = [];

        this.bind();
    }

    bind() {
        this.element.addEventListener("click", (event) => {
            this.clicked(event);
        });
    }

    fillWithO() {
        this.setSymbol("O");
        this.element.classList.add("filled", "o-filled");
    }

    fillWithX() {
        this.setSymbol("X");
        this.element.classList.add("filled", "x-filled");
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

    notifyClickListeners() {
        for(let x = 0; x < this.clickListeners.length; x++) {
            const listener = this.clickListeners[x];

            listener(this);
        }
    }

    clicked(event) {
        this.notifyClickListeners();
    }

}