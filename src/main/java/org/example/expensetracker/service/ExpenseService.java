package org.example.expensetracker.service;

import org.example.expensetracker.model.Expense;
import org.example.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // Save Expense
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // Get All Expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Delete Expense
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    // Get Expense By Id
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    // Update Expense
    public Expense updateExpense(Long id, Expense updatedExpense) {

        Expense expense = expenseRepository.findById(id).orElseThrow();

        expense.setTitle(updatedExpense.getTitle());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());

        // New Line
        expense.setDate(updatedExpense.getDate());

        return expenseRepository.save(expense);
    }

}