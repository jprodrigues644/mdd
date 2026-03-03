package com.orion.mdd.mapper;

import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.model.Subject;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubjectMapper {

    SubjectResponse toSubjectResponse(Subject subject);
}
