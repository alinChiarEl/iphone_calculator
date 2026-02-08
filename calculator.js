//make collections 2 types of buttons, operations and numbers
const operations = document.querySelectorAll(".operation"); //the node list of html elements for operations
const numbers = document.querySelectorAll(".numbers:not(.operation)"); //the node list for numbers
const display = document.getElementById("display"); //the input for displaying

//misc buttons
//all clear listens only to mouse click, not keydown
const all_clear = document.getElementById("all_clear"); //the button for ALL CLEAR

//del + equal listen to both mouse click and keydown
const del = document.getElementById("del"); //the button for SIGN CHANGE
const equal = document.getElementById("equal"); //the EQUAL button

//3 variables where we will keep track of the elements
const prevTextElement = document.querySelector(".previous-operand");
prevTextElement.innerText;
let prev = "";

const currTextElement = document.querySelector(".current-operand");
currTextElement.innerText = 0;
let curr = "";
let operation = undefined;

//function map for the operations. I think toFixed(6) is enough
const ops = {
  "+": (a, b) => Number((Number(a) + Number(b)).toFixed(6)),
  "-": (a, b) => Number((Number(a) - Number(b)).toFixed(6)),
  "*": (a, b) => Number((Number(a) * Number(b)).toFixed(6)),
  "/": (a, b) => Number((Number(a) / Number(b)).toFixed(6)),
};

all_clear.addEventListener("click", allClearListener);
equal.addEventListener("click", equalListener);
del.addEventListener("click", delListener);

function delListener(e) {
  htmlItem = document.getElementById("del");

  clickNumberEffect(htmlItem);

  if (curr != "") {
    curr = curr.toString().slice(0, -1);
  }
  updateDisplay();
}

function equalListener(e) {
  htmlItem = document.getElementById("equal");
  clickOperationEffect(htmlItem);
  compute();
  updateDisplay();
}

function allClearListener() {
  htmlItem = document.getElementById("all_clear");
  clickNumberEffect(htmlItem);

  clear();
  updateDisplay();
}
function clear() {
  curr = "";
  prev = "";
  operation = undefined;
}

//event listeners and functiions
//click handlers here. Numpad/keypad handlers are below
numbers.forEach((item) => item.addEventListener("click", clickOnNumber));
numbers.forEach((item) =>
  item.addEventListener("mousedown", (e) => clickNumberEffect(e.target))
);

operations.forEach((item) => item.addEventListener("click", clickOnOperation));
operations.forEach((item) =>
  item.addEventListener("click", (e) => clickOperationEffect(e.target))
);

function clickOnNumber(e) {
  appendNumber(e.target.dataset.id); //I pass the number
  updateDisplay();
}

function clickOnOperation(e) {
  chooseOperation(e.target.dataset.id);
  updateDisplay();
}

document.addEventListener("keydown", keyDownEvent);

//this is perfect for the keydown but too laggy for the mouseclick
function clickNumberEffect(item) {
  item.classList.add("active");

  setTimeout(() => {
    item.classList.remove("active");
  }, 200);
}

function clickOperationEffect(item) {
  item.classList.add("active_operation");
  setTimeout(() => {
    item.classList.remove("active_operation");
  }, 200);
  updateDisplay();
}

function keyDownEvent(e) {
  if (e.keyCode == 8) {
    delListener(); // is the keyCode for backspace which I mapped to ALL CLEAR
    return;
  }
  if (e.keyCode == 67) {
    allClearListener(); // bind C => All Clear
    return;
  }

  if (e.keyCode == 13) {
    equalListener(); // is the keyCode for enter which is mapped to EQUAL
    return;
  }

  //loop over the keys see which one was pressed then call the clickHandler on it.
  //normalkey = keycode of the top keyboard numbers
  //keyCode = keycode of numpad keyboard numbers
  numbers.forEach((item) => {
    if (item.dataset.key == e.keyCode || item.dataset.normalkey == e.keyCode) {
      appendNumber(item.dataset.id);
      updateDisplay();

      clickNumberEffect(item);
    }
  });

  operations.forEach((item) => {
    if (item.dataset.key == e.keyCode) {
      chooseOperation(item.dataset.id);

      clickOperationEffect(item);
    }
  });
}

function chooseOperation(op) {
  if (curr === "") {
    return;
  }

  if (prev !== "") {
    compute();
  }
  operation = op;
  prev = curr;
  curr = "";
}

// does nothing for the display
function appendNumber(number) {
  if (curr.length > 10) {
    alert("too many digits");
    return;
  }
  //   console.warn(curr.length);

  if (number === "." && curr.toString().includes(".")) return;
  curr = curr.toString() + number.toString();
}

//for now i just want to use numpad keys

//this just takes the values and updates the display, nothing more
function updateDisplay() {
  currTextElement.innerText = getDisplayNumber(curr);
  if (operation != null) {
    prevTextElement.innerText = `${getDisplayNumber(prev)} ${operation}`;
    // console.log(
    //   `updateDisplay previous with ${getDisplayNumber(prev)} ${operation}`
    // );
  } else {
    prevTextElement.innerText = "";
    // console.log(`updateDisplay prev with nothing`);
  }
}

function getDisplayNumber(number) {
  const stringNumber = number.toString();
  const integerDigits = parseFloat(stringNumber.split(".")[0]);
  const decimalDigits = stringNumber.split(".")[1];
  let integerDisplay;
  if (isNaN(integerDigits)) {
    integerDisplay = "";
  } else {
    integerDisplay = integerDigits.toLocaleString("en", {
      maximumFractionDigits: 0,
    });
  }
  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}`;
  } else {
    return integerDisplay;
  }
}

function compute() {
  let result = "";
  prev = parseFloat(prev);
  curr = parseFloat(curr);
  if (isNaN(prev) || isNaN(curr)) return;

  result = ops[operation](prev, curr);
  // console.warn(`computed() ${result}`);
  prev = "";
  curr = result;
  operation = undefined;
}

//runtime
