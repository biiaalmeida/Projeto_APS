package com.aromas.perfumaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
