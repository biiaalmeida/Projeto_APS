package com.aromas.perfumaria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProdutoRequest {
    @NotBlank
    private String nome;
    private String categoria;
    private String marca;
    
    @Positive
    private Double preco;
    
    private String descricao;
    private Long administradorId;
    private Long promocaoId;
    private String imagemUrl;
}
