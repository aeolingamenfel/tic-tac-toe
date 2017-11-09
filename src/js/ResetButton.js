export class ResetButton {

    constructor() {
        this.element = window.resetButton;
        this.clickListeners = [];

        this.bind();
    }

    bind() {
        this.element.addEventListener("click", (event) => {
            this.wasClicked(event);
        });
    }

    wasClicked(event) {
        this.notifyClickListeners();
    }

    show() {
        this.element.classList.add(ResetButton.SHOWN_CLASS);
    }

    hide() {
        this.element.classList.remove(ResetButton.SHOWN_CLASS);
    }

    addClickListener(callback) {
        this.clickListeners.push(callback);
    }

    notifyClickListeners() {
        let callback = null;

        for(let x = 0; x < this.clickListeners.length; x++) {
            callback = this.clickListeners[x];

            callback(this);
        }
    }

    static get SHOWN_CLASS() {
        return "active";
    }

}