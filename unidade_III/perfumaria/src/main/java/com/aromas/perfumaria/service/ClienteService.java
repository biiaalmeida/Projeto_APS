package com.aromas.perfumaria.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.repository.*;;

@Service
public class ClienteService {
    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public Cliente cadastrar(Cliente cliente) {
        return repository.save(cliente);
    }

    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
