import { useNavigate } from "react-router-dom";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR" | "CLIENTE";

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  nivel: NivelAcesso;
};

type CardDashboard = {
  titulo: string;
  texto: string;
  rota: string;
  icone: string;
  permissoes: NivelAcesso[];
};

export default function Dashboard() {
  const navigate = useNavigate();

  const usuarioLogado: UsuarioLogado | null = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  const nivel = usuarioLogado?.nivel;

  const cards: CardDashboard[] = [
    {
      titulo: "Produtos",
      texto: "Visualizar produtos cadastrados no sistema.",
      rota: "/produtos",
      icone: "✦",
      permissoes: ["ADMIN", "GERENTE", "VENDEDOR"],
    },
    {
      titulo: "Registrar venda",
      texto: "Criar uma venda com produtos cadastrados.",
      rota: "/vendas/registrar",
      icone: "₿",
      permissoes: ["ADMIN", "GERENTE", "VENDEDOR"],
    },
    {
      titulo: "Área administrativa",
      texto: "Gerenciar produtos, promoções, relatórios e configurações do sistema.",
      rota: "/administracao",
      icone: "⚙",
      permissoes: ["ADMIN", "GERENTE"],
    },
    {
      titulo: "Cadastrar cliente",
      texto: "Adicionar clientes ao sistema para vincular às vendas.",
      rota: "/clientes/cadastrar",
      icone: "◌",
      permissoes: ["ADMIN", "VENDEDOR"],
    },
  ];

  const cardsPermitidos = cards.filter((card) => {
    if (!nivel) return false;
    return card.permissoes.includes(nivel);
  });

  function sair() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  function nomeNivel(nivel?: NivelAcesso) {
    if (nivel === "ADMIN") return "Administrador";
    if (nivel === "GERENTE") return "Gerente";
    if (nivel === "VENDEDOR") return "Vendedor";
    return "Acesso interno";
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.kicker}>Painel administrativo</span>

          <h1 style={styles.title}>Aura Gold</h1>

          <p style={styles.subtitle}>
            Gestão elegante para produtos, clientes, vendas, promoções e relatórios
            da perfumaria.
          </p>

          <div style={styles.userCard}>
            <div style={styles.avatar}>
              {usuarioLogado?.nome
                ? usuarioLogado.nome.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <span style={styles.userLabel}>Usuário conectado</span>

              <strong style={styles.userName}>
                {usuarioLogado?.nome || "Funcionário"}
              </strong>

              <p style={styles.userType}>{nomeNivel(nivel)}</p>
            </div>
          </div>
        </div>

        <div style={styles.heroActions}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/produtos")}
          >
            Ver produtos
          </button>

          <button style={styles.logout} onClick={sair}>
            Sair
          </button>
        </div>
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
    position: "relative",
    overflow: "hidden",
  },

  heroContent: {
    maxWidth: 760,
    position: "relative",
    zIndex: 1,
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

  userCard: {
    marginTop: 24,
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 24,
    maxWidth: 380,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 18px 45px rgba(91,62,8,0.08)",
  },

  avatar: {
    width: 58,
    height: 58,
    minWidth: 58,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontSize: 25,
    fontWeight: 1000,
    boxShadow: "0 14px 32px rgba(166,124,0,0.20)",
  },

  userLabel: {
    display: "block",
    color: "#9a8654",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },

  userName: {
    display: "block",
    color: "#2a1e0a",
    fontSize: 17,
  },

  userType: {
    margin: "3px 0 0",
    color: "#7b6a42",
    fontSize: 13,
  },

  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
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
    boxShadow: "0 16px 38px rgba(166,124,0,0.22)",
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