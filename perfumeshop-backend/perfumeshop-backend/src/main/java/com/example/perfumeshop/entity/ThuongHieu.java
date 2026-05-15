package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Thuong_Hieu")
@Data
public class ThuongHieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_thuong_hieu")
    private Integer idThuongHieu;

    @Column(name = "ten_thuong_hieu", nullable = false, unique = true)
    private String tenThuongHieu;
}
