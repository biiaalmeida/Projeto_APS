package com.aromas.perfumaria.entity;


import java.util.Date;
import com.system.perfumary.enums.TipoRelatorio;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "relatorio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Relatorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoRelatorio tipo;

    private Date dataInicio;
    private Date dataFim;

    @ManyToOne
    @JoinColumn(name = "gerente_id")
    private Gerente gerente;

    public void gerarRelatorioVendas() {
        // Implementação
    }

    public void gerarRelatorioProdutos() {
        // Implementação
    }
}
