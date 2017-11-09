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

    static get FLIP_CLASS() {
        return "flip";
    }

}