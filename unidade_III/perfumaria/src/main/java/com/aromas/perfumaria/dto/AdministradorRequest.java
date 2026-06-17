package com.aromas.perfumaria.dto;

import lombok.Data;

@Data
public class AdministradorRequest {
    private String nome;
    private String email;
    private String senha;
}
