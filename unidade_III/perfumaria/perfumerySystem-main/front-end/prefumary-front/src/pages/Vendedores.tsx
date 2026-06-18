import { useNavigate } from "react-router-dom";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR" | "CLIENTE";

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  nivel: NivelAcesso;
};

export default function Vendedores() {
  const navigate = useNavigate();

  const usuarioLogado: UsuarioLogado | null = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  function sair() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.kicker}>Painel de Vendedores</span>
          <h1 style={styles.title}>Bem-vindo, {usuarioLogado?.nome || "Vendedor"}</h1>
        
        </div>

        <div style={styles.heroActions}>
          <button style={styles.secondaryButton} onClick={() => navigate("/produtos")}>Ver produtos</button>
          <button style={styles.secondaryButton} onClick={() => navigate("/vendas/registrar")}>Registrar venda</button>
          <button style={styles.logout} onClick={sair}>Sair</button>
        </div>
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Registrar vendas</h2>
          <p style={styles.cardText}>Adicione itens ao carrinho e finalize a venda com o cliente selecionado.</p>
          <button style={styles.button} onClick={() => navigate("/vendas/registrar")}>Abrir</button>
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Produtos</h2>
          <p style={styles.cardText}>Veja todos os produtos disponíveis para venda.</p>
          <button style={styles.button} onClick={() => navigate("/produtos")}>Abrir</button>
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Cadastrar cliente</h2>
          <p style={styles.cardText}>Cadastre novos clientes para associar às vendas.</p>
          <button style={styles.button} onClick={() => navigate("/registro-cliente")}>Abrir</button>
        </article>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 24,
    background:
      "radial-gradient(circle at 10% 8%, rgba(212,175,55,0.22), transparent 30%), radial-gradient(circle at 90% 88%, rgba(255,255,255,0.85), transparent 30%), linear-gradient(135deg, #f4ecd8 0%, #fffdf7 46%, #ead9aa 100%)",
    color: "#2a1e0a",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },

  hero: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    padding: "34px",
    borderRadius: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,249,232,0.88))",
    border: "1px solid rgba(176,141,47,0.26)",
    boxShadow: "0 30px 80px rgba(91,62,8,0.13)",
  },

  kicker: {
    display: "inline-flex",
    padding: "8px 13px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    marginBottom: 16,
  },

  title: {
    margin: 0,
    fontSize: "clamp(44px, 6vw, 74px)",
    lineHeight: 0.92,
    letterSpacing: -3,
    color: "#2a1e0a",
  },

  subtitle: {
    maxWidth: 680,
    margin: "18px 0 0",
    color: "#7b6a42",
    fontSize: 17,
    lineHeight: 1.7,
  },

  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  secondaryButton: {
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "13px 20px",
    background: "rgba(255,255,255,0.72)",
    color: "#5f4513",
    fontWeight: 900,
    cursor: "pointer",
  },

  logout: {
    border: "none",
    borderRadius: 999,
    padding: "13px 20px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
  },

  grid: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },

  card: {
    minHeight: 230,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 18,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  cardTitle: {
    margin: 0,
    fontSize: 24,
    color: "#2a1e0a",
    letterSpacing: -0.6,
  },

  cardText: {
    color: "#7b6a42",
    lineHeight: 1.65,
    margin: "10px 0 0",
  },

  button: {
    border: "none",
    borderRadius: 999,
    padding: "12px 18px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 14px 32px rgba(166,124,0,0.20)",
    alignSelf: "flex-start",
  },
};