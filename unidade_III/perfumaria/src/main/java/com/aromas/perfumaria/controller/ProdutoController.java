package com.aromas.perfumaria.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.dto.*;
import com.aromas.perfumaria.service.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @PostMapping
    public Produto cadastrar(@Valid @RequestBody ProdutoRequest request) {
        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setCategoria(request.getCategoria());
        produto.setMarca(request.getMarca());
        produto.setPreco(request.getPreco());
        produto.setDescricao(request.getDescricao());
        produto.setImagemUrl(request.getImagemUrl());
        return service.cadastrar(produto, request.getAdministradorId(), request.getPromocaoId());
    }

    @GetMapping
    public List<Produto> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Produto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest request) {
        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setCategoria(request.getCategoria());
        produto.setMarca(request.getMarca());
        produto.setPreco(request.getPreco());
        produto.setDescricao(request.getDescricao());
        produto.setImagemUrl(request.getImagemUrl());
        return service.atualizar(id, produto, request.getAdministradorId(), request.getPromocaoId());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
