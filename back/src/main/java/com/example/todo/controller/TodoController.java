package com.example.todo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.dto.ResponseDTO;
import com.example.todo.dto.TodoDTO;
import com.example.todo.model.TodoEntity;
import com.example.todo.service.TodoService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("todo")
public class TodoController {
	@Autowired
	private TodoService service;
	
	@PostMapping
	public ResponseEntity<?>createTodo(@AuthenticationPrincipal String userId,@RequestBody TodoDTO dto){
		try {
			/* POST localhost:8080/todo
			 * {
			 * "title":"My first todo",
			 * "done":false
			 * }
			 */
			TodoEntity entity=TodoDTO.toEntity(dto);
			entity.setId(null);
			entity.setUserId(userId);
			List<TodoEntity>entities=service.create(entity);
			List<TodoDTO>dtos=entities.stream().map(TodoDTO::new).collect(Collectors.toList());
			log.info("Log:entities=>dtos ok!");
			/*{
			 * "error":null,
			 * "data":[
			 * {
			 * "id":"402809817ed71ddf017ed71dfe720000",
			 * "title":"My first todo",
			 * "done":false
			 * }
			 * }
			 */
			ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().data(dtos).build();
			log.info("Log:responsedto ok!");
			
			return ResponseEntity.ok().body(response);
		}catch(Exception e) {
			String error=e.getMessage();
			ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().error(error).build();
			return ResponseEntity.badRequest().body(response);
		}
	}
	
	@GetMapping
	public ResponseEntity<?>retrieveTodo(@AuthenticationPrincipal String userId){
		List<TodoEntity>entities=service.retrieve(userId);
		List<TodoDTO>dtos=entities.stream().map(TodoDTO::new).collect(Collectors.toList());
		ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().data(dtos).build();
		
		return ResponseEntity.ok().body(response);
	}
	
	@PutMapping
	public ResponseEntity<?>updateTodo(@AuthenticationPrincipal String userId, @RequestBody TodoDTO dto){
		try {
			TodoEntity entity=TodoDTO.toEntity(dto);
			entity.setUserId(userId);
			List<TodoEntity>entities=service.update(entity);
			List<TodoDTO>dtos=entities.stream().map(TodoDTO::new).collect(Collectors.toList());
			ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().data(dtos).build();
			
			return ResponseEntity.ok().body(response);
		}catch(Exception e) {
			String error=e.getMessage();
			ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().error(error).build();
			return ResponseEntity.badRequest().body(response);
		}
	}
	@DeleteMapping
	public ResponseEntity<?>deleteTodo(@AuthenticationPrincipal String userId, @RequestBody TodoDTO dto){
		try {
			TodoEntity entity=TodoDTO.toEntity(dto);
			entity.setUserId(userId);
			List<TodoEntity>entities=service.delete(entity);
			List<TodoDTO>dtos=entities.stream().map(TodoDTO::new).collect(Collectors.toList());
			ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().data(dtos).build();
			return ResponseEntity.ok().body(response);
		}catch(Exception e) {
			String error=e.getMessage();
			ResponseDTO<TodoDTO>response=ResponseDTO.<TodoDTO>builder().error(error).build();
			return ResponseEntity.badRequest().body(response);
		}
	}
	// 완료된 Todo 일괄 삭제를 위한 새로운 엔드포인트
		@DeleteMapping("/completed")
		public ResponseEntity<?> deleteCompletedTodos(@AuthenticationPrincipal String userId) {
			try {
				List<TodoEntity> deletedEntities = service.deleteCompleted(userId);
				List<TodoDTO> dtos = deletedEntities.stream().map(TodoDTO::new).collect(Collectors.toList());
				ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();
				return ResponseEntity.ok().body(response);
			} catch (Exception e) {
				String error = e.getMessage();
				ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().error(error).build();
				return ResponseEntity.badRequest().body(response);
			}
		}
}
