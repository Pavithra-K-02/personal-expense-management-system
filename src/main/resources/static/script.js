const API = "/expense";

let editingId = null;
let expenseChart = null;
let allExpenses = [];
let monthlyChart = null;

window.onload = function () {

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    loadExpenses();

};
// =========================
// SIDEBAR NAVIGATION
// =========================

function showSection(sectionId, element) {

    // Hide all sections
    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.remove("active-section");
    });

    // Show selected section
    document.getElementById(sectionId).classList.add("active-section");

    // Remove active class from all menu items
    document.querySelectorAll(".menu li").forEach(item => {
        item.classList.remove("active");
    });

    // Highlight clicked menu
    element.classList.add("active");

    // Change page title
    const heading = document.querySelector(".topbar h3");

    if (sectionId === "dashboard") {
        heading.innerHTML = "Dashboard";
    }

    if (sectionId === "addExpense") {
        heading.innerHTML = "Add Expense";
    }

    if (sectionId === "expenses") {
        heading.innerHTML = "Expenses";
    }

    if (sectionId === "analytics") {
        heading.innerHTML = "Analytics";
    }

}
// =========================
// ADD / UPDATE EXPENSE
// =========================

function addExpense() {

    const title = document.getElementById("title").value.trim();
    const amount = document.getElementById("amount").value;
    let category =
        document.getElementById("category").value;

    if(category === "Other"){

        category =
            document.getElementById("customCategory").value.trim();

        if(category === ""){

            alert("Please enter a custom category.");

            return;

        }

    }    const date = document.getElementById("date").value;

    if (title === "" || amount === "") {
        alert("Please fill all fields.");
        return;
    }


    const expense = {
        title: title,
        amount: parseFloat(amount),
        category: category,
        date: date
    };

    if (editingId == null) {

        fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        })
            .then(() => {
                clearForm();
                loadExpenses();
            });

    } else {

        fetch(API + "/" + editingId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        })
            .then(() => {

                editingId = null;

                document.querySelector(".btn-primary").innerHTML =
                    '<i class="bi bi-plus-circle"></i> Add';

                clearForm();
                loadExpenses();

            });

    }

}

// =========================
// LOAD EXPENSES
// =========================

function loadExpenses() {

    fetch(API)
        .then(res => res.json())
        .then(data => {

            allExpenses = data;

            const table = document.getElementById("expenseTable");

            if (data.length === 0) {

                table.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">
                            No Expenses Found
                        </td>
                    </tr>
                `;

                document.getElementById("totalExpenses").innerHTML = 0;
                document.getElementById("totalAmount").innerHTML = "0.00";

                updateChart([]);

                return;
            }

            let rows = "";
            let total = 0;
            let todayTotal = 0;
            let monthTotal = 0;
            const today =
                new Date().toISOString().split("T")[0];

            const currentMonth =
                today.substring(0,7);

            data.forEach(expense => {

                total += expense.amount;
                if(expense.date === today){

                    todayTotal += expense.amount;

                }

                if(expense.date.startsWith(currentMonth)){

                    monthTotal += expense.amount;

                }
                rows += `
                    <tr>

                        <td>${expense.id}</td>

                        <td>${expense.title}</td>

                        <td><strong>₹${expense.amount.toFixed(2)}</strong></td>

                        <td>${getCategoryBadge(expense.category)}</td>
                        <td>${expense.date}</td>

                        <td>

                            <button
                                class="btn btn-warning btn-sm me-2"
                                onclick="editExpense(${expense.id})">

                                <i class="bi bi-pencil-square"></i>

                            </button>

                            <button
                                class="btn btn-danger btn-sm"
                                onclick="deleteExpense(${expense.id})">

                                <i class="bi bi-trash"></i>

                            </button>

                        </td>

                    </tr>
                `;

            });

            table.innerHTML = rows;

            document.getElementById("totalExpenses").innerHTML = data.length;

            document.getElementById("totalAmount").innerHTML =
                total.toFixed(2);
            document.getElementById("todayAmount").innerHTML =
                todayTotal.toFixed(2);

            document.getElementById("monthAmount").innerHTML =
                monthTotal.toFixed(2);
            updateChart(allExpenses);
            updateMonthlyChart(allExpenses);
            generateInsights(allExpenses);

        });

}

// =========================
// DELETE
// =========================

function deleteExpense(id) {

    if (!confirm("Delete this expense?"))
        return;

    fetch(API + "/" + id, {
        method: "DELETE"
    })
        .then(() => {
            loadExpenses();
        });

}

// =========================
// EDIT
// =========================

function editExpense(id) {

    fetch(API + "/" + id)
        .then(res => res.json())
        .then(expense => {

            document.getElementById("title").value = expense.title;
            document.getElementById("amount").value = expense.amount;
            const categories = [
                "Food",
                "Travel",
                "Shopping",
                "Education",
                "Entertainment"
            ];

            if(categories.includes(expense.category)){

                document.getElementById("category").value =
                    expense.category;

                document.getElementById("customCategoryDiv").style.display = "none";

            }else{

                document.getElementById("category").value = "Other";

                document.getElementById("customCategoryDiv").style.display = "block";

                document.getElementById("customCategory").value =
                    expense.category;

            }            document.getElementById("date").value = expense.date;

            editingId = id;

            document.querySelector(".btn-primary").innerHTML =
                '<i class="bi bi-check-circle"></i> Update';

            showSection(
                "addExpense",
                document.querySelectorAll(".menu li")[1]
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

}

// =========================
// SEARCH
// =========================

function searchExpense() {

    const searchText = document
        .getElementById("search")
        .value
        .toLowerCase();
    console.log("Search:", searchText);
    const selectedMonth =
        document.getElementById("monthFilter").value;

    let filtered = allExpenses;

    // Filter by month
    if(selectedMonth !== ""){
        filtered = filtered.filter(expense =>
            expense.date.startsWith(selectedMonth)
        );
    }

    // Filter by title
    if(searchText !== ""){
        filtered = filtered.filter(expense =>
            expense.title.toLowerCase().includes(searchText)
        );
    }

    displayFilteredExpenses(filtered);

}

// =========================
// CLEAR FORM
// =========================

function clearForm(){

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    document.getElementById("customCategory").value = "";
    document.getElementById("customCategoryDiv").style.display = "none";
}

// =========================
// CATEGORY BADGES
// =========================

function getCategoryBadge(category) {

    const colors = {

        Food: "success",

        Travel: "primary",

        Shopping: "warning",

        Education: "info",

        Entertainment: "danger",

        Other: "secondary"

    };

    return `
        <span class="badge bg-${colors[category] || "secondary"}">
            ${category}
        </span>
    `;

}

// =========================
// PIE CHART
// =========================

function updateChart(expenses) {

    const categoryTotals = {};

    expenses.forEach(expense => {

        if (categoryTotals[expense.category]) {

            categoryTotals[expense.category] += expense.amount;

        } else {

            categoryTotals[expense.category] = expense.amount;

        }

    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document.getElementById("expenseChart");

    expenseChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                backgroundColor: [

                    "#3B82F6",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                    "#6B7280"

                ],

                borderWidth: 2

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}
function filterByMonth(){
    searchExpense();
}
function displayFilteredExpenses(data) {

    const table = document.getElementById("expenseTable");

    let rows = "";
    let total = 0;

    data.forEach(expense => {

        total += expense.amount;

        rows += `
        <tr>

            <td>${expense.id}</td>

            <td>${expense.title}</td>

            <td>₹${expense.amount.toFixed(2)}</td>

            <td>${getCategoryBadge(expense.category)}</td>

            <td>${expense.date}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editExpense(${expense.id})">

                    <i class="bi bi-pencil-square"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteExpense(${expense.id})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>
        `;

    });

    if(data.length===0){

        rows=`
        <tr>
            <td colspan="6" class="text-center">
                No Expenses Found
            </td>
        </tr>
        
        `;
        document.getElementById("todayAmount").innerHTML = "0.00";
        document.getElementById("monthAmount").innerHTML = "0.00";

    }

    table.innerHTML = rows;

    document.getElementById("totalExpenses").innerHTML =
        data.length;

    document.getElementById("totalAmount").innerHTML =
        total.toFixed(2);

    updateChart(allExpenses);
    updateMonthlyChart(allExpenses);
    generateInsights(allExpenses);

}
function updateMonthlyChart(expenses) {

    const monthTotals = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach(expense => {

        const date = new Date(expense.date);

        const key =
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0");

        if (!monthTotals[key]) {
            monthTotals[key] = 0;
        }

        monthTotals[key] += expense.amount;

    });

    const sortedMonths = Object.keys(monthTotals).sort();

    const labels = sortedMonths.map(month => {

        const parts = month.split("-");

        return monthNames[parseInt(parts[1]) - 1];

    });

    const values = sortedMonths.map(month => monthTotals[month]);

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart = new Chart(
        document.getElementById("monthlyChart"),
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Monthly Spending",

                    data: values,

                    borderColor: "#3B82F6",

                    backgroundColor: "rgba(59,130,246,0.15)",

                    fill: true,

                    tension: 0.4,

                    pointRadius: 5,

                    pointBackgroundColor: "#3B82F6"

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        title: {
                            display: true,
                            text: "Amount (₹)"
                        }

                    },

                    x: {

                        title: {
                            display: true,
                            text: "Month"
                        }

                    }

                }

            }

        }

    );

}
function generateInsights(expenses) {

    const container = document.getElementById("insights");

    if (expenses.length === 0) {

        container.innerHTML =
            "<div class='insight-card'>No insights available.</div>";

        return;
    }

    // Highest spending category

    const categoryTotals = {};

    expenses.forEach(exp => {

        categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + exp.amount;

    });

    let highestCategory = "";
    let highestAmount = 0;

    Object.entries(categoryTotals).forEach(([cat, amount]) => {

        if (amount > highestAmount) {

            highestAmount = amount;
            highestCategory = cat;

        }

    });

    // Monthly totals

    const monthTotals = {};

    expenses.forEach(exp => {

        const month = exp.date.substring(0, 7);

        monthTotals[month] =
            (monthTotals[month] || 0) + exp.amount;

    });

    const months = Object.keys(monthTotals).sort();

    let highestMonth = months[0];
    let highestMonthAmount = monthTotals[highestMonth];

    months.forEach(month => {

        if (monthTotals[month] > highestMonthAmount) {

            highestMonth = month;
            highestMonthAmount = monthTotals[month];

        }

    });

    // Most frequent category

    const frequency = {};

    expenses.forEach(exp => {

        frequency[exp.category] =
            (frequency[exp.category] || 0) + 1;

    });

    let frequentCategory = "";
    let maxCount = 0;

    Object.entries(frequency).forEach(([cat, count]) => {

        if (count > maxCount) {

            maxCount = count;
            frequentCategory = cat;

        }

    });

    // Compare last two months

    let compareText = "Not enough monthly data.";

    if (months.length >= 2) {

        const current = monthTotals[months[months.length - 1]];
        const previous = monthTotals[months[months.length - 2]];

        const diff = current - previous;

        if (diff > 0) {

            compareText =
                `📈 Spending increased by ₹${diff.toFixed(2)} compared to last month.`;

        } else if (diff < 0) {

            compareText =
                `📉 Spending decreased by ₹${Math.abs(diff).toFixed(2)} compared to last month.`;

        } else {

            compareText =
                "➡ Spending remained the same as last month.";

        }

    }

    container.innerHTML = `

        <div class="insight-card">
            💰 Highest Spending Category :
            <b>${highestCategory}</b>
            (₹${highestAmount.toFixed(2)})
        </div>

        <div class="insight-card">
            📅 Highest Spending Month :
            <b>${highestMonth}</b>
            (₹${highestMonthAmount.toFixed(2)})
        </div>

        <div class="insight-card">
            🛒 Most Frequent Category :
            <b>${frequentCategory}</b>
            (${maxCount} expenses)
        </div>

        <div class="insight-card">
            ${compareText}
        </div>

    `;
}
function toggleCustomCategory(){

    const category =
        document.getElementById("category").value;

    const customDiv =
        document.getElementById("customCategoryDiv");

    if(category === "Other"){

        customDiv.style.display = "block";

    }else{

        customDiv.style.display = "none";

        document.getElementById("customCategory").value = "";

    }

}