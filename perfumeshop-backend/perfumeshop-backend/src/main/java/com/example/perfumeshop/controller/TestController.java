package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.Test;
import com.example.perfumeshop.service.testService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {
    @Autowired
    private testService testService;

    @GetMapping("/all")
    public List<Test> findAll() {
        return testService.findAll();
    }
}
