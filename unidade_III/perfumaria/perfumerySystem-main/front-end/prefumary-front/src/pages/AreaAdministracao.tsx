import { useNavigate } from "react-router-dom";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR" | "CLIENTE";

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  nivel: NivelAcesso;
};

export default function AreaAdministracao() {
  const navigate = useNavigate();

  const usuarioLogado: UsuarioLogado | null = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  const nivel = usuarioLogado?.nivel;

  const cards = [
    {
      titulo: "Cadastrar produto",
      texto: "Adicionar novos produtos ao catálogo da perfumaria.",
      rota: "/produtos/cadastrar",
      icone: "＋",
      permissoes: ["ADMIN", "GERENTE"],
    },
    {
      titulo: "Cadastrar promoção",
      texto: "Criar promoções vinculadas a um gerente.",
      rota: "/promocoes/cadastrar",
      icone: "%",
      permissoes: ["ADMIN", "GERENTE"],
    },
    {
      titulo: "Relatórios",
      texto: "Consultar relatórios de vendas e produtos.",
      rota: "/relatorios/vendas",
      icone: "◇",
      permissoes: ["ADMIN", "GERENTE"],
    },
    {
      titulo: "Produtos cadastrados",
      texto: "Visualizar todos os produtos registrados no sistema.",
      rota: "/produtos",
      icone: "✦",
      permissoes: ["ADMIN", "GERENTE"],
    },
  ];

  const cardsPermitidos = cards.filter((card) =>
    nivel ? card.permissoes.includes(nivel) : false
  );

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.kicker}>Área restrita</span>
          <h1 style={styles.title}>Administração</h1>

          <p style={styles.subtitle}>
            Área destinada ao gerente para controle de
            produtos, promoções e relatórios do sistema.
          </p>

          <div style={styles.adminNotification}>
            <strong>Nota Importante:</strong> Administradores são cadastrados apenas pelo back-end.
          </div>
        </div>

        <button style={styles.secondaryButton} onClick={() => navigate("/dashboard")}>
          ← Voltar
        </button>
      </section>

      <section style={styles.metrics}>
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Usuário</span>
          <strong style={styles.metricValueSmall}>
            {usuarioLogado?.nome || "Funcionário"}
          </strong>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Nível de acesso</span>
          <strong style={styles.metricValueSmall}>{nivel}</strong>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Módulos liberados</span>
          <strong style={styles.metricValue}>{cardsPermitidos.length}</strong>
        </article>
      </section>

      <section style={styles.grid}>
        {cardsPermitidos.map((card) => (
          <article key={card.rota} style={styles.card}>
            <div style={styles.cardIcon}>{card.icone}</div>

            <div>
              <h2 style={styles.cardTitle}>{card.titulo}</h2>
              <p style={styles.cardText}>{card.texto}</p>
            </div>

            <button style={styles.button} onClick={() => navigate(card.rota)}>
              Acessar
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 8%, rgba(212,175,55,0.22), transparent 30%), radial-gradient(circle at 90% 88%, rgba(255,255,255,0.85), transparent 30%), linear-gradient(135deg, #f4ecd8 0%, #fffdf7 46%, #ead9aa 100%)",
    color: "#2a1e0a",
    padding: 24,
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
    maxWidth: 720,
    margin: "18px 0 0",
    color: "#7b6a42",
    fontSize: 17,
    lineHeight: 1.7,
  },

  adminNotification: {
    marginTop: 20,
    padding: "12px 18px",
    borderRadius: 16,
    background: "rgba(212,175,55,0.15)",
    border: "1px solid rgba(212,175,55,0.30)",
    color: "#5f4513",
    fontSize: 14,
    lineHeight: 1.5,
    display: "inline-block",
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

  metrics: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },

  metricCard: {
    padding: 20,
    borderRadius: 26,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,249,232,0.74))",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 18px 45px rgba(91,62,8,0.08)",
  },

  metricLabel: {
    display: "block",
    color: "#9a8654",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  metricValue: {
    color: "#2a1e0a",
    fontSize: 30,
    lineHeight: 1,
  },

  metricValueSmall: {
    color: "#2a1e0a",
    fontSize: 21,
    lineHeight: 1,
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

  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontSize: 25,
    fontWeight: 1000,
    boxShadow: "0 14px 32px rgba(166,124,0,0.20)",
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