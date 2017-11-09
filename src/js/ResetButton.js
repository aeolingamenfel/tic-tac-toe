/**
 * Wrapper class for the board reset button. Manages its state.
 */
export class ResetButton {

    constructor() {
        this.element = window.resetButton;
        this.clickListeners = [];

        this.bind();
    }

    /**
     * Binds up all events for this wrapper class to work properly.
     */
    bind() {
        this.element.addEventListener("click", (event) => {
            this.wasClicked(event);
        });
    }

    /**
     * Called automatically when this button was clicked.
     * 
     * @param {ClickEvent} event The event object generated for the click.
     */
    wasClicked(event) {
        this.notifyClickListeners();
    }

    /**
     * Makes the button visible on the page.
     */
    show() {
        this.element.classList.add(ResetButton.SHOWN_CLASS);
    }

    /**
     * Hides the button on the page.
     */
    hide() {
        this.element.classList.remove(ResetButton.SHOWN_CLASS);
    }

    /**
     * Adds a callback to be called when this reset button was clicked.
     * 
     * @param {Function} callback The callback to be called when this button is
     *  clicked.
     */
    addClickListener(callback) {
        this.clickListeners.push(callback);
    }

    /**
     * Notifies any and all click listener callback functions.
     */
    notifyClickListeners() {
        let callback = null;

        for(let x = 0; x < this.clickListeners.length; x++) {
            callback = this.clickListeners[x];

            callback(this);
        }
    }

    /**
     * CSS class to apply to the reset button to make it visible.
     */
    static get SHOWN_CLASS() {
        return "active";
    }

}