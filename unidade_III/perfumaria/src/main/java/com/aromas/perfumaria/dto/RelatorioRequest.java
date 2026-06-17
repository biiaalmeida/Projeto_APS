package com.aromas.perfumaria.dto;

import java.util.Date;
import com.aromas.perfumaria.enums.*;
import lombok.Data;

@Data
public class RelatorioRequest {
    private TipoRelatorio tipo;
    private Date dataInicio;
    private Date dataFim;
    private Long gerenteId;
}
