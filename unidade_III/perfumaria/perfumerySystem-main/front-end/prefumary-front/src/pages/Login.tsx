import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR";

type TipoEntrada = "dashboard" | "administracao";

type UsuarioApi = {
  id?: number;
  nome?: string;
  email?: string;
  senha?: string;
};

type UsuarioComNivel = UsuarioApi & {
  nivel: NivelAcesso;
};

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  nivel: NivelAcesso;
};

export default function Login() {
  const navigate = useNavigate();

  const [tipoEntrada, setTipoEntrada] = useState<TipoEntrada>("dashboard");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarUsuariosPorNivel(nivel: NivelAcesso) {
    try {
      let endpoint = "";

      if (nivel === "ADMIN") {
        endpoint = "/administradores";
      }

      if (nivel === "GERENTE") {
        endpoint = "/gerentes";
      }

      if (nivel === "VENDEDOR") {
        endpoint = "/vendedores";
      }

      const response = await fetch(`${API_URL}${endpoint}`);

      if (!response.ok) {
        return [];
      }

      const data: UsuarioApi[] = await response.json();

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item) => ({
        ...item,
        nivel,
      }));
    } catch {
      return [];
    }
  }

  async function buscarTodosUsuarios() {
    try {
      const [admins, gerentes, vendedores] = await Promise.all([
        buscarUsuariosPorNivel("ADMIN"),
        buscarUsuariosPorNivel("GERENTE"),
        buscarUsuariosPorNivel("VENDEDOR"),
      ]);

      return [...admins, ...gerentes, ...vendedores];
    } catch {
      return [];
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!usuario.trim() || !senha.trim()) {
      setErro("Preencha usuário e senha para continuar.");
      return;
    }

    if (usuario.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usuario.trim())) {
        setErro("Formato de e-mail inválido.");
        return;
      }
    }

    // validações básicas de formulário

    try {
      setCarregando(true);
      setErro("");

      const usuarios = await buscarTodosUsuarios();

      const usuarioEncontrado: UsuarioComNivel | undefined = usuarios.find(
        (item) => {
          const emailConfere =
            item.email?.toLowerCase() === usuario.trim().toLowerCase();

          const nomeConfere =
            item.nome?.toLowerCase() === usuario.trim().toLowerCase();

          const senhaConfere = item.senha === senha;

          return (emailConfere || nomeConfere) && senhaConfere;
        }
      );

      if (!usuarioEncontrado) {
        setErro("Usuário, senha ou nível de acesso inválido.");
        return;
      }

      // Validação de acesso por aba selecionada
      if (tipoEntrada === "dashboard" && usuarioEncontrado.nivel !== "VENDEDOR") {
        setErro("Acesso negado. Administradores e Gerentes devem entrar pela Área Administrativa.");
        return;
      }

      if (tipoEntrada === "administracao" && usuarioEncontrado.nivel === "VENDEDOR") {
        setErro("Acesso negado. Vendedores devem entrar pelo painel de Vendedores.");
        return;
      }

      const dadosUsuario: UsuarioLogado = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome || "Funcionário",
      email: usuarioEncontrado.email || "",
      nivel: usuarioEncontrado.nivel,
      };

      localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));



      // redirecionamento por nível: vendedores -> painel, gerentes/administradores -> área administrativa
      if (dadosUsuario.nivel === "VENDEDOR") {
        navigate("/vendedores");
        return;
      }

      // ADMIN e GERENTE devem acessar a área administrativa
      navigate("/administracao");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível conectar ao back-end.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.leftPanel}>
          <div style={styles.brandLine}>
            <div style={styles.logo}>A</div>

            <div>
              <h1 style={styles.brandName}>Aura Gold</h1>
              <p style={styles.brandSub}>Perfumaria & Cosméticos</p>
            </div>
          </div>

          <div style={styles.heroBlock}>
          

            
           
          </div>

          <div style={styles.accessCards}>
         
             
            </div>
          </div>
       

        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <span style={styles.miniTag}>Bem-vindo</span>

              <h2 style={styles.title}>Entrar</h2>

              <p style={styles.subtitle}>
                Faça login com seu e-mail e senha.
              </p>
            </div>

            <div style={styles.toggle}>
              <button
                type="button"
                style={
                  tipoEntrada === "dashboard"
                    ? styles.toggleActive
                    : styles.toggleButton
                }
                onClick={() => {
                  setTipoEntrada("dashboard");
                  setErro("");
                }}
              >
                Vendedores
              </button>

              <button
                type="button"
                style={
                  tipoEntrada === "administracao"
                    ? styles.toggleActive
                    : styles.toggleButton
                }
                onClick={() => {
                  setTipoEntrada("administracao");
                  setErro("");
                }}
              >
                Área administrativa
              </button>
            </div>

            <form onSubmit={handleLogin}>

              <label style={styles.label}>Usuário</label>

              <div style={styles.inputBox}>
                <span style={styles.inputIcon}>✉</span>

                <input
                  style={styles.input}
                  placeholder="E-mail ou nome"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>

              <label style={styles.label}>Senha</label>

              <div style={styles.inputBox}>
                <span style={styles.inputIcon}>●</span>

                <input
                  style={styles.input}
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              {tipoEntrada === "administracao" && (
                <div style={styles.infoBox}>
                  <strong>Área administrativa</strong>
                  <p>
                    Permitida apenas para administradores e gerentes. Vendedores
                    devem acessar pelo painel.
                  </p>
                </div>
              )}

              {erro && <div style={styles.errorBox}>{erro}</div>}

              <button style={styles.btn} type="submit" disabled={carregando}>
                {carregando
                  ? "Validando acesso..."
                  : tipoEntrada === "administracao"
                  ? "Entrar na administração"
                  : "Entrar no painel"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    tipoEntrada === "dashboard"
                      ? "/registro-vendedor"
                      : "/registro-gerente"
                  )
                }
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(166,124,0,0.23)",
                  background: "transparent",
                  color: "#5f4513",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {tipoEntrada === "dashboard"
                  ? "Clique aqui para cadastrar-se como Vendedor"
                  : "Clique aqui para cadastrar-se como Gerente"}
              </button>
            </form>

            <div style={styles.footer}>
              <span>
                O acesso é validado pelos usuários cadastrados no back-end.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background:
      "radial-gradient(circle at 10% 10%, rgba(212,175,55,0.30), transparent 26%), radial-gradient(circle at 90% 85%, rgba(255,255,255,0.95), transparent 28%), linear-gradient(135deg, #f3ead5 0%, #fffdf7 44%, #e7d29a 100%)",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    overflow: "hidden",
  },

  shell: {
    width: "100%",
    maxWidth: 1120,
    minHeight: 680,
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    borderRadius: 38,
    overflow: "hidden",
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(176,141,47,0.30)",
    boxShadow: "0 40px 120px rgba(91,62,8,0.22)",
    backdropFilter: "blur(22px)",
  },

  leftPanel: {
    padding: 48,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(38,28,11,0.78), rgba(166,124,0,0.42)), url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=90') center/cover",
    color: "#fffaf0",
  },

  brandLine: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff7d6 0%, #d4af37 48%, #8f6b16 100%)",
    color: "#261c0b",
    fontSize: 30,
    fontWeight: 1000,
    boxShadow: "0 22px 55px rgba(212,175,55,0.38)",
  },

  brandName: {
    margin: 0,
    fontSize: 30,
    letterSpacing: -0.8,
    lineHeight: 1,
  },

  brandSub: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#fff0bd",
  },

  heroBlock: {
    maxWidth: 560,
  },

  tag: {
    display: "inline-flex",
    padding: "10px 15px",
    borderRadius: 999,
    color: "#fff4c6",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,244,198,0.34)",
    fontSize: 12,
    fontWeight: 1000,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 20,
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(40px, 5vw, 64px)",
    lineHeight: 0.94,
    letterSpacing: -2.8,
  },

  heroText: {
    margin: "24px 0 0",
    color: "#fff2c6",
    fontSize: 17,
    lineHeight: 1.75,
  },

  accessCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },

  accessCard: {
    padding: 14,
    borderRadius: 18,
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,244,198,0.28)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#fff7d6",
    fontSize: 12,
  },

  rightPanel: {
    padding: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,252,244,0.92))",
  },

  formCard: {
    width: "100%",
    maxWidth: 430,
    padding: 34,
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.92))",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 30px 70px rgba(91,62,8,0.12)",
  },

  formHeader: {
    marginBottom: 24,
  },

  miniTag: {
    display: "inline-flex",
    padding: "8px 13px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 14,
  },

  title: {
    margin: 0,
    fontSize: 38,
    color: "#2a1e0a",
    letterSpacing: -1.6,
    lineHeight: 1,
  },

  subtitle: {
    margin: "12px 0 0",
    fontSize: 14,
    color: "#7b6a42",
    lineHeight: 1.65,
  },

  toggle: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    padding: 6,
    borderRadius: 999,
    background: "rgba(212,175,55,0.12)",
    border: "1px solid rgba(212,175,55,0.20)",
    marginBottom: 24,
  },

  toggleButton: {
    border: "none",
    borderRadius: 999,
    padding: "11px 14px",
    background: "transparent",
    color: "#7b6a42",
    fontWeight: 900,
    cursor: "pointer",
  },

  toggleActive: {
    border: "none",
    borderRadius: 999,
    padding: "11px 14px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(166,124,0,0.20)",
  },

  label: {
    display: "block",
    fontSize: 13,
    color: "#5f4513",
    fontWeight: 900,
    marginBottom: 8,
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid rgba(166,124,0,0.23)",
    background: "#fffef9",
    color: "#2a1e0a",
    fontSize: 15,
    outline: "none",
    marginBottom: 18,
    fontWeight: 800,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "0 14px",
    borderRadius: 18,
    border: "1px solid rgba(166,124,0,0.23)",
    background: "#fffef9",
    marginBottom: 18,
    boxShadow: "0 12px 28px rgba(91,62,8,0.05)",
  },

  inputIcon: {
    color: "#b08d2f",
    fontSize: 15,
    fontWeight: 900,
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#2a1e0a",
    fontSize: 15,
    padding: "15px 0",
    minWidth: 0,
  },

  infoBox: {
    padding: 16,
    borderRadius: 20,
    background: "rgba(212,175,55,0.10)",
    border: "1px solid rgba(212,175,55,0.22)",
    color: "#5f4513",
    lineHeight: 1.6,
    marginBottom: 18,
  },

  btn: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontSize: 15,
    fontWeight: 1000,
    cursor: "pointer",
    marginTop: 4,
    boxShadow: "0 18px 44px rgba(166,124,0,0.26)",
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

  footer: {
    marginTop: 22,
    textAlign: "center",
    color: "#9a8654",
    fontSize: 12,
    lineHeight: 1.5,
  },
};