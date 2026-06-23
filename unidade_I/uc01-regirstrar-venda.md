## UC01 - Registrar Venda

### 1. Descrição

É a funcionalidade que permite o Vendedor registrar uma venda no sistema. O Vendedor informa os produtos vendidos, associa a venda ao cliente quando necessário e o sistema calcula o valor final da compra. Durante o registro da venda, o Vendedor pode aplicar descontos ou promoções autorizadas.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

* Primário: Vendedor

### 4. Pré-condições

* Vendedor precisa estar autenticado no sistema;
* Produto cadastrado no sistema;
* Cliente cadastrado no sistema, caso a venda seja associada a um cliente;
* Promoção cadastrada no sistema, caso seja aplicada na venda.

### 5. Pós-condições

* Venda registrada no sistema;
* Valor final da compra calculado;
* Promoção aplicada, caso selecionada.

### 6. Fluxo Principal

#### P1. Registrar Venda

##### P1.1 Vendedor acessa a funcionalidade "Registrar Venda";

##### P1.2 Sistema exibe a tela de registro de venda;

##### P1.3 Vendedor seleciona os produtos vendidos;

##### P1.4 Sistema exibe os produtos selecionados e seus respectivos valores;

##### P1.5 Vendedor informa o cliente, caso necessário; A1

##### P1.6 Sistema calcula o valor final da compra;

##### P1.7 Vendedor confirma o registro da venda;

##### P1.8 Sistema exibe a mensagem "Venda registrada com sucesso!";

##### P1.9 Caso de uso finalizado.

### 7. Fluxo Alternativo

#### A1. Cliente deseja cancelar venda

##### A1.1 Vendedor clica em voltar;

##### A1.2 Sistema retorna ao menu principal;


### 8. Fluxo de Exceção

#### Não há fluxos de exceção para este caso de uso.

### 9. Regras de Negócio

#### RN01 - Uma venda deve ser registrada por um vendedor autenticado.

#### RN02 - Uma venda deve possuir ao menos um produto cadastrado.

#### RN03 - Uma promoção só pode ser aplicada se estiver cadastrada no sistema.

#### RN04 - O sistema deve calcular o valor final da compra considerando os produtos selecionados e a promoção aplicada, quando houver.

---

### Histórico

* Data: 15/06/2026 - Versão Inicial - Responsável: Hillary Diniz
