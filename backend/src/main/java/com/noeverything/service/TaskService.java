package com.noeverything.service;

import com.noeverything.dto.TaskRequest;
import com.noeverything.dto.TaskResponse;
import com.noeverything.entity.Task;
import com.noeverything.entity.User;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final AuthService authService;

    public TaskService(TaskRepository taskRepository, AuthService authService) {
        this.taskRepository = taskRepository;
        this.authService = authService;
    }

    public List<TaskResponse> getTasksForCurrentUser(Boolean completed, String priority, String category) {
        User user = authService.getCurrentAuthenticatedUser();
        List<Task> tasks = taskRepository.findByUserOrderByDueDateAscCreatedAtDesc(user);

        return tasks.stream()
                .filter(t -> completed == null || t.isCompleted() == completed)
                .filter(t -> priority == null || priority.equalsIgnoreCase("ALL") || t.getPriority().equalsIgnoreCase(priority))
                .filter(t -> category == null || category.equalsIgnoreCase("ALL") || t.getCategory().equalsIgnoreCase(category))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Task task = new Task(
                user,
                request.getTitle().trim(),
                request.getDescription(),
                request.getPriority(),
                request.getCategory(),
                request.getDueDate() != null ? request.getDueDate() : LocalDate.now(),
                request.getEstimatedMinutes()
        );
        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Transactional
    public TaskResponse toggleComplete(Long taskId) {
        User user = authService.getCurrentAuthenticatedUser();
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setCompleted(!task.isCompleted());
        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (request.getTitle() != null) task.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getCategory() != null) task.setCategory(request.getCategory());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getEstimatedMinutes() != null) task.setEstimatedMinutes(request.getEstimatedMinutes());

        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        User user = authService.getCurrentAuthenticatedUser();
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }

    public TaskResponse mapToResponse(Task task) {
        TaskResponse res = new TaskResponse();
        res.setId(task.getId());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setPriority(task.getPriority());
        res.setCategory(task.getCategory());
        res.setDueDate(task.getDueDate());
        res.setCompleted(task.isCompleted());
        res.setCompletedAt(task.getCompletedAt());
        res.setEstimatedMinutes(task.getEstimatedMinutes());
        res.setCreatedAt(task.getCreatedAt());
        return res;
    }
}
