package com.aromas.perfumaria.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.repository.*;

@Service
public class ProdutoService {
    private final ProdutoRepository repository;
    private final AdministradorRepository administradorRepository;
    private final PromocaoRepository promocaoRepository;

    public ProdutoService(ProdutoRepository repository, AdministradorRepository administradorRepository, PromocaoRepository promocaoRepository) {
        this.repository = repository;
        this.administradorRepository = administradorRepository;
        this.promocaoRepository = promocaoRepository;
    }

    public Produto cadastrar(Produto produto, Long administradorId, Long promocaoId) {
        if (administradorId != null) {
            produto.setAdministrador(administradorRepository.findById(administradorId).orElse(null));
        }
        if (promocaoId != null) {
            produto.setPromocao(promocaoRepository.findById(promocaoId).orElse(null));
        }
        return repository.save(produto);
    }

    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public Produto atualizar(Long id, Produto dadosAtualizados, Long administradorId, Long promocaoId) {
        Produto produto = buscarPorId(id);
        produto.setNome(dadosAtualizados.getNome());
        produto.setCategoria(dadosAtualizados.getCategoria());
        produto.setMarca(dadosAtualizados.getMarca());
        produto.setPreco(dadosAtualizados.getPreco());
        produto.setDescricao(dadosAtualizados.getDescricao());
        
        if (administradorId != null) {
            produto.setAdministrador(administradorRepository.findById(administradorId).orElse(null));
        }
        if (promocaoId != null) {
            produto.setPromocao(promocaoRepository.findById(promocaoId).orElse(null));
        }
        
        return repository.save(produto);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
