package com.aromas.perfumaria.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.dto.*;
import com.aromas.perfumaria.service.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/administradores")
public class AdministradorController {
    private final AdministradorService service;

    public AdministradorController(AdministradorService service) {
        this.service = service;
    }

    @PostMapping
    public Administrador cadastrar(@Valid @RequestBody AdministradorRequest request) {
        return service.cadastrar(request.getNome(), request.getEmail(), request.getSenha());
    }

    @GetMapping
    public List<Administrador> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Administrador buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}/alterar-senha")
    public String alterarSenha(@PathVariable Long id, @RequestBody AlterarSenhaRequest request) {
        service.alterarSenha(id, request.getNovaSenha());
        return "Senha do administrador alterada com sucesso!";
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
