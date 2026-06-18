import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type ClienteForm = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

export default function CadastroCliente() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ClienteForm>({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limparFormulario() {
    setForm({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
    });
  }

  function limparCPF(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  function limparTelefone(telefone: string) {
    return telefone.replace(/\D/g, "");
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome || !form.cpf || !form.telefone || !form.email) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErro("Informe um e-mail com formato válido (ex: cliente@email.com).");
      setMensagem("");
      return;
    }

    if (limparCPF(form.cpf).length !== 11) {
      setErro("Informe um CPF válido com 11 números.");
      setMensagem("");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const clienteRequest = {
        nome: form.nome,
        cpf: limparCPF(form.cpf),
        telefone: limparTelefone(form.telefone),
        email: form.email,
      };

      const response = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteRequest),
      });

      if (!response.ok) {
        const respostaErro = await response.text();
        throw new Error(respostaErro || "Erro ao cadastrar cliente.");
      }

      setMensagem(`Cliente "${form.nome}" cadastrado com sucesso!`);
      limparFormulario();
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar o cliente. Verifique se o back-end está rodando e se a rota POST /clientes existe."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.brandArea}>
            <div style={styles.logo}>C</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Gold</h1>
              <p style={styles.brandSubtitle}>clientes & atendimento</p>
            </div>
          </div>

          <div>
            <span style={styles.tag}>Cadastro de cliente</span>

            <h2 style={styles.heroTitle}>
              Registre clientes para vincular vendas e acompanhar o histórico.
            </h2>

            
          </div>

         
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Novo cliente</h2>
              <p style={styles.formSubtitle}>
                Preencha as informações principais para registrar o cliente.
              </p>
            </div>

            <button
              type="button"
              style={styles.navBtn}
              onClick={() => navigate("/dashboard")}
            >
              ← Voltar
            </button>
          </div>

          {erro && <div style={styles.errorBox}>{erro}</div>}
          {mensagem && <div style={styles.successBox}>{mensagem}</div>}

          <label style={styles.label}>Nome completo</label>
          <input
            style={styles.input}
            name="nome"
            placeholder="Ex: Maria Silva"
            value={form.nome}
            onChange={handleChange}
          />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>CPF</label>
              <input
                style={styles.input}
                name="cpf"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Telefone</label>
              <input
                style={styles.input}
                name="telefone"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={styles.label}>E-mail</label>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="cliente@email.com"
            value={form.email}
            onChange={handleChange}
          />

          <div style={styles.previewCard}>
            <span style={styles.previewLabel}>Prévia do cliente</span>

            <div style={styles.previewContent}>
              <div style={styles.avatar}>
                {form.nome ? form.nome.charAt(0).toUpperCase() : "C"}
              </div>

              <div>
                <strong style={styles.previewTitle}>
                  {form.nome || "Nome do cliente"}
                </strong>

                <p style={styles.previewText}>
                  {form.email || "cliente@email.com"}
                </p>

                <p style={styles.previewText}>
                  {form.telefone || "(00) 00000-0000"}
                </p>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => navigate("/vendas/registrar")}
            >
              Ir para vendas
            </button>

            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar cliente"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 8%, rgba(212,175,55,0.26), transparent 30%), radial-gradient(circle at 90% 88%, rgba(255,255,255,0.88), transparent 30%), linear-gradient(135deg, #f4ecd8 0%, #fffdf7 46%, #ead9aa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    color: "#2a1e0a",
  },

  container: {
    width: "100%",
    maxWidth: 1040,
    minHeight: 620,
    display: "grid",
    gridTemplateColumns: "0.92fr 1.08fr",
    borderRadius: 38,
    overflow: "hidden",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(176,141,47,0.28)",
    boxShadow: "0 40px 110px rgba(91,62,8,0.20)",
    backdropFilter: "blur(18px)",
  },

  leftPanel: {
    padding: 46,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(43,31,9,0.78), rgba(166,124,0,0.46)), url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90') center/cover",
    color: "#fffaf0",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  logo: {
    width: 56,
    height: 56,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    fontSize: 28,
    boxShadow: "0 20px 50px rgba(212,175,55,0.35)",
  },

  brandTitle: {
    margin: 0,
    fontSize: 28,
    color: "#ffffff",
    lineHeight: 1,
    letterSpacing: -0.8,
  },

  brandSubtitle: {
    margin: "5px 0 0",
    color: "#fff0bd",
    fontSize: 13,
  },

  tag: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: 999,
    color: "#fff4c6",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,244,198,0.34)",
    fontSize: 12,
    fontWeight: 1000,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 18,
    backdropFilter: "blur(10px)",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(38px, 5vw, 56px)",
    lineHeight: 0.96,
    letterSpacing: -2.5,
  },

  heroText: {
    margin: "22px 0 0",
    color: "#fff2c6",
    fontSize: 16,
    lineHeight: 1.75,
  },

  infoBox: {
    padding: 18,
    borderRadius: 24,
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,244,198,0.32)",
    color: "#fff7d6",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    maxWidth: 340,
    backdropFilter: "blur(12px)",
  },

  formPanel: {
    padding: "40px 38px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,250,238,0.92))",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 24,
  },

  formTitle: {
    margin: 0,
    fontSize: 34,
    color: "#2a1e0a",
    letterSpacing: -1.3,
  },

  formSubtitle: {
    margin: "8px 0 0",
    color: "#7b6a42",
    lineHeight: 1.6,
    fontSize: 14,
  },

  navBtn: {
    background: "rgba(255,255,255,0.78)",
    color: "#5f4513",
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  col: {
    minWidth: 0,
  },

  label: {
    display: "block",
    fontSize: 13,
    color: "#5f4513",
    fontWeight: 900,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(166,124,0,0.22)",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box",
    background: "#fffef9",
    color: "#2a1e0a",
  },

  previewCard: {
    padding: 18,
    borderRadius: 24,
    marginBottom: 18,
    background:
      "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.68))",
    border: "1px solid rgba(212,175,55,0.24)",
    boxShadow: "0 16px 38px rgba(91,62,8,0.07)",
  },

  previewLabel: {
    display: "block",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  previewContent: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 60,
    height: 60,
    minWidth: 60,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    fontSize: 25,
    boxShadow: "0 14px 32px rgba(166,124,0,0.22)",
  },

  previewTitle: {
    display: "block",
    fontSize: 21,
    color: "#2a1e0a",
    marginBottom: 5,
  },

  previewText: {
    margin: "3px 0",
    color: "#7b6a42",
    fontSize: 13,
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  btn: {
    flex: 1,
    minWidth: 180,
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    border: "none",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(166,124,0,0.24)",
  },

  secondaryBtn: {
    flex: 1,
    minWidth: 150,
    padding: "15px 18px",
    background: "rgba(255,255,255,0.78)",
    color: "#5f4513",
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },

  errorBox: {
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.22)",
    color: "#991b1b",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },

  successBox: {
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.24)",
    color: "#166534",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },
};