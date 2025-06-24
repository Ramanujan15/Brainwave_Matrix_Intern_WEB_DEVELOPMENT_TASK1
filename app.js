window.onload = function () {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("Please login first!");
    window.location.href = "login.html";
  } else {
    renderTransactions();
  }
};

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!desc || !amount || !type || !category || !date) {
    alert("Please fill all fields!");
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount,
    type,
    category,
    date
  };

  const user = localStorage.getItem("loggedInUser");
  const allTransactions = JSON.parse(localStorage.getItem(user)) || [];
  allTransactions.push(transaction);
  localStorage.setItem(user, JSON.stringify(allTransactions));
  renderTransactions();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

function clearDateFilter() {
  document.getElementById("filterDate").value = "";
  renderTransactions();
}

function renderTransactions() {
  const user = localStorage.getItem("loggedInUser");
  const allTransactions = JSON.parse(localStorage.getItem(user)) || [];
  const filterDate = document.getElementById("filterDate").value;

  const transactions = filterDate
    ? allTransactions.filter((tx) => tx.date === filterDate)
    : allTransactions;

  const list = document.getElementById("transactionList");
  const income = document.getElementById("income");
  const expense = document.getElementById("expense");
  const balance = document.getElementById("balance");

  list.innerHTML = "";
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const li = document.createElement("li");
    li.classList.add(tx.type);
    li.innerHTML = `${tx.date} - ${tx.desc} (₹${tx.amount}) <span class='tag'>${tx.category}</span>`;
    list.appendChild(li);

    if (tx.type === "income") {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
    }
  });

  income.innerText = totalIncome;
  expense.innerText = totalExpense;
  balance.innerText = totalIncome - totalExpense;
}

let chart;

function toggleChart() {
  const chartSection = document.getElementById("chartSection");
  const button = document.querySelector("#toggleGraphBtn");

  if (chartSection.style.display === "none") {
    chartSection.style.display = "block";
    button.textContent = "📉 Hide Graph";
    updateChart(JSON.parse(localStorage.getItem(localStorage.getItem("loggedInUser")) || "[]"));
  } else {
    chartSection.style.display = "none";
    button.textContent = "📊 Show Graph";
  }
}

function updateChart(transactions) {
  const categories = {};
  transactions.forEach(tx => {
    if (tx.type === "expense") {
      categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
    }
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  const ctx = document.getElementById("expenseChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Expenses by Category",
        data: data,
        backgroundColor: "#e74c3c"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("✅ Service Worker Registered"))
      .catch((error) => console.log("❌ SW registration failed:", error));
  });
}
