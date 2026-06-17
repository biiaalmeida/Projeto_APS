package com.aromas.perfumaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.Vendedor;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
}
