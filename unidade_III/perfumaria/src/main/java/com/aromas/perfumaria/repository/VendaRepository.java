package com.aromas.perfumaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long> {
}
