package com.orion.mdd.mapper;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.response.CommentResponse;
import com.orion.mdd.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "post", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    Comment toComment(CreateCommentRequest request);

    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "author.username", target = "author")
    CommentResponse toCommentResponse(Comment comment);
}