package com.employee.backend.service;

import com.employee.backend.dto.EmployeeRequest;
import com.employee.backend.dto.EmployeeResponse;
import com.employee.backend.entity.Department;
import com.employee.backend.entity.Employee;
import com.employee.backend.exception.EmployeeNotFoundException;
import com.employee.backend.repository.DepartmentRepository;
import com.employee.backend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        Employee employee = mapToEntity(request);
        Employee saved = employeeRepository.save(employee);
        return EmployeeResponse.fromEntity(saved);
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(EmployeeResponse::fromEntity)   // method reference — same as e -> EmployeeResponse.fromEntity(e)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = findEmployeeOrThrow(id);
        return EmployeeResponse.fromEntity(employee);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee existing = findEmployeeOrThrow(id);

        // Update fields from the request
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setAddress(request.getAddress());
        existing.setDateOfBirth(request.getDateOfBirth());
        existing.setHireDate(request.getHireDate());
        existing.setSalary(request.getSalary());
        existing.setPosition(request.getPosition());
        existing.setStatus(request.getStatus());

        // Update department if departmentId is provided
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + request.getDepartmentId()));
            existing.setDepartment(department);
        } else {
            existing.setDepartment(null);
        }

        Employee updated = employeeRepository.save(existing);
        return EmployeeResponse.fromEntity(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        findEmployeeOrThrow(id); // ensures 404 if not found
        employeeRepository.deleteById(id);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Finds an employee by ID or throws EmployeeNotFoundException (→ HTTP 404).
     */
    private Employee findEmployeeOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    /**
     * Maps an EmployeeRequest DTO → Employee entity.
     */
    private Employee mapToEntity(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setHireDate(request.getHireDate());
        employee.setSalary(request.getSalary());
        employee.setPosition(request.getPosition());
        employee.setStatus(request.getStatus());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + request.getDepartmentId()));
            employee.setDepartment(department);
        }

        return employee;
    }
}
