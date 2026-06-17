package com.aromas.perfumaria.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.enums.*;
import com.aromas.perfumaria.repository.*;

@Service
public class AdministradorService {
    private final AdministradorRepository repository;

    public AdministradorService(AdministradorRepository repository) {
        this.repository = repository;
    }

    public Administrador cadastrar(String nome, String email, String senha) {
        Administrador admin = new Administrador();
        admin.setNome(nome);
        admin.setEmail(email);
        admin.setSenha(senha);
        admin.setNivelAcesso(NivelAcesso.ADMINISTRADOR);
        return repository.save(admin);
    }

    public List<Administrador> listarTodos() {
        return repository.findAll();
    }

    public Administrador buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Administrador não encontrado"));
    }

    public void alterarSenha(Long id, String novaSenha) {
        Administrador admin = buscarPorId(id);
        admin.setSenha(novaSenha);
        repository.save(admin);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
