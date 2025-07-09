const form = document.getElementById("expense-form");
const descInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const errorMsg = document.getElementById("error-message");
const tableBody = document.querySelector("#expense-table tbody");
const totalDisplay = document.getElementById("total-expense");
const filterSelect = document.getElementById("filter-category")

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

form.addEventListener("submit", e => {
    e.preventDefault();
    const desc = descInput.value.trim();
    const cat = categoryInput.value;
    const amt = parseFloat(amountInput.value);

    if (!desc || !cat || isNaN(amt) || amt <= 0) {
        alert("Please write a description, choose a category and enter a valid number");
        return;
    }

    const expense = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        description: desc,
        category: cat,
        amount: amt.toFixed(2)
    }

    expenses.push(expense);
    saveAndRender();
    form.reset();
});

tableBody.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        expenses = expenses.filter(exp => exp.id !== id);
        saveAndRender();
    }
});

filterSelect.addEventListener("change", renderExpenses);

function saveAndRender() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
}

function renderExpenses() {
    const filter = filterSelect.value;
    tableBody.innerHTML = "";
    const toShow = filter === "all" || filter === "" ? expenses : expenses.filter(exp => exp.category === filter);

    toShow.forEach(exp => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${exp.date}</td>
        <td>${exp.description}</td>
        <td>${exp.category}</td>
        <td>${exp.amount}</td>
        <td><button class="delete-btn" data-id="${exp.id}">Delete</button></td>`;
        tableBody.appendChild(row);
    });

    updateTotal(toShow);
}

function updateTotal(list) {
    const sum = list.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
    totalDisplay.textContent = `Total expenditure: ${sum.toFixed(2)} USD`;
}

