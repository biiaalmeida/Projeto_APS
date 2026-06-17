package com.aromas.perfumaria.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.aromas.perfumaria.entity.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
