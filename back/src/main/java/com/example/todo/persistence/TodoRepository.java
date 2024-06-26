package com.example.todo.persistence;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.todo.model.TodoEntity;

@Repository
public interface TodoRepository extends JpaRepository<TodoEntity, String> {
    @Query("select t from TodoEntity t where t.userId = ?1")
    List<TodoEntity> findByUserId(String userId);

    List<TodoEntity> findByUserIdAndDone(String userId, boolean done);

    @Query("select t from TodoEntity t where t.userId = ?1")
    Page<TodoEntity> findByUserId(String userId, Pageable pageable);

    // 검색 쿼리 추가
    Page<TodoEntity> findByUserIdAndTitleContaining(String userId, String title, Pageable pageable);
}
