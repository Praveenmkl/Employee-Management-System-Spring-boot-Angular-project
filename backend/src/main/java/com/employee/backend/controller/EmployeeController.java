package com.employee.backend.controller;

import com.employee.backend.dto.EmployeeRequest;
import com.employee.backend.dto.EmployeeResponse;
import com.employee.backend.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller — handles all HTTP requests for /api/employees.
 *
 * @RestController  = @Controller + @ResponseBody (auto-converts return values to JSON)
 * @RequestMapping  = base URL prefix for all methods in this class
 * @CrossOrigin     = allows Angular (localhost:4200) to call this API
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // ── GET /api/employees ────────────────────────────────────────────────────
    // Returns all employees — HTTP 200 OK
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        List<EmployeeResponse> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);                    // 200 OK
    }

    // ── GET /api/employees/{id} ───────────────────────────────────────────────
    // Returns one employee — HTTP 200 OK, or 404 if not found
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);                     // 200 OK
    }

    // ── POST /api/employees ───────────────────────────────────────────────────
    // Creates a new employee — HTTP 201 CREATED
    // @Valid triggers Bean Validation on EmployeeRequest fields
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);  // 201 CREATED
    }

    // ── PUT /api/employees/{id} ───────────────────────────────────────────────
    // Updates an existing employee — HTTP 200 OK, or 404 if not found
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(updated);                      // 200 OK
    }

    // ── DELETE /api/employees/{id} ────────────────────────────────────────────
    // Deletes an employee — HTTP 204 NO CONTENT, or 404 if not found
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();              // 204 NO CONTENT
    }
}
