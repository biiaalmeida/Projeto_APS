package com.aromas.perfumaria.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.dto.*;
import com.aromas.perfumaria.service.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/relatorios")
@CrossOrigin(origins = "http://localhost:5173")
public class RelatorioController {
    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @PostMapping
    public Relatorio salvar(@Valid @RequestBody RelatorioRequest request) {
        return service.salvarRelatorio(request);
    }

    @GetMapping
    public List<Relatorio> listar() {
        return service.listarTodos();
    }

    @GetMapping("/vendas")
    public Map<String, Object> gerarRelatorioVendas() {
        return service.gerarRelatorioVendas();
    }

    @GetMapping("/produtos")
    public Map<String, Object> gerarRelatorioProdutos() {
        return service.gerarRelatorioProdutos();
    }
}