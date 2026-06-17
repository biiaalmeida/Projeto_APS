package com.aromas.perfumaria.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.dto.*;
import com.aromas.perfumaria.service.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/vendedores")
public class VendedorController {
    private final VendedorService service;

    public VendedorController(VendedorService service) {
        this.service = service;
    }

    @PostMapping
    public Vendedor cadastrar(@Valid @RequestBody VendedorRequest request) {
        return service.cadastrar(request.getNome(), request.getEmail(), request.getSenha());
    }

    @GetMapping
    public List<Vendedor> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Vendedor buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}/alterar-senha")
    public String alterarSenha(@PathVariable Long id, @RequestBody AlterarSenhaRequest request) {
        service.alterarSenha(id, request.getNovaSenha());
        return "Senha do vendedor alterada com sucesso!";
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
