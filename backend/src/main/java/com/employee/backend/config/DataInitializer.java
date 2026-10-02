package com.employee.backend.config;

import com.employee.backend.entity.Department;
import com.employee.backend.entity.Employee;
import com.employee.backend.repository.DepartmentRepository;
import com.employee.backend.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DataInitializer(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            Department eng = new Department(null, "Engineering", "Software development, architecture, and tech infrastructure", null);
            Department hr  = new Department(null, "Human Resources", "People ops, talent acquisition, and employee relations", null);
            Department fin = new Department(null, "Finance & Accounting", "Financial planning, accounting, and payroll management", null);
            Department mkt = new Department(null, "Marketing & Growth", "Brand strategy, digital marketing, and public relations", null);
            Department sales = new Department(null, "Sales & BD", "Revenue generation, client relations, and partnerships", null);
            Department ops = new Department(null, "Operations", "Product management, process optimization, and quality control", null);

            List<Department> savedDepts = departmentRepository.saveAll(Arrays.asList(eng, hr, fin, mkt, sales, ops));

            if (employeeRepository.count() == 0) {
                Employee e1 = new Employee(null, "Arjun", "Kumar", "arjun.kumar@example.com", "9876543210", "Chennai, India",
                        LocalDate.of(1995, 5, 12), LocalDate.of(2022, 3, 1), new BigDecimal("85000"), "Senior Full-Stack Engineer", savedDepts.get(0), "ACTIVE");

                Employee e2 = new Employee(null, "Priya", "Sharma", "priya.sharma@example.com", "9876543211", "Bangalore, India",
                        LocalDate.of(1993, 8, 24), LocalDate.of(2021, 6, 15), new BigDecimal("92000"), "HR Lead & Talent Ops", savedDepts.get(1), "ACTIVE");

                Employee e3 = new Employee(null, "Rahul", "Verma", "rahul.verma@example.com", "9876543212", "Mumbai, India",
                        LocalDate.of(1990, 11, 30), LocalDate.of(2020, 1, 10), new BigDecimal("105000"), "Financial Controller", savedDepts.get(2), "ACTIVE");

                Employee e4 = new Employee(null, "Ananya", "Rao", "ananya.rao@example.com", "9876543213", "Hyderabad, India",
                        LocalDate.of(1996, 2, 18), LocalDate.of(2023, 2, 1), new BigDecimal("78000"), "Marketing Specialist", savedDepts.get(3), "ACTIVE");

                Employee e5 = new Employee(null, "Vikram", "Singh", "vikram.singh@example.com", "9876543214", "Delhi, India",
                        LocalDate.of(1992, 9, 5), LocalDate.of(2019, 11, 20), new BigDecimal("110000"), "VP of Business Development", savedDepts.get(4), "ACTIVE");

                employeeRepository.saveAll(Arrays.asList(e1, e2, e3, e4, e5));
            }
        }
    }
}
