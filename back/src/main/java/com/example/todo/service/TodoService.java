package com.example.todo.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.todo.model.TodoEntity;
import com.example.todo.persistence.TodoRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TodoService {
    @Autowired
    private TodoRepository repository;

    public List<TodoEntity> create(final TodoEntity entity) {
        validate(entity);
        repository.save(entity);
        return repository.findByUserId(entity.getUserId());
    }

    public Page<TodoEntity> retrieve(final String userId, final int page, final int size, final String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        if (keyword == null || keyword.isEmpty()) {
            return repository.findByUserId(userId, pageable);
        } else {
            return repository.findByUserIdAndTitleContaining(userId, keyword, pageable);
        }
    }

    public List<TodoEntity> update(final TodoEntity entity) {
        validate(entity);
        if (repository.existsById(entity.getId())) {
            repository.save(entity);
        } else {
            throw new RuntimeException("Unknown Id.");
        }
        return repository.findByUserId(entity.getUserId());
    }

    public List<TodoEntity> delete(final TodoEntity entity) {
        if (repository.existsById(entity.getId())) {
            repository.deleteById(entity.getId());
        } else {
            throw new RuntimeException("Id doesn't exist.");
        }
        return repository.findByUserId(entity.getUserId());
    }

    public List<TodoEntity> deleteCompleted(final String userId) {
        List<TodoEntity> userTodos = repository.findByUserId(userId);
        List<TodoEntity> completedTodos = userTodos.stream()
                .filter(TodoEntity::isDone)
                .collect(Collectors.toList());
        repository.deleteAll(completedTodos);
        return repository.findByUserId(userId);
    }

    private void validate(final TodoEntity entity) {
        if (entity == null) {
            log.warn("Entity cannot be null.");
            throw new RuntimeException("Entity cannot be null.");
        }
        if (entity.getUserId() == null) {
            log.warn("Unknown user.");
            throw new RuntimeException("Unknown user.");
        }
    }
}
