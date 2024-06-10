package com.example.todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.model.TodoEntity;
import com.example.todo.persistence.TodoRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TodoService {
	@Autowired
	private TodoRepository repository;
	
	public List<TodoEntity>create(final TodoEntity entity){
		//Validations
		validate(entity);
		repository.save(entity);
		return repository.findByUserId(entity.getUserId());
	}
	public List<TodoEntity>retrieve(final String userId){
		return repository.findByUserId(userId);
	}
	
	public List<TodoEntity>update(final TodoEntity entity){
		//validation
		validate(entity);
		if(repository.existsById(entity.getId())) {
			repository.save(entity);
		}
		else {
			throw new RuntimeException("Unknown Id.");
		}
		return repository.findByUserId(entity.getUserId());
	}
	
	public List<TodoEntity> delete(final TodoEntity entity) {
		if(repository.existsById(entity.getId())) {
			repository.deleteById(entity.getId());
		}
		else {
			throw new RuntimeException("id doesnt exist.");
		}
		
		return repository.findByUserId(entity.getUserId());
	}
	
	public List<TodoEntity> deleteCompleted(String userId) {
        List<TodoEntity> entities = repository.findByUserIdAndDone(userId, true);
        repository.deleteAll(entities);
        return entities;
    }
	
	private void validate(final TodoEntity entity) {
		if(entity==null) {
			log.warn("Entity cannot be null.");
			throw new RuntimeException("Entity cannot be null.");
		}
		if(entity.getUserId()==null) {
			log.warn("Unknown user.");
			throw new RuntimeException("Unknown user.");
		}
	}
	
}
