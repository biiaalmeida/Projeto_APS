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
@Table(name = "vendedor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vendedor extends Usuario {

    @OneToMany(mappedBy = "vendedor")
    @JsonIgnore
    private List<Venda> vendas;

    public void registrarVenda() {
        // Implementação
    }

    public void cadastrarCliente() {
        // Implementação
    }

    public void consultarProdutos() {
        // Implementação
    }
}
