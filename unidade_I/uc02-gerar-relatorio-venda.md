## UC02 - Gerar Relatório de Vendas

### 1. Descrição

É a funcionalidade que permite o Gerente gerar relatórios de vendas por período. O relatório auxilia o acompanhamento das vendas realizadas na perfumaria e apoia a gestão comercial da loja.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

* Primário: Gerente

### 4. Pré-condições

* Gerente precisa estar autenticado no sistema;
* Devem existir vendas registradas no sistema.

### 5. Pós-condições

* Relatório de vendas gerado;
* Informações das vendas do período selecionado visualizadas pelo Gerente.

### 6. Fluxo Principal

#### P2. Gerar Relatório de Vendas

##### P2.1 Gerente acessa a funcionalidade "Relatórios";

##### P2.2 Sistema exibe as opções de relatórios disponíveis;

##### P2.3 Gerente seleciona a opção "Relatório de Vendas por Período";

##### P2.4 Sistema solicita o período desejado;

##### P2.5 Gerente informa o período para consulta;

##### P2.6 Sistema busca as vendas registradas no período informado;

##### P2.7 Sistema gera o relatório de vendas;

##### P2.8 Sistema exibe o relatório para o Gerente;

##### P2.9 Caso de uso finalizado.

### 7. Fluxo Alternativo

#### A1. Período sem vendas registradas

##### A1.1 Sistema identifica que não existem vendas registradas no período informado;

##### A1.2 Sistema exibe a mensagem "Não há vendas registradas para o período selecionado";

##### A1.3 Caso de uso finalizado.

### 8. Fluxo de Exceção

#### Não há fluxos de exceção para este caso de uso.

### 9. Regras de Negócio

#### RN01 - Apenas o Gerente pode gerar relatório de vendas.

#### RN02 - O relatório deve ser gerado com base no período informado.

#### RN03 - O relatório deve considerar apenas vendas registradas no sistema.

#### RN04 - Caso não existam vendas no período, o sistema deve informar ao Gerente.

---

### Histórico

* Data: 15/06/2026 - Versão Inicial - Responsável: Hillary Diniz
