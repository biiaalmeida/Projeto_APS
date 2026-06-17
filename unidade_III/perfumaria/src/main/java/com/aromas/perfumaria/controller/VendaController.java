package com.aromas.perfumaria.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.dto.*;
import com.aromas.perfumaria.service.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/vendas")
public class VendaController {
    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    @PostMapping
    public Venda registrar(@Valid @RequestBody VendaRequest request) {
        return service.registrarVenda(request);
    }

    @GetMapping
    public List<Venda> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Venda buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Venda atualizar(@PathVariable Long id, @Valid @RequestBody VendaRequest request) {
        return service.atualizarVenda(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
