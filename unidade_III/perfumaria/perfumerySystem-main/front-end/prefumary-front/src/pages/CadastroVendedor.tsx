import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type VendedorForm = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function CadastroVendedor() {
  const navigate = useNavigate();

  const [form, setForm] = useState<VendedorForm>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErro("Informe um e-mail com formato válido (ex: usuario@email.com).");
      setMensagem("");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      setMensagem("");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const vendedorRequest = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      };

      const response = await fetch(`${API_URL}/vendedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendedorRequest),
      });

      if (!response.ok) {
        const respostaErro = await response.text();
        throw new Error(respostaErro || "Erro ao cadastrar vendedor.");
      }

      const data = await response.json();

      // Logar automaticamente após cadastro
      const dadosUsuario = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        nivel: "VENDEDOR",
      };

      localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));

      setMensagem(`Vendedor "${form.nome}" cadastrado com sucesso! Entrando no painel...`);
      
      setTimeout(() => {
        navigate("/vendedores");
      }, 2000);

    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar o vendedor. Verifique se o back-end está rodando."
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
            <div style={styles.logo}>V</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Gold</h1>
              <p style={styles.brandSubtitle}>time de vendas</p>
            </div>
          </div>

          <div>
            <span style={styles.tag}>Cadastro de vendedor</span>

            <h2 style={styles.heroTitle}>
              Junte-se à nossa equipe e comece a transformar beleza em resultados.
            </h2>
          </div>
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Novo vendedor</h2>
              <p style={styles.formSubtitle}>
                Crie sua conta para acessar o painel de vendas.
              </p>
            </div>

            <button
              type="button"
              style={styles.navBtn}
              onClick={() => navigate("/login")}
            >
              ← Voltar ao login
            </button>
          </div>

          {erro && <div style={styles.errorBox}>{erro}</div>}
          {mensagem && <div style={styles.successBox}>{mensagem}</div>}

          <label style={styles.label}>Nome completo</label>
          <input
            style={styles.input}
            name="nome"
            placeholder="Ex: João Souza"
            value={form.nome}
            onChange={handleChange}
          />

          <label style={styles.label}>E-mail</label>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="vendedor@email.com"
            value={form.email}
            onChange={handleChange}
          />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Senha</label>
              <input
                style={styles.input}
                name="senha"
                type="password"
                placeholder="********"
                value={form.senha}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Confirmar senha</label>
              <input
                style={styles.input}
                name="confirmarSenha"
                type="password"
                placeholder="********"
                value={form.confirmarSenha}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Cadastrando..." : "Cadastrar-se agora"}
            </button>
          </div>

          <p style={styles.footerText}>
            Administradores são cadastrados apenas pelo back-end.
          </p>
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

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 10,
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

  footerText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 12,
    color: "#9a8654",
    fontStyle: "italic",
  },
};