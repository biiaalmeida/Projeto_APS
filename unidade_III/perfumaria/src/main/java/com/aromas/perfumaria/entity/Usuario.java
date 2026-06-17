package com.aromas.perfumaria.entity;


import com.aromas.perfumaria.enums.*;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    
    @Enumerated(EnumType.STRING)
    private NivelAcesso nivelAcesso;

    public void realizarLogin(String email, String senha) {
        // Implementação básica ou placeholder
    }

    public void alterarSenha(String novaSenha) {
        this.senha = novaSenha;
    }
}
