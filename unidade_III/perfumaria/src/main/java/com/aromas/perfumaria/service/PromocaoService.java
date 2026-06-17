package com.aromas.perfumaria.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.repository.*;

@Service
public class PromocaoService {

    private final PromocaoRepository repository;

    public PromocaoService(PromocaoRepository repository) {
        this.repository = repository;
    }

    public Promocao criarPromocao(String nome, double desconto, Date dataInicio, Date dataFim) {
        Promocao promocao = new Promocao(nome, desconto, dataInicio, dataFim);
        return repository.save(promocao);
    }

    public Promocao atualizar(Long id, String nome, double desconto, Date dataInicio, Date dataFim) {
        Promocao promocao = buscarPromocao(id);
        if (promocao == null) throw new RuntimeException("Promoção não encontrada");
        promocao.setNome(nome);
        promocao.setDesconto(desconto);
        promocao.setDataInicio(dataInicio);
        promocao.setDataFim(dataFim);
        return repository.save(promocao);
    }

    public void excluirPromocao(Long id) {
        repository.deleteById(id);
    }

    public Promocao buscarPromocao(Long id) {
        return repository.findById(id).orElse(null);
    }
}
