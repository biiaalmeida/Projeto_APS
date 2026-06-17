package com.aromas.perfumaria.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.aromas.perfumaria.entity.*;
import com.aromas.perfumaria.repository.*;
import com.aromas.perfumaria.dto.*;

@Service
public class RelatorioService {

    private final RelatorioRepository repository;
    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final GerenteRepository gerenteRepository;

    public RelatorioService(RelatorioRepository repository, VendaRepository vendaRepository, 
                            ProdutoRepository produtoRepository, GerenteRepository gerenteRepository) {
        this.repository = repository;
        this.vendaRepository = vendaRepository;
        this.produtoRepository = produtoRepository;
        this.gerenteRepository = gerenteRepository;
    }

    public Map<String, Object> gerarRelatorioVendas() {
        List<Venda> vendas = vendaRepository.findAll();
        double totalVendido = vendas.stream().mapToDouble(Venda::getValorTotal).sum();
        long quantidadeVendas = vendas.size();
        double ticketMedio = quantidadeVendas > 0 ? totalVendido / quantidadeVendas : 0.0;

        Map<String, Object> result = new HashMap<>();
        result.put("totalVendido", totalVendido);
        result.put("quantidadeVendas", quantidadeVendas);
        result.put("ticketMedio", ticketMedio);
        return result;
    }

    public Map<String, Object> gerarRelatorioProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        long totalProdutos = produtos.size();
        List<Produto> emPromocao = produtos.stream()
                .filter(p -> p.getPromocao() != null)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("produtosCadastrados", totalProdutos);
        result.put("produtosEmPromocaoCount", emPromocao.size());
        result.put("produtosEmPromocao", emPromocao);
        return result;
    }

    public Relatorio salvarRelatorio(RelatorioRequest request) {
        Relatorio relatorio = new Relatorio();
        relatorio.setTipo(request.getTipo());
        relatorio.setDataInicio(request.getDataInicio());
        relatorio.setDataFim(request.getDataFim());
        relatorio.setGerente(gerenteRepository.findById(request.getGerenteId()).orElse(null));
        return repository.save(relatorio);
    }

    public List<Relatorio> listarTodos() {
        return repository.findAll();
    }
}