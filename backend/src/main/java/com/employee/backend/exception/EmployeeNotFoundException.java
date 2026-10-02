package com.employee.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when an employee is not found.
 *
 * @ResponseStatus(HttpStatus.NOT_FOUND) → automatically returns HTTP 404
 * when this exception is thrown (without needing GlobalExceptionHandler).
 * We still use GlobalExceptionHandler for a clean JSON response body.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }

    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
