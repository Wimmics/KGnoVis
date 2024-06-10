const update = (text) => {
    let displayCode = document.querySelector("#display-code");

    /*if (text[text.length - 1] === "\n") {
        text += " ";
    }*/

    displayCode.textContent = text.replace(new RegExp("&", "g"), "&").replace(new RegExp("<", "g"), "<");
    Prism.highlightElement(displayCode)
}

const sync_scroll = (element) => {
    let result_element = document.querySelector("#highlighting");
    result_element.scrollTop = element.scrollTop;
    result_element.scrollLeft = element.scrollLeft;
}

const check_tab = (this, event) => {
    let code = element.value;
    if (event.key == "Tab") {
        /* Tab key pressed */
        event.preventDefault(); // stop normal
        let before_tab = code.slice(0, element.selectionStart); // text before tab
        let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
        let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
        element.value = before_tab + "\t" + after_tab; // add tab char
        // move cursor
        element.selectionStart = cursor_pos;
        element.selectionEnd = cursor_pos;
        update(element.value); // Update text to include indent
    }
}