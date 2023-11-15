import AbstractChart from "./ChartsBased.js";

export default class Barchart extends AbstractChart {

    constructor(){
        super()
        this.shadow = this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        this.render()
    }

    render(){
        this.shadow.innerHTML = `<div>Test</div>`
    }

}