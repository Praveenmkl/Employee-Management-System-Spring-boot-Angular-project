package com.employee.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO (Data Transfer Object) for incoming employee requests (POST / PUT).
 *
 * Why DTOs instead of raw Entity?
 *   - Entities are DB models — exposing them directly leaks DB structure
 *   - DTOs let you control exactly what the API accepts
 *   - Validation annotations live here, NOT on the entity
 */
@Getter
@Setter
@NoArgsConstructor
public class EmployeeRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    private String phone;

    private String address;

    private LocalDate dateOfBirth;

    private LocalDate hireDate;

    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be a positive number")
    private BigDecimal salary;

    @NotBlank(message = "Position is required")
    private String position;

    private Long departmentId;   // we accept just the ID, not the full Department object

    private String status;
}
