let num1 = '';
let num2 = '';
let operator = '';
let display = ''; // display "in memory"

// this is set to true at start and also right after everytime equals sign is used to compute
// it is set to false whenever an operator is used, so that the next time an operator is used, it will trigger computation
let firstTimeOperatorUse = true; 

const displayText = document.querySelector('.display');
const numberBtns = document.querySelectorAll('.numbers');
const operatorBtns = document.querySelectorAll('.operators');
const equalsBtn = document.querySelector('.equals');
const backspaceBtn = document.querySelector('.backspace');
const clearBtn = document.querySelector('.clear');

function operate(num1, num2, operator) {
    switch(operator) {
        case '+':
            return add(num1, num2);
            break;
        case '-':
            return subtract(num1, num2);
            break;
        case 'x':
            return multiply(num1, num2);
            break;
        case '/':
            return divide(num1, num2);
            break;
    }
}

function add(num1, num2) {
    return Math.round((Number(num1) + Number(num2))*100)/100;
}

function subtract(num1, num2) {
    return Math.round((Number(num1) - Number(num2))*100)/100;
}

function multiply(num1, num2) {
    return Math.round((Number(num1) * Number(num2))*100)/100;
}

function divide(num1, num2) {
    return (Math.round((num1 / num2)*100))/100;
}

function clear() {
    display = '';
    displayText.textContent = '0';
    num1 = '';
    num2 = '';
    operator = '';
    firstTimeOperatorUse = true;
}

function backspace() {
    if (displayText.textContent.length > 1) {
        display = displayText.textContent.substring(0, displayText.textContent.length-1);
        displayText.textContent = display;
    } else {
        display = 0;
        displayText.textContent = display;
        display = '';
    }
}

function displayOnScreen(number) {
    if (operator == '=') clear();
    displayText.textContent = '';
    display += number; 
    displayText.textContent = display;
}

function addOperatorToExpression(operatorSign) {
    if (!firstTimeOperatorUse) {
        displayResults();
        // in displayResults() above, the last operator will be used
        // here the current operator (operatorSign), which was used to trigger a computation
        // will be assigned to the operator variable so that it will be used 
        // as the next operator
        operator = operatorSign;
        return;
    }
    if (num1 == '') num1 = Number(display);
    operator = operatorSign;
    display = '';
    firstTimeOperatorUse = false;
}

function evaluate() {
    displayResults();
    operator = '=';
    firstTimeOperatorUse = true;
}

function performValidityChecks() {
    if (display == '') {
        alert('You have not entered a valid expression to evaluate.');
        clear();
        return false;
    } else if (display != '') {
        num2 = Number(display); // assign display to num2 if display isn't empty
        return true;
    }

    if (num1.toString() == '' || num2.toString() == '' || operator == '') {
        alert('You have not entered a valid expression to evaluate.');
        clear();
        return false;
    }

    if (num2 === 0 && operator == '/') {
        alert('You cannot divide by 0 sir, try again.');
        clear();
        return false;
    }
}

function displayResults() {
    //exit function if validity checks fail
    if (performValidityChecks() == false) return;

    // display result
    displayText.textContent = '';
    display = '';
    displayOnScreen(operate(num1, num2, operator));

    // set num1 equal to result and set display in memory back to 0
    num1 = displayText.textContent;
    display = '';
}

// watch for changes to the display and 
// disable the decimal button if one is already there
function displayWatcher(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            if (displayText.textContent.includes('.')) {
                decimal.disabled = true;
            } else {
                decimal.disabled = false;
            }
        }
    }
}
let observer = new MutationObserver(displayWatcher);
observer.observe(displayText, {childList: true});

numberBtns.forEach(numberBtn => {
    numberBtn.addEventListener('click', e => {
        displayOnScreen(numberBtn.textContent);
    });

});

operatorBtns.forEach(operatorBtn => {
    operatorBtn.addEventListener('click', e => {
        addOperatorToExpression(operatorBtn.textContent);
    });
});

equalsBtn.addEventListener('click', e => {
    evaluate();
});

backspaceBtn.addEventListener('click', e => {
    backspace();
});

clearBtn.addEventListener('click', e => {
    clear();
});

document.addEventListener('keydown', handleKeyboardInput)

function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) displayOnScreen(e.key);
    if (e.key == '+' || e.key == '-' || e.key == 'x' || e.key == '/') addOperatorToExpression(e.key);
    if (e.key == '.') {             
        if (decimal.disabled) {
            alert('You cannot add multiple decimals to a number.');
            return;
        }
        displayOnScreen('.');
    }
    if (e.key == '=' || e.key == 'Enter') {
        evaluate();
    }
    if (e.key == 'Backspace') backspace();
    if (e.key == 'Delete') clear();
}