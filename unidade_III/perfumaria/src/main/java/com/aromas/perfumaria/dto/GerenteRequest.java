package com.aromas.perfumaria.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GerenteRequest {

    private String nome;
    private String email;
    private String senha;
}