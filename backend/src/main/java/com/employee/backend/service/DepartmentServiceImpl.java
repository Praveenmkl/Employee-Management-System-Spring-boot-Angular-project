package com.employee.backend.service;

import com.employee.backend.dto.DepartmentDto;
import com.employee.backend.entity.Department;
import com.employee.backend.exception.ResourceNotFoundException;
import com.employee.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return mapToDto(dept);
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {
        Department dept = new Department();
        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        Department saved = departmentRepository.save(dept);
        return mapToDto(saved);
    }

    @Override
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        Department updated = departmentRepository.save(dept);
        return mapToDto(updated);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        departmentRepository.delete(dept);
    }

    private DepartmentDto mapToDto(Department dept) {
        int count = (dept.getEmployees() != null) ? dept.getEmployees().size() : 0;
        return new DepartmentDto(
                dept.getId(),
                dept.getName(),
                dept.getDescription(),
                count
        );
    }
}
