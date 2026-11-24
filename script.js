let currentExpression = "";
let history = [];
const upperDisplay = document.getElementById('upper-display');
const lowerDisplay = document.getElementById('lower-display');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

// 1. Adds value to calculation
function append(value) {
    currentExpression += value;
    updateDisplay();
}

// 2. AC Button
function allClear() {
    currentExpression = "";
    lowerDisplay.innerText = "0";
    updateDisplay();
}

// 3. DEL Button
function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

// 4. Update the visual screen
function updateDisplay() {
    let visual = currentExpression
        .replace(/Math.sin\(/g, 'sin(')
        .replace(/Math.cos\(/g, 'cos(')
        .replace(/Math.tan\(/g, 'tan(')
        .replace(/Math.log10\(/g, 'log(')
        .replace(/Math.log\(/g, 'ln(')
        .replace(/Math.sqrt\(/g, '√(')
        .replace(/\*\*/g, '^')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/Math.PI/g, 'π')
        .replace(/Math.E/g, 'e');
    
    upperDisplay.innerText = visual;
}

// 5. Perform Calculation
function calculate() {
    try {
        if (currentExpression === "") return;

        // Auto-close parentheses
        let openP = (currentExpression.match(/\(/g) || []).length;
        let closeP = (currentExpression.match(/\)/g) || []).length;
        while(openP > closeP) {
            currentExpression += ")";
            openP--;
        }

        let result = eval(currentExpression);
        
        // Formatting
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }

        // Add to History
        addToHistory(upperDisplay.innerText, result);

        lowerDisplay.innerText = result;
    } catch (error) {
        lowerDisplay.innerText = "Syntax ERROR";
    }
}

// 6. History Functions
function addToHistory(expr, res) {
    const calculation = { expr, res };
    history.unshift(calculation); // Add to top
    if (history.length > 20) history.pop(); // Keep last 20
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = `<li style="text-align:center; color:#888; margin-top:20px;">No history yet</li>`;
        return;
    }

    historyList.innerHTML = history.map((item, index) => `
        <li class="history-item" onclick="useHistoryItem(${index})">
            <span class="hist-expr">${item.expr}</span>
            <span class="hist-res">= ${item.res}</span>
        </li>
    `).join('');
}

function toggleHistory() {
    historyPanel.classList.toggle('history-show');
    historyPanel.classList.toggle('history-hide');
}

function clearHistory() {
    history = [];
    renderHistory();
}

// Click on history item to bring it back to screen
function useHistoryItem(index) {
    const item = history[index];
    lowerDisplay.innerText = item.res;
    toggleHistory(); // Close panel
}

// 7. Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= "0" && e.key <= "9") append(e.key);
    if (e.key === "+") append("+");
    if (e.key === "-") append("-");
    if (e.key === "*") append("*");
    if (e.key === "/") append("/");
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") backspace();
    if (e.key === "Escape") allClear();
});