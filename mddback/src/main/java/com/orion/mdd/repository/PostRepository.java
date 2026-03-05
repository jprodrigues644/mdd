package com.orion.mdd.repository;

import com.orion.mdd.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findBySubjectIdOrderByCreationDateDesc(Long subjectId);
    List<Post> findByAuthorIdOrderByCreationDateDesc(Long authorId);
    List<Post> findByOrderByCreationDateDesc();

     @Query("""
        SELECT p
        FROM Post p
        WHERE p.subject.id IN (
            SELECT s.id
            FROM User u
            JOIN u.subscriptions s
            WHERE u.username = :username
        )
        ORDER BY p.creationDate DESC
    """)
    List<Post> findFeedByUsername(@Param("username") String username);
}
