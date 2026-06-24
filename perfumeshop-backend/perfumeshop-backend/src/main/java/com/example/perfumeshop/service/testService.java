package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.Test;
import com.example.perfumeshop.repository.testRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class testService {
    @Autowired
    private  testRepository testRepository;


    public List<Test> findAll() {
        return testRepository.findAll();
    }

}
