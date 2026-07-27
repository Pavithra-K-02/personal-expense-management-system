package org.example.expensetracker.controller;

import org.example.expensetracker.model.Expense;
import org.example.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/expense")
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    @GetMapping("/expense")
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }
    @DeleteMapping("/expense/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return "Expense deleted successfully!";
    }
    @GetMapping("/expense/{id}")
    public Optional<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }
    @PutMapping("/expense/{id}")
    public Expense updateExpense(@PathVariable Long id,
                                 @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Expense Tracker!";
    }
}