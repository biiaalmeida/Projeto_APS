package com.aromas.perfumaria.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromocaoRequest {
    private String nome;
    private double desconto;
    private Date dataInicio;
    private Date dataFim;
}
