package com.aromas.perfumaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
}
