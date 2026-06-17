package com.aromas.perfumaria.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.Relatorio;

public interface RelatorioRepository extends JpaRepository<Relatorio, Long> {
}
