package com.orion.mdd.service;

import com.orion.mdd.dto.response.SubjectResponse;
import java.util.List;

public interface SubjectService {

    List<SubjectResponse> getAllSubjects();
    SubjectResponse getSubjectById(Long subjectId);

    // ✅ MVP endpoints (current user)
    SubjectResponse subscribeMe(String username, Long subjectId);
    SubjectResponse unsubscribeMe(String username, Long subjectId);
    List<SubjectResponse> getMySubscriptions(String username);
}