package com.orion.mdd.service.impl;

import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.mapper.SubjectMapper;
import com.orion.mdd.model.Subject;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.SubjectRepository;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SubjectMapper subjectMapper;

    public SubjectServiceImpl(SubjectRepository subjectRepository, UserRepository userRepository,
        SubjectMapper subjectMapper) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.subjectMapper = subjectMapper;
    }

    @Override
    public List<SubjectResponse> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return subjects.stream()
                .map(subjectMapper::toSubjectResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectResponse getSubjectById(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return subjectMapper.toSubjectResponse(subject);
    }

    @Override
    public SubjectResponse subscribeUserToSubject(Long userId, Long subjectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        user.getSubscriptions().add(subject);
        userRepository.save(user);

        return subjectMapper.toSubjectResponse(subject);
    }

    @Override
    public SubjectResponse unsubscribeUserFromSubject(Long userId, Long subjectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        user.getSubscriptions().remove(subject);
        userRepository.save(user);

        return subjectMapper.toSubjectResponse(subject);
    }

    @Override
    public List<SubjectResponse> getUserSubscriptions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Subject> subscriptions = user.getSubscriptions();
        return subscriptions.stream()
                .map(subjectMapper::toSubjectResponse)
                .collect(Collectors.toList());
    }
}
