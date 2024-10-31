const output = document.getElementById("output");
const dsplyPrv = document.getElementById("dsplyPrv");
const keys = document.querySelectorAll("input[type=button]");
let dotFlag = false;    // Checks the number contains "." or not
let clearAll = false;   // Will use for clearing display

keys.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.value;

        // Reset displays if clearAll is flagged
        if (clearAll) {
            output.value = "";
            dsplyPrv.value = "";
            clearAll = false;
        }

        // Handling Equals operator
        if (value === "=") {
            try {
                dsplyPrv.value = eval(output.value) || "0";
            } catch {
                dsplyPrv.value = "Error";
            }
            clearAll = true;
        }
        // Handling Clear All (AC)
        else if (value === "AC") {
            output.value = "";
            dsplyPrv.value = "";
            dotFlag = false;
        }
        // Handling Delete Last Character (DE)
        else if (value === "DE") {
            if (output.value.slice(-1) === ".") dotFlag = false; // Reset dot flag if dot is deleted
            output.value = output.value.slice(0, -1);
        }
        // Handling Percentage (%)
        else if (value === "%") {
            const lastNumber = getLastNumber();
            if (lastNumber) {
                output.value = output.value.slice(0, -lastNumber.length) + (Number(lastNumber) / 100);
            }
        }
        // Handling Dot (.)
        else if (value === ".") {
            if (!dotFlag) {
                const last = checkLast();
                output.value += last === "operator" || output.value === "" ? "0." : ".";
                dotFlag = true;
            }
        }
        // Handling Plus-Minus (±)
        else if (value === "±") {
            const lastNumber = getLastNumber();
            if (lastNumber) {
                const sign = lastNumber.startsWith("-") ? lastNumber.slice(1) : "-" + lastNumber;
                output.value = output.value.slice(0, -lastNumber.length) + sign;
            } else if (!output.value) {
                output.value = "-";
            }
        }
        // Handling Operators (+, -, *, /)
        else if ("+-*/".includes(value)) {
            const last = checkLast();
            if (output.value && last === "number") {
                output.value += value;
                dotFlag = false;
            }
        }
        // Handling Numbers (0-9)
        else {
            output.value += value;
        }
    });
});

// Function to check the last character type in output
function checkLast() {
    const lastChar = output.value.slice(-1);
    if ("+-*/".includes(lastChar)) {
        return "operator";
    } else if (lastChar === ".") {
        return "dot";
    } else {
        return "number";
    }
}

// Function to get the last number from the input string
function getLastNumber() {
    const tokens = output.value.match(/(-?\d+\.?\d*)$/);
    return tokens ? tokens[0] : "";
}
