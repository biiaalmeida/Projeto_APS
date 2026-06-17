package com.aromas.perfumaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aromas.perfumaria.entity.Promocao;

public interface PromocaoRepository extends JpaRepository<Promocao, Long> {

}