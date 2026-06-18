import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Produto, ProdutoApi } from "../services/api";
import {
  API_URL,
  converterProdutoApi,
  formatarPreco,
} from "../services/api";

export default function ListagemProdutos() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setCarregando(true);
      setErroApi("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Não foi possível carregar os produtos.");
      }

      const data: ProdutoApi[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API.");
      }

      setProdutos(data.map(converterProdutoApi));
    } catch (error) {
      console.error(error);
      setProdutos([]);
      setErroApi("Não foi possível conectar ao back-end.");
    } finally {
      setCarregando(false);
    }
  }

  const categorias = useMemo(() => {
    const lista = produtos.map((produto) => produto.categoria).filter(Boolean);
    return ["Todos", ...Array.from(new Set(lista))];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return produtos.filter((produto) => {
      const correspondeBusca =
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo) ||
        produto.marca.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo);

      const correspondeCategoria =
        categoria === "Todos" || produto.categoria === categoria;

      return correspondeBusca && correspondeCategoria;
    });
  }, [produtos, busca, categoria]);

  function calcularDiasRestantes(dataFim?: string) {
    if (!dataFim) return 0;
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);
    const hoje = new Date();
    const diffTime = fim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.kicker}>Catálogo conectado</span>

          <h1 style={styles.title}>Produtos cadastrados</h1>

          <p style={styles.subtitle}>
            Visualize os produtos carregados diretamente do back-end pela rota
            <strong> GET /produtos</strong>.
          </p>
        </div>

        <div style={styles.heroActions}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/dashboard")}
          >
            ← Voltar
          </button>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/produtos/cadastrar")}
          >
            Novo produto
          </button>
        </div>
      </section>

      <section style={styles.toolbar}>
        <div style={styles.searchGroup}>
          <label style={styles.label}>Buscar</label>
          <input
            style={styles.input}
            placeholder="Nome, marca, categoria ou descrição..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        <div style={styles.selectGroup}>
          <label style={styles.label}>Categoria</label>
          <select
            style={styles.input}
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            {categorias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button style={styles.refreshButton} onClick={buscarProdutos}>
          Atualizar
        </button>
      </section>

      <section style={styles.statusArea}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Produtos</span>
          <strong style={styles.metricValue}>{produtos.length}</strong>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Categorias</span>
          <strong style={styles.metricValue}>{categorias.length - 1}</strong>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Exibindo</span>
          <strong style={styles.metricValue}>{produtosFiltrados.length}</strong>
        </div>
      </section>

      {erroApi && <div style={styles.warning}>{erroApi}</div>}

      {carregando ? (
        <div style={styles.warning}>Carregando produtos...</div>
      ) : produtosFiltrados.length === 0 ? (
        <div style={styles.warning}>Nenhum produto cadastrado no sistema.</div>
      ) : (
        <section style={styles.grid}>
          {produtosFiltrados.map((produto) => {
            const diasRestantes = calcularDiasRestantes(produto.promocao?.dataFim);
            const promocaoAtiva = (produto.promocao?.desconto ?? 0) > 0 && diasRestantes > 0;

            return (
              <article key={produto.id} style={styles.card}>
                <div style={styles.imageBox}>
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    style={styles.image}
                  />

                  <div style={styles.imageOverlay}>
                    <span>{produto.categoria}</span>
                  </div>

                  {promocaoAtiva && (
                    <div style={styles.promoTag}>
                      {produto.promocao?.desconto}% OFF
                    </div>
                  )}
                </div>

                <div style={styles.content}>
                  <div style={styles.cardTop}>
                    <span style={styles.category}>{produto.categoria}</span>
                    <small style={styles.brand}>{produto.marca}</small>
                  </div>

                  <h2 style={styles.productName}>{produto.nome}</h2>
                  <p style={styles.description}>{produto.descricao}</p>

                  {promocaoAtiva && (
                    <div style={styles.promoCountdown}>
                      ⏳ Acaba em: <strong>{diasRestantes} dias</strong>
                    </div>
                  )}

                  <div style={styles.footer}>
                    <div style={styles.priceContainer}>
                      {promocaoAtiva ? (
                        <>
                          <span style={styles.oldPrice}>
                            {formatarPreco(produto.preco)}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <strong style={styles.promoPrice}>
                              {formatarPreco(produto.preco * (1 - (produto.promocao?.desconto ?? 0) / 100))}
                            </strong>
                            <span style={styles.savings}>
                              - {formatarPreco(produto.preco * ((produto.promocao?.desconto ?? 0) / 100))}
                            </span>
                          </div>
                        </>
                      ) : (
                        <strong style={styles.price}>
                          {formatarPreco(produto.preco)}
                        </strong>
                      )}
                    </div>

                    <button
                      style={styles.smallButton}
                      onClick={() => navigate("/vendas/registrar")}
                    >
                      Vender
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
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
    margin: "0 auto 24px",
    padding: "30px 34px",
    borderRadius: 34,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,249,232,0.88))",
    border: "1px solid rgba(176,141,47,0.26)",
    boxShadow: "0 24px 70px rgba(91,62,8,0.12)",
    backdropFilter: "blur(18px)",
  },

  heroText: {
    maxWidth: 720,
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
    marginBottom: 14,
  },

  title: {
    margin: 0,
    fontSize: "clamp(36px, 5vw, 58px)",
    lineHeight: 0.98,
    letterSpacing: -2.2,
    color: "#2a1e0a",
  },

  subtitle: {
    margin: "14px 0 0",
    color: "#7b6a42",
    fontSize: 16,
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
    boxShadow: "0 16px 38px rgba(166,124,0,0.24)",
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

  toolbar: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    padding: 18,
    borderRadius: 26,
    display: "grid",
    gridTemplateColumns: "minmax(240px, 1fr) minmax(180px, 260px) auto",
    gap: 14,
    alignItems: "end",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 18px 45px rgba(91,62,8,0.08)",
  },

  searchGroup: {
    minWidth: 0,
  },

  selectGroup: {
    minWidth: 0,
  },

  label: {
    display: "block",
    marginBottom: 7,
    color: "#5f4513",
    fontSize: 13,
    fontWeight: 900,
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(166,124,0,0.22)",
    background: "#fffef9",
    color: "#2a1e0a",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
  },

  refreshButton: {
    border: "none",
    borderRadius: 999,
    padding: "14px 20px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  statusArea: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },

  metricCard: {
    padding: 18,
    borderRadius: 24,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,249,232,0.74))",
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
    marginBottom: 7,
  },

  metricValue: {
    color: "#2a1e0a",
    fontSize: 28,
    lineHeight: 1,
  },

  warning: {
    maxWidth: 1180,
    margin: "0 auto 20px",
    padding: 18,
    borderRadius: 18,
    background: "rgba(212,175,55,0.12)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#5f4513",
    boxShadow: "0 18px 45px rgba(91,62,8,0.06)",
  },

  grid: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: 22,
  },

  card: {
    overflow: "hidden",
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  imageBox: {
    position: "relative",
    height: 270,
    overflow: "hidden",
    background: "#f7f1df",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "contrast(1.04) saturate(0.95)",
  },

  imageOverlay: {
    position: "absolute",
    left: 16,
    bottom: 16,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(212,175,55,0.30)",
    color: "#5f4513",
    fontSize: 12,
    fontWeight: 1000,
    backdropFilter: "blur(10px)",
  },

  content: {
    padding: 22,
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },

  category: {
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  brand: {
    color: "#9a8654",
    fontWeight: 800,
  },

  productName: {
    margin: "12px 0 10px",
    color: "#2a1e0a",
    fontSize: 24,
    letterSpacing: -0.6,
  },

  description: {
    color: "#7b6a42",
    lineHeight: 1.65,
    minHeight: 78,
    margin: 0,
  },

  footer: {
    marginTop: 22,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  price: {
    fontSize: 26,
    color: "#2a1e0a",
    lineHeight: 1,
  },

  promoTag: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: "8px 12px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #ff4d4d 0%, #d40000 100%)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 1000,
    boxShadow: "0 8px 20px rgba(212,0,0,0.3)",
    letterSpacing: 1,
  },

  promoCountdown: {
    marginTop: 10,
    padding: "8px 12px",
    borderRadius: 12,
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.20)",
    color: "#5f4513",
    fontSize: 13,
    display: "inline-block",
  },

  priceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  oldPrice: {
    fontSize: 14,
    color: "#9a8654",
    textDecoration: "line-through",
    lineHeight: 1,
  },

  promoPrice: {
    fontSize: 28,
    color: "#d40000",
    fontWeight: 900,
    lineHeight: 1,
  },

  savings: {
    fontSize: 12,
    color: "#166534",
    fontWeight: 800,
    background: "rgba(34,197,94,0.12)",
    padding: "3px 8px",
    borderRadius: 8,
    whiteSpace: "nowrap",
    display: "inline-block",
    marginTop: 2,
  },

  smallButton: {
    width: "100%",
    border: "none",
    borderRadius: 999,
    padding: "16px 20px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 14px 32px rgba(166,124,0,0.20)",
    fontSize: 15,
  },
};
