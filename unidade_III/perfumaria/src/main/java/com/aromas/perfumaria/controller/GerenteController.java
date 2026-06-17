package com.aromas.perfumaria.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.aromas.perfumaria.dto.*;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.service.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/gerentes")
@CrossOrigin(origins = "http://localhost:5173")
public class GerenteController {

    private final GerenteService gerenteService;

    public GerenteController(GerenteService gerenteService) {
        this.gerenteService = gerenteService;
    }

    @GetMapping
    public List<Gerente> listar() {
        return gerenteService.listarTodos();
    }

    @GetMapping("/{id}")
    public Gerente buscar(@PathVariable Long id) {
        return gerenteService.buscarPorId(id);
    }

    @PostMapping("/cadastrar-gerente")
    public String cadastrarGerente(@Valid @RequestBody GerenteRequest request) {
        gerenteService.cadastrarGerente(
                request.getNome(),
                request.getEmail(),
                request.getSenha()
        );

        return "Gerente cadastrado com sucesso!";
    }

    @PostMapping("/{id}/promocoes")
    public Gerente cadastrarPromocao(
            @PathVariable Long id,
            @Valid @RequestBody PromocaoRequest request) {

        return gerenteService.cadastrarPromocao(
                id,
                request.getNome(),
                request.getDesconto(),
                request.getDataInicio(),
                request.getDataFim()
        );
    }

    @PutMapping("/{id}/alterar-senha")
    public String alterarSenhaGerente(
            @PathVariable Long id,
            @RequestBody AlterarSenhaRequest request) {

        gerenteService.alterarSenhaGerente(id, request.getNovaSenha());

        return "Senha alterada com sucesso!";
    }

    @PutMapping("/{gerenteId}/promocoes/{promocaoId}")
    public Gerente atualizarPromocao(
            @PathVariable Long gerenteId,
            @PathVariable Long promocaoId,
            @Valid @RequestBody PromocaoRequest request) {

        gerenteService.atualizarPromocao(
                promocaoId,
                request.getNome(),
                request.getDesconto(),
                request.getDataInicio(),
                request.getDataFim()
        );

        return gerenteService.buscarPorId(gerenteId);
    }

    @DeleteMapping("/{id}/deletar")
    public String excluirGerente(@PathVariable Long id) {
        gerenteService.excluirGerente(id);
        return "Gerente excluído com sucesso!";
    }

    @DeleteMapping("/{gerenteId}/promocoes/{promocaoId}")
    public String deletarPromocao(
            @PathVariable Long gerenteId,
            @PathVariable Long promocaoId) {

        gerenteService.deletarPromocao(gerenteId, promocaoId);

        return "Promoção deletada com sucesso!";
    }
}