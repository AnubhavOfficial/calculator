function numberClicked(num) {
  const value = document.getElementById("text").value;

  if (value === undefined || value === null || value === "") {
    if (num === "+" || num === "-" || num === "*" || num === "/") {
      document.getElementById("text").value = "";
    } else {
      document.getElementById("text").value = num;
    }
  } else {
    const test = value[value.length - 1];
    if (test === "+" || test === "-" || test === "*" || test === "/") {
      if (num === "+" || num === "-" || num === "*" || num === "/") {
        document.getElementById("text").value =
          value.substring(0, value.length - 1) + num;
      } else {
        document.getElementById("text").value = value + num;
      }
    } else {
      document.getElementById("text").value = value + num;
    }
  }
  //   console.log(value);
}

function totalClicked() {
  const value = findResult(document.getElementById("text").value);
  document.getElementById("text").value = value;
}

function clearClicked() {
  document.getElementById("text").value = "";
}

const elem = document.getElementById("text");

elem.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    // key code of the keybord key
    event.preventDefault();
    // your code to Run
    totalClicked();
  }
});

// **************************************************************************************

const findResult = (exp = "") => {
  const digits = "0123456789.";
  const operators = ["+", "-", "*", "/", "negate"];
  const legend = {
    "+": {
      pred: 2,
      func: (a, b) => {
        return a + b;
      },
      assoc: "left",
    },
    "-": {
      pred: 2,
      func: (a, b) => {
        return a - b;
      },
      assoc: "left",
    },
    "*": {
      pred: 3,
      func: (a, b) => {
        return a * b;
      },
      assoc: "left",
    },
    "/": {
      pred: 3,
      func: (a, b) => {
        if (b != 0) {
          return a / b;
        } else {
          return 0;
        }
      },
    },
    assoc: "left",
    negate: {
      pred: 4,
      func: (a) => {
        return -1 * a;
      },
      assoc: "right",
    },
  };
  exp = exp.replace(/\s/g, "");
  let operations = [];
  let outputQueue = [];
  let ind = 0;
  let str = "";
  while (ind < exp.length) {
    let ch = exp[ind];
    if (operators.includes(ch)) {
      if (str !== "") {
        outputQueue.push(new Number(str));
        str = "";
      }
      if (ch === "-") {
        if (ind == 0) {
          ch = "negate";
        } else {
          let nextCh = exp[ind + 1];
          let prevCh = exp[ind - 1];
          if (
            (digits.includes(nextCh) || nextCh === "(" || nextCh === "-") &&
            (operators.includes(prevCh) || exp[ind - 1] === "(")
          ) {
            ch = "negate";
          }
        }
      }
      if (operations.length > 0) {
        let topOper = operations[operations.length - 1];
        while (
          operations.length > 0 &&
          legend[topOper] &&
          ((legend[ch].assoc === "left" &&
            legend[ch].pred <= legend[topOper].pred) ||
            (legend[ch].assoc === "right" &&
              legend[ch].pred < legend[topOper].pred))
        ) {
          outputQueue.push(operations.pop());
          topOper = operations[operations.length - 1];
        }
      }
      operations.push(ch);
    } else if (digits.includes(ch)) {
      str += ch;
    } else if (ch === "(") {
      operations.push(ch);
    } else if (ch === ")") {
      if (str !== "") {
        outputQueue.push(new Number(str));
        str = "";
      }
      while (
        operations.length > 0 &&
        operations[operations.length - 1] !== "("
      ) {
        outputQueue.push(operations.pop());
      }
      if (operations.length > 0) {
        operations.pop();
      }
    }
    ind++;
  }
  if (str !== "") {
    outputQueue.push(new Number(str));
  }
  outputQueue = outputQueue.concat(operations.reverse());
  let res = [];
  while (outputQueue.length > 0) {
    let ch = outputQueue.shift();
    if (operators.includes(ch)) {
      let num1, num2, subResult;
      if (ch === "negate") {
        res.push(legend[ch].func(res.pop()));
      } else {
        let [num2, num1] = [res.pop(), res.pop()];
        res.push(legend[ch].func(num1, num2));
      }
    } else {
      res.push(ch);
    }
  }
  return res.pop().valueOf();
};

function eraseClicked() {
  const value = document.getElementById("text").value;
  document.getElementById("text").value = value.substring(
    0,
    document.getElementById("text").value.length - 1
  );
}

const source = document.getElementById("text");
const result = document.getElementById("result");

const inputHandler = function (e) {
  result.innerHTML = e.target.value;
};

source.addEventListener("input", inputHandler);
