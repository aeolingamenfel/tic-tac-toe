/**
 * Wrapper for the game status flipping card.
 */
export class GameStatus {

    constructor() {
        this.element = window.statusElement;
        this.pill = this.element.querySelector(".pill");
        this.isFlipped = false;
    }

    /**
     * Flips the status indicator.
     */
    flip() {
        this.isFlipped = this.pill.classList.toggle(GameStatus.FLIP_CLASS);
    }

    /**
     * CSS class to be applied to the flipping "pill" part of the game status
     * indicator to flip it.
     */
    static get FLIP_CLASS() {
        return "flip";
    }

}