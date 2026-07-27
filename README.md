# 💰 Personal Expense Management System

A full-stack web application built using Spring Boot, MySQL, HTML, CSS, JavaScript, Bootstrap, and Chart.js to help users manage, track, and analyze their daily expenses through an interactive dashboard.

---

## 🚀 Features

- 📊 Dashboard with expense summary (Total Expenses, Total Amount, Today's Spending, Monthly Spending)
- ➕ Add new expenses
- ✏️ Update existing expenses
- 🗑️ Delete expenses
- 🔍 Search expenses by title
- 📅 Filter expenses by month
- 📝 Custom category support
- 🏷️ Category-wise expense management
- 📈 Pie Chart for category-wise expense analysis
- 📉 Monthly Spending Trend (Line Chart)
- 💡 Smart Insights (Highest Spending Category, Highest Spending Month, Most Frequent Category, Monthly Spending Comparison)

---

## 🛠️ Technologies Used

### Backend
- Java
- Spring Boot
- Spring Data JPA (Hibernate)
- Maven

### Database
- MySQL

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- Chart.js

---

## 📂 Project Structure

```text
src
├── main
│   ├── java
│   │   └── org.example.expensetracker
│   │       ├── controller
│   │       ├── model
│   │       ├── repository
│   │       └── service
│   └── resources
│       ├── static
│       │   ├── index.html
│       │   ├── style.css
│       │   └── script.js
│       └── application.properties
```

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Pavithra-K-02/personal-expense-management-system.git
```

2. Open the project in IntelliJ IDEA.

3. Create the MySQL database:

```sql
CREATE DATABASE expense_tracker;
```

4. Configure your MySQL username and password in `src/main/resources/application.properties`.

5. Run `ExpensetrackerApplication.java`.

6. Open your browser and visit:

```text
http://localhost:8081/index.html
```
## Screenshots
<img width="1899" height="940" alt="image" src="https://github.com/user-attachments/assets/63ecad93-9984-4831-b4a5-85ea8140d0a2" />
<img width="1896" height="936" alt="image" src="https://github.com/user-attachments/assets/9df2062d-3ef5-4170-a2a3-d2c8c7af3e9c" />
<img width="1900" height="933" alt="image" src="https://github.com/user-attachments/assets/49375a89-092e-46e5-b941-14e8a184dd3e" />
<img width="1902" height="974" alt="image" src="https://github.com/user-attachments/assets/f0935a4d-48bc-42a5-b24f-544911d16728" />
<img width="1858" height="802" alt="image" src="https://github.com/user-attachments/assets/7e4f321e-70ea-4a96-bef6-f4ef91da6330" />
<img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/4ddf140e-8605-4075-9da4-4dc7eb93c872" />



---

## 🎯 Future Enhancements

- User Authentication
- Export Reports to PDF/Excel
- Budget Planning
- Expense Budget Alerts
- Email Notifications
- Dark Mode
- Mobile Responsive Design

---

## 👩‍💻 Author

**Pavithra K**

- GitHub: https://github.com/Pavithra-K-02

---

## 📄 License

This project was developed as an educational project for learning full-stack web application development using Spring Boot and MySQL.
