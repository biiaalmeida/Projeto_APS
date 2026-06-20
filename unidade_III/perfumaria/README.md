<img src="https://i0.wp.com/assecom.ufersa.edu.br/wp-content/uploads/sites/24/2014/09/PNG-bras%C3%A3o-Ufersa.png?resize=194%2C300&ssl=1" alt="Logo" align="right" width="140" />

# Perfumary System

Sistema desenvolvido para auxiliar o atendimento, o gerenciamento e as vendas de uma perfumaria.

Este projeto foi desenvolvido para a disciplina de **Análise e Projeto de Sistemas Orientados a Objetos**, ministrada pelo professor **Ferdinandy Chagas**, na Universidade Federal Rural do Semi-Árido (UFERSA).

---

## 📋 Sobre o Projeto

O Perfumary System é uma aplicação web composta por:

- **Backend:** Java + Spring Boot
- **Frontend:** React + TypeScript
- **Banco de Dados:** Supabase (PostgreSQL)

A aplicação tem como objetivo auxiliar o gerenciamento de clientes, produtos, vendas e demais operações relacionadas a uma perfumaria.

---

## 🛠 Tecnologias Utilizadas

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Maven
- PostgreSQL (Supabase)

### Frontend
- React
- TypeScript
- Vite
- Axios

### Banco de Dados
- Supabase
- PostgreSQL

---

## 👥 Integrantes

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/biiaalmeida">
        <img src="https://avatars.githubusercontent.com/u/112524121?v=4" width="120"/><br>
        <sub><b>Ana Beatriz Almeida da Silva</b></sub>
      </a>
    </td>

   <td align="center">
      <a href="https://github.com/Allan-Gabriell">
        <img src="https://avatars.githubusercontent.com/u/123174616?v=4" width="120"/><br>
        <sub><b>Allan Gabriel Silva de Freitas</b></sub>
      </a>
    </td>

   <td align="center">
      <a href="https://github.com/hillaryds">
        <img src="https://avatars.githubusercontent.com/u/143619299?v=4" width="120"/><br>
        <sub><b>Hillary Saldanha Diniz</b></sub>
      </a>
    </td>

   <td align="center">
      <a href="https://github.com/letsticia">
        <img src="https://avatars.githubusercontent.com/u/126128839?v=4" width="120"/><br>
        <sub><b>Letícia Maria Gonçalves de Morais</b></sub>
      </a>
    </td>

   <td align="center">
      <a href="https://github.com/alexrbss">
        <img src="https://avatars.githubusercontent.com/u/143243497?v=4" width="120"/><br>
        <sub><b>Rubens Alexandre de Sousa Ferreira</b></sub>
      </a>
    </td>
  </tr>
</table>

---

# 🚀 Como Executar o Projeto

## Pré-requisitos

Certifique-se de possuir instalado:

- Java 17 ou superior
- Maven 3.8+
- Node.js 18+
- npm
- Git

---

# 🔙 Executando o Backend

### 1. Acesse a pasta do projeto backend

```bash
cd ~/Projeto_APS/unidade_III/perfumaria
```

### 2. Configure o banco de dados Supabase

No arquivo:

```properties
src/main/resources/application.properties
```

Configure as credenciais do banco:

```properties
spring.datasource.url=jdbc:postgresql://SEU_HOST:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 3. Instale as dependências

```bash
mvn clean install
```

---

### 4. Execute a aplicação

```bash
mvn spring-boot:run
```

ou

```bash
./mvnw spring-boot:run
```

---

### 5. Verifique se a API está funcionando

Por padrão:

```text
http://localhost:8080
```

---

# 🎨 Executando o Frontend

### 1. Acesse a pasta do frontend

```bash
cd ~/Projeto_APS/unidade_III/perfumaria/perfumerySystem-main/front-end/prefumary-front
```

---

### 2. Instale as dependências

```bash
npm install
```

---

### 3. Execute o projeto

```bash
npm run dev
```

---

### 4. Acesse a aplicação

O Vite exibirá algo semelhante a:

```text
http://localhost:5173
```

Abra o endereço informado no navegador.

---

# 📂 Estrutura do Projeto

```text
perfumaria/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   │
│   └── test/
│
├── perfumerySystem-main/
│   └── front-end/
│       └── prefumary-front/
│
└── pom.xml
```

---

# 🗄 Banco de Dados

O sistema utiliza o serviço Supabase com PostgreSQL.

Certifique-se de:

- Criar o projeto no Supabase;
- Configurar a URL do banco;
- Configurar usuário e senha corretamente;
- Liberar acesso ao banco para a aplicação.

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Análise e Projeto de Sistemas Orientados a Objetos da UFERSA.