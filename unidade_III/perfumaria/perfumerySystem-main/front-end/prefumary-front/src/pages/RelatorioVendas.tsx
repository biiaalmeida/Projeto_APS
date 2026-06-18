import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

const API_URL = "http://localhost:8080";

type TipoAtivo = "dashboard" | "vendas" | "produtos" | "";

type DashboardApi = {
  vendas: {
    totalVendido: number;
    quantidadeVendas: number;
    ticketMedio: number;
  };
  produtos: {
    produtosCadastrados: number;
    produtosEmPromocaoCount: number;
    produtosEmPromocao: unknown[];
  };
};

type RelatorioGenerico = Record<string, unknown>;

export default function RelatorioVendas() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("Dashboard Gerencial");
  const [tipoAtivo, setTipoAtivo] = useState<TipoAtivo>("");
  const [dashboard, setDashboard] = useState<DashboardApi | null>(null);
  const [relatorio, setRelatorio] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarRelatorio(data: RelatorioGenerico) {
    return Object.entries(data)
      .map(([chave, valor]) => {
        if (typeof valor === "number") {
          if (
            chave.toLowerCase().includes("total") ||
            chave.toLowerCase().includes("ticket") ||
            chave.toLowerCase().includes("valor")
          ) {
            return `${formatarChave(chave)}: ${formatarMoeda(valor)}`;
          }

          return `${formatarChave(chave)}: ${valor}`;
        }

        if (Array.isArray(valor)) {
          return `${formatarChave(chave)}: ${valor.length} item(ns)`;
        }

        return `${formatarChave(chave)}: ${String(valor)}`;
      })
      .join("\n");
  }

  function formatarChave(chave: string) {
    return chave
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (letra) => letra.toUpperCase());
  }

  async function gerarDashboard() {
    try {
      setCarregando(true);
      setErro("");
      setTitulo("Dashboard Gerencial");
      setTipoAtivo("dashboard");
      setRelatorio("");

      const response = await fetch(`${API_URL}/relatorios/dashboard`);

      if (!response.ok) {
        throw new Error("Erro ao carregar dashboard gerencial.");
      }

      const data: DashboardApi = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os gráficos gerenciais.");
      setDashboard(null);
    } finally {
      setCarregando(false);
    }
  }

  async function gerarRelatorioProdutos() {
    try {
      setCarregando(true);
      setErro("");
      setTitulo("Relatório de produtos");
      setTipoAtivo("produtos");
      setDashboard(null);

      const response = await fetch(`${API_URL}/relatorios/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao carregar relatório de produtos.");
      }

      const data: RelatorioGenerico = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar o relatório de produtos.");
      setRelatorio("");
    } finally {
      setCarregando(false);
    }
  }

  const maiorIndicador = dashboard
    ? Math.max(
        dashboard.vendas.quantidadeVendas,
        dashboard.produtos.produtosCadastrados,
        dashboard.produtos.produtosEmPromocaoCount,
        1
      )
    : 1;

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.kicker}>Análise gerencial</span>

          <h1 style={styles.title}>{titulo}</h1>

          <p style={styles.subtitle}>
            Acompanhe vendas, ticket médio, produtos cadastrados e produtos em
            promoção com dados retornados diretamente pelo back-end.
          </p>
        </div>

        <div style={styles.heroActions}>
          <button style={styles.secondaryButton} onClick={() => navigate("/dashboard")}>
            ← Voltar
          </button>

          <button style={styles.primaryButton} onClick={gerarDashboard}>
            Atualizar dashboard
          </button>
        </div>
      </section>

      <section style={styles.actionsPanel}>
        <div>
          <span style={styles.panelTag}>Gerar relatório</span>

          <h2 style={styles.panelTitle}>Escolha o tipo de consulta</h2>

          <p style={styles.panelText}>
            Os dados exibidos são retornados pelo back-end. Caso não existam
            registros no banco, os indicadores podem vir zerados.
          </p>
        </div>

        <div style={styles.actions}>
          <button
            style={
              tipoAtivo === "dashboard"
                ? styles.primaryButton
                : styles.secondaryButton
            }
            onClick={gerarDashboard}
            disabled={carregando}
          >
            Gráficos Gerenciais
          </button>

          <button
            style={
              tipoAtivo === "produtos"
                ? styles.primaryButton
                : styles.secondaryButton
            }
            onClick={gerarRelatorioProdutos}
            disabled={carregando}
          >
            Relatório de produtos
          </button>
        </div>
      </section>

      {erro && <div style={styles.warning}>{erro}</div>}

      {carregando && <div style={styles.loading}>Carregando dados...</div>}

      {!carregando && dashboard && tipoAtivo === "dashboard" && (
        <>
          <section style={styles.metrics}>
            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Total vendido</span>
              <strong style={styles.metricValue}>
                {formatarMoeda(dashboard.vendas.totalVendido)}
              </strong>
              <p style={styles.metricText}>Somatório de todas as vendas registradas.</p>
            </article>

            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Quantidade de vendas</span>
              <strong style={styles.metricValue}>
                {dashboard.vendas.quantidadeVendas}
              </strong>
              <p style={styles.metricText}>Número total de vendas cadastradas.</p>
            </article>

            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Ticket médio</span>
              <strong style={styles.metricValue}>
                {formatarMoeda(dashboard.vendas.ticketMedio)}
              </strong>
              <p style={styles.metricText}>Média de valor por venda.</p>
            </article>

            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Produtos cadastrados</span>
              <strong style={styles.metricValue}>
                {dashboard.produtos.produtosCadastrados}
              </strong>
              <p style={styles.metricText}>Total de produtos no catálogo.</p>
            </article>
          </section>

          <section style={styles.dashboardGrid}>
            <article style={styles.chartCard}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.panelTag}>Indicadores</span>
                  <h2 style={styles.cardTitle}>Resumo operacional</h2>
                </div>
              </div>

              <div style={styles.barGroup}>
                <div style={styles.barItem}>
                  <div style={styles.barInfo}>
                    <span>Vendas realizadas</span>
                    <strong>{dashboard.vendas.quantidadeVendas}</strong>
                  </div>

                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${Math.max(
                          8,
                          (dashboard.vendas.quantidadeVendas / maiorIndicador) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={styles.barItem}>
                  <div style={styles.barInfo}>
                    <span>Produtos cadastrados</span>
                    <strong>{dashboard.produtos.produtosCadastrados}</strong>
                  </div>

                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${Math.max(
                          8,
                          (dashboard.produtos.produtosCadastrados /
                            maiorIndicador) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={styles.barItem}>
                  <div style={styles.barInfo}>
                    <span>Produtos em promoção</span>
                    <strong>{dashboard.produtos.produtosEmPromocaoCount}</strong>
                  </div>

                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${Math.max(
                          8,
                          (dashboard.produtos.produtosEmPromocaoCount /
                            maiorIndicador) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>

            <article style={styles.chartCard}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.panelTag}>Desempenho</span>
                  <h2 style={styles.cardTitle}>Financeiro</h2>
                </div>
              </div>

              <div style={styles.financeBox}>
                <div style={styles.circle}>
                  <span>Total</span>
                  <strong>{formatarMoeda(dashboard.vendas.totalVendido)}</strong>
                </div>

                <div style={styles.financeList}>
                  <div>
                    <span>Ticket médio</span>
                    <strong>{formatarMoeda(dashboard.vendas.ticketMedio)}</strong>
                  </div>

                  <div>
                    <span>Quantidade de vendas</span>
                    <strong>{dashboard.vendas.quantidadeVendas}</strong>
                  </div>

                  <div>
                    <span>Produtos cadastrados</span>
                    <strong>{dashboard.produtos.produtosCadastrados}</strong>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </>
      )}

      {!carregando && relatorio && tipoAtivo !== "dashboard" && (
        <section style={styles.reportBox}>
          <div style={styles.reportHeader}>
            <div>
              <span style={styles.panelTag}>Resultado</span>
              <h2 style={styles.reportTitle}>{titulo}</h2>
            </div>

            <div style={styles.statusBadge}>Gerado</div>
          </div>

          <pre style={styles.pre}>{relatorio}</pre>
        </section>
      )}

      {!carregando && !dashboard && !relatorio && !erro && (
        <section style={styles.reportBox}>
          <div style={styles.reportHeader}>
            <div>
              <span style={styles.panelTag}>Resultado</span>
              <h2 style={styles.reportTitle}>Aguardando consulta</h2>
            </div>

            <div style={styles.statusBadge}>Aguardando</div>
          </div>

          <div style={styles.emptyBox}>
            Nenhum relatório gerado ainda. Clique em uma das opções acima para
            consultar os dados do back-end.
          </div>
        </section>
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
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
    padding: 34,
    borderRadius: 36,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: "clamp(42px, 6vw, 68px)",
    lineHeight: 0.95,
    letterSpacing: -2.8,
    color: "#2a1e0a",
  },

  subtitle: {
    maxWidth: 720,
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

  primaryButton: {
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

  secondaryButton: {
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "13px 20px",
    background: "rgba(255,255,255,0.72)",
    color: "#5f4513",
    fontWeight: 900,
    cursor: "pointer",
  },

  actionsPanel: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    padding: 24,
    borderRadius: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,232,0.78))",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 20px 55px rgba(91,62,8,0.10)",
  },

  panelTag: {
    display: "block",
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  panelTitle: {
    margin: 0,
    color: "#2a1e0a",
    fontSize: 28,
    letterSpacing: -1,
  },

  panelText: {
    maxWidth: 620,
    margin: "9px 0 0",
    color: "#7b6a42",
    lineHeight: 1.65,
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  warning: {
    maxWidth: 1180,
    margin: "0 auto 20px",
    padding: 18,
    borderRadius: 18,
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.22)",
    color: "#991b1b",
    boxShadow: "0 18px 45px rgba(91,62,8,0.06)",
  },

  loading: {
    maxWidth: 1180,
    margin: "0 auto 20px",
    padding: 18,
    borderRadius: 18,
    background: "rgba(212,175,55,0.12)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#5f4513",
    fontWeight: 900,
  },

  metrics: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  metricCard: {
    padding: 22,
    borderRadius: 28,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,232,0.76))",
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
    marginBottom: 10,
  },

  metricValue: {
    display: "block",
    color: "#2a1e0a",
    fontSize: 30,
    lineHeight: 1.1,
  },

  metricText: {
    margin: "10px 0 0",
    color: "#7b6a42",
    lineHeight: 1.5,
    fontSize: 13,
  },

  dashboardGrid: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },

  chartCard: {
    padding: 26,
    borderRadius: 32,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  cardTitle: {
    margin: 0,
    fontSize: 28,
    color: "#2a1e0a",
    letterSpacing: -1,
  },

  barGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  barItem: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  barInfo: {
    display: "flex",
    justifyContent: "space-between",
    color: "#5f4513",
    fontWeight: 900,
  },

  barTrack: {
    height: 16,
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.20)",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
  },

  financeBox: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: 20,
    alignItems: "center",
  },

  circle: {
    width: 180,
    height: 180,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    boxShadow: "0 18px 42px rgba(166,124,0,0.24)",
  },

  financeList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  reportBox: {
    maxWidth: 1180,
    margin: "0 auto",
    minHeight: 300,
    padding: 26,
    borderRadius: 32,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  reportTitle: {
    margin: 0,
    color: "#2a1e0a",
    fontSize: 30,
    letterSpacing: -1,
  },

  statusBadge: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },

  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#5f4513",
    fontFamily: "inherit",
    lineHeight: 1.85,
    fontSize: 15,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(176,141,47,0.16)",
    borderRadius: 22,
    padding: 20,
  },

  emptyBox: {
    padding: 20,
    borderRadius: 22,
    background: "rgba(212,175,55,0.10)",
    border: "1px solid rgba(212,175,55,0.22)",
    color: "#7b6a42",
    lineHeight: 1.7,
  },
};