package com.aromas.perfumaria.dto;

import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VendaRequest {
    @NotNull
    private Long clienteId;
    
    @NotNull
    private Long vendedorId;
    
    @NotEmpty
    private List<ItemVendaRequest> itens;
}
