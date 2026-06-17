package com.aromas.perfumaria.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Administrador extends Usuario {

    @OneToMany(mappedBy = "administrador")
    @JsonIgnore
    private List<Produto> produtos;

    public void gerenciarUsuarios() {
        // Implementação
    }

    public void cadastrarProdutos() {
        // Implementação
    }
}
