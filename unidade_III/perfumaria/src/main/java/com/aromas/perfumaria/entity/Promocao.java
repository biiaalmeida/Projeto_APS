package com.aromas.perfumaria.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "promocao")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Promocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private double desconto;
    private Date dataInicio;
    private Date dataFim;

    @OneToMany(mappedBy = "promocao")
    @JsonIgnore
    private List<Produto> produtos;

    public Promocao(String nome, double desconto, Date dataInicio, Date dataFim) {
        this.nome = nome;
        this.desconto = desconto;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }       
}
