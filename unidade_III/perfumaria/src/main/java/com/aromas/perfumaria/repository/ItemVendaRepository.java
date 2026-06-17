package com.aromas.perfumaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.ItemVenda;

public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
}
