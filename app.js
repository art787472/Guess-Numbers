const input = document.querySelector("#input");
const guessBtn = document.querySelector("#guess");
const randomBtn = document.querySelector("#random");
const restartBtn = document.querySelector("#restart");
const outcomeList = document.querySelector("#outcome");
const keyboards = document.querySelectorAll(".keyboard");
const allBtn = document.querySelectorAll("button");
const numpadToggle = document.querySelector(".numpad-layout-switch input");

let guessTime = 0;

const answer = getRandomNum();

document.querySelector(".ok-btn").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});

document.querySelector("#info-btn").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "flex";
});

document.addEventListener("keydown", () => {
  input.focus();
});

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  console.log(event);
  if (event.key === "Enter") {
    event.preventDefault();
    console.log(event.key);
    guessBtn.click();
  }
});

input.addEventListener("input", (event) => {
  let value = input.value;
  let nowValue = input.value;
  let newValue = nowValue.slice(-1);
  nowValue = nowValue.slice(0, nowValue.length - 1);

  console.log("nowValue:", nowValue);
  console.log("newValue:", newValue);

  if (!/^\d$/.test(newValue) && newValue !== "") {
    input.value = nowValue;
    if ((newValue === "r") | (newValue === "R")) {
      restartBtn.click();
    }
    return;
  }

  if (nowValue !== "" && nowValue.includes(newValue)) {
    const index = nowValue.indexOf(newValue);
    let front = nowValue.slice(0, index);
    let back = nowValue.slice(index + 1, nowValue.length);
    nowValue = front + back;
    input.value = nowValue;

    keyboards.forEach((keyboard) => {
      if (newValue === keyboard.textContent) {
        keyboard.classList.remove("guessed");
      }
    });

    enableBtn();

    return;
  }

  if (nowValue.length > 3) {
    input.value = nowValue.slice(0, 4);
    return;
  }

  nowValue = input.value;
  console.log(nowValue);
  keyboards.forEach((keyboard) => {
    if (
      nowValue.includes(keyboard.textContent) &&
      keyboard.textContent !== ""
    ) {
      keyboard.classList.add("guessed");
    } else {
      keyboard.classList.remove("guessed");
      enableBtn();
    }
  });

  if (input.value.length === 4) {
    disableBtn();
  }
});

keyboards.forEach((keyboard) => {
  keyboard.addEventListener("click", () => {
    let value = input.value;
    // Handle backward key
    if (keyboard.id === "back") {
      console.log("back");
      keyboards.forEach((keyboard) => {
        if (keyboard.textContent === value.slice(-1)) {
          keyboard.classList.remove("guessed");
        }
      });
      value = value.slice(0, value.length - 1);
      input.value = value;
      enableBtn();

      return;
    }
    // Handle reset key
    if (keyboard.id === "reset") {
      console.log("reset");
      input.value = "";
      keyboards.forEach((keyboard) => {
        keyboard.classList.remove("guessed");
      });
      enableBtn();
      return;
    }
    // Handle repetitive inputs
    if (value.includes(keyboard.textContent)) {
      const index = value.indexOf(keyboard.textContent);
      let front = value.slice(0, index);
      let back = value.slice(index + 1, value.length);
      value = front + back;
      input.value = value;
      keyboard.classList.remove("guessed");
      enableBtn();
      return;
    }
    // Handle more than 4 numbers
    if (input.value.length > 3) {
      input.value = value;
      return;
    }
    // Handle regular inputs
    if (input.value.includes(keyboard.textContent)) {
      input.value = value;
      return;
    }
    value += keyboard.textContent;
    input.value = value;
    keyboard.classList.add("guessed");

    if (input.value.length === 4) {
      disableBtn();
    }
  });
});

guessBtn.addEventListener("click", () => {
  if (input.value.length === 4) {
    if (!/(?:([0-9])(?!.*\1)){4}/.test(input.value)) {
      outcomeList.innerHTML += `<li>Your guess: ${guess} Outcome: ${playerOutcome}</li>`;
      createWarning();
    } else {
      const guess = input.value;
      const playerOutcome = outcome(guess);
      const playOutcome = document.createElement("li");
      playOutcome.textContent = `Your Guess: ${guess}  Outcome: ${playerOutcome}`;
      input.value = "";
      keyboards.forEach((keyboard) => {
        keyboard.classList.remove("guessed");
      });
      enableBtn();
      if (playerOutcome === "4A 0B") {
        keyboards.forEach((btn) => {
          btn.classList.add("disabled");
          btn.disabled = true;
        });

        guessBtn.classList.add("disabled");
        randomBtn.classList.add("disabled");
        document.addEventListener("keydown", (e) => {
          e.preventDefault();
        });
        playOutcome.textContent += " You win!!";
        outcomeList.prepend(playOutcome);
        return;
      }

      outcomeList.prepend(playOutcome);
    }

    guessTime++;
  } else {
    createWarning();
  }
});

randomBtn.addEventListener("click", () => {
  enableBtn();
  input.value = getRandomNum();

  keyboards.forEach((keyboard) => {
    keyboard.classList.remove("guessed");
    if (
      input.value.includes(keyboard.textContent) &&
      keyboard.textContent !== ""
    ) {
      keyboard.classList.add("guessed");
    }
  });
  disableBtn();
});

numpadToggle.addEventListener("click", () => {
  if (numpadToggle.checked === true) {
    document.querySelector(".number-1-9").style["flex-wrap"] = "wrap";
  } else {
    document.querySelector(".number-1-9").style["flex-wrap"] = "wrap-reverse";
  }
});

// Main logic of the game
function outcome(guess) {
  let A = 0;
  let B = 0;
  for (let i of answer) {
    if (guess.indexOf(i) === -1) {
      continue;
    }
    if (guess.indexOf(i) === answer.indexOf(i)) {
      A++;
    } else {
      B++;
    }
  }
  return `${A}A ${B}B`;
}

function disableBtn() {
  keyboards.forEach((keyboard) => {
    if (
      !input.value.includes(keyboard.textContent) &&
      keyboard.textContent !== ""
    ) {
      keyboard.classList.add("disabled");
    }
  });
}

function enableBtn() {
  keyboards.forEach((keyboard) => {
    if (
      !input.value.includes(keyboard.textContent) &&
      keyboard.textContent !== ""
    ) {
      keyboard.classList.remove("disabled");
    }
  });
}

function getRandomNum() {
  result = "";
  numList = [];
  for (let i = 0; i < 4; i++) {
    let num = Math.floor(Math.random() * 10).toString();
    while (numList.includes(num)) {
      num = Math.floor(Math.random() * 10).toString();
    }
    numList.push(num);
    result += num;
  }
  return result;
}

function createWarning() {
  const warning = document.createElement("li");
  warning.textContent =
    "Invalid input. You should only guess four non-repetitive numbers.";
  outcomeList.prepend(warning);
  setTimeout(() => {
    warning.classList.add("disappear");
  }, 2000);
  setTimeout(() => {
    warning.remove();
  }, 3000);
}