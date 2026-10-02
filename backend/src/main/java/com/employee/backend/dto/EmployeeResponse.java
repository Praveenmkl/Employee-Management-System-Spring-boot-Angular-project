package com.employee.backend.dto;

import com.employee.backend.entity.Employee;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for outgoing employee responses (GET).
 *
 * Why a separate Response DTO?
 *   - You control what data is sent to the client (hide sensitive fields if needed)
 *   - Avoids circular reference issues (Entity → Department → List<Employee> → ...)
 *   - You can shape the response (e.g., flatten departmentName instead of full object)
 */
@Getter
@Setter
@NoArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private LocalDate hireDate;
    private BigDecimal salary;
    private String position;
    private String status;

    // Instead of returning the full Department object, just the name
    private Long departmentId;
    private String departmentName;

    /**
     * Static factory method — converts an Employee entity → EmployeeResponse DTO.
     * This keeps mapping logic in one place.
     */
    public static EmployeeResponse fromEntity(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setPhone(employee.getPhone());
        response.setAddress(employee.getAddress());
        response.setDateOfBirth(employee.getDateOfBirth());
        response.setHireDate(employee.getHireDate());
        response.setSalary(employee.getSalary());
        response.setPosition(employee.getPosition());
        response.setStatus(employee.getStatus());

        // Safely map department (it might be null)
        if (employee.getDepartment() != null) {
            response.setDepartmentId(employee.getDepartment().getId());
            response.setDepartmentName(employee.getDepartment().getName());
        }

        return response;
    }
}
