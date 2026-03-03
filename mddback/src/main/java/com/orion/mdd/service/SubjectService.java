package com.orion.mdd.service;

import com.orion.mdd.dto.response.SubjectResponse;

import java.util.List;

public interface SubjectService {
    List<SubjectResponse> getAllSubjects();
    SubjectResponse getSubjectById(Long subjectId);
    SubjectResponse subscribeUserToSubject(Long userId, Long subjectId);
    SubjectResponse unsubscribeUserFromSubject(Long userId, Long subjectId);
    List<SubjectResponse> getUserSubscriptions(Long userId);
}