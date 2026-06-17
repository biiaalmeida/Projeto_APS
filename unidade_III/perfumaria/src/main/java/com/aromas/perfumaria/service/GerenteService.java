package com.aromas.perfumaria.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.enums.*;
import com.aromas.perfumaria.repository.*;
@Service
public class GerenteService {

    private final GerenteRepository gerenteRepository;
    private final PromocaoService promocaoService;

    public GerenteService(GerenteRepository gerenteRepository, PromocaoService promocaoService) {
        this.gerenteRepository = gerenteRepository;
        this.promocaoService = promocaoService;
    }

    public List<Gerente> listarTodos() {
        return gerenteRepository.findAll();
    }

    public Gerente buscarPorId(Long id) {
        return gerenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));
    }

    public void cadastrarGerente(String nome, String email, String senha) {
        Gerente gerente = new Gerente();
        gerente.setNome(nome);
        gerente.setEmail(email);
        gerente.setSenha(senha);
        gerente.setNivelAcesso(NivelAcesso.GERENTE);

        gerenteRepository.save(gerente);
    }

    public void alterarSenhaGerente(Long id, String novaSenha) {
        Gerente gerente = buscarPorId(id);
        gerente.setSenha(novaSenha);

        gerenteRepository.save(gerente);
    }

    public void excluirGerente(Long id) {
        gerenteRepository.deleteById(id);
    }

    public Gerente cadastrarPromocao(
            Long gerenteId,
            String nome,
            double desconto,
            Date dataInicio,
            Date dataFim) {

        Gerente gerente = buscarPorId(gerenteId);

        if (gerente.getPromocoes() == null) {
            gerente.setPromocoes(new ArrayList<>());
        }

        Promocao promocao = promocaoService.criarPromocao(
                nome,
                desconto,
                dataInicio,
                dataFim
        );

        gerente.getPromocoes().add(promocao);

        return gerenteRepository.save(gerente);
    }

    public Gerente atualizarPromocao(
            Long promocaoId,
            String nome,
            double desconto,
            Date dataInicio,
            Date dataFim) {

        promocaoService.atualizar(
                promocaoId,
                nome,
                desconto,
                dataInicio,
                dataFim
        );

        return null;
    }

    public Gerente deletarPromocao(Long gerenteId, Long promocaoId) {
        Gerente gerente = buscarPorId(gerenteId);

        Promocao promocao = gerente.getPromocoes()
                .stream()
                .filter(p -> p.getId().equals(promocaoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Promoção não encontrada"));

        gerente.getPromocoes().remove(promocao);
        promocaoService.excluirPromocao(promocaoId);

        return gerenteRepository.save(gerente);
    }
}