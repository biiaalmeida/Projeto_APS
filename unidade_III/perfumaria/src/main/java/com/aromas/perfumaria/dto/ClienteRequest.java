package com.aromas.perfumaria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteRequest {
    @NotBlank
    private String nome;
    
    @NotBlank
    private String cpf;
    
    private String telefone;
    
    @Email
    private String email;
}
