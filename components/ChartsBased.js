class AbstractChart extends HTMLElement {

    constructor(){
        super()
        if(this.constructor === AbstractChart){
            throw new TypeError("Abstract class cannot be instanciated directly.")
        }
    }

    render(){
        throw new Error("Abstract chart cannot be use.")
    }

}

export default AbstractChart;