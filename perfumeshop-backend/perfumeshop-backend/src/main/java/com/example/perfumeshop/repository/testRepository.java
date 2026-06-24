package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface testRepository extends JpaRepository<Test, Integer> {
}
