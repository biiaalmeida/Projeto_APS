import { useEffect, useMemo, useState } from "react";
import type { Produto, ProdutoApi } from "../services/api";
import { API_URL, converterProdutoApi, formatarPreco } from "../services/api";

type ProdutoComPromocao = Produto & {
  promocao?: {
    id?: number;
    nome?: string;
    desconto?: number;
    dataInicio?: string;
    dataFim?: string;
  } | null;
};

export default function CatalogoCliente() {
  const [produtos, setProdutos] = useState<ProdutoComPromocao[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setCarregando(true);
      setErro("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao carregar catálogo.");
      }

      const data: ProdutoApi[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API.");
      }

      setProdutos(data.map(converterProdutoApi));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar o catálogo. Verifique se o back-end está rodando.");
      setProdutos([]);
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
        produto.marca.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo);

      const correspondeCategoria =
        categoria === "Todos" || produto.categoria === categoria;

      return correspondeBusca && correspondeCategoria;
    });
  }, [produtos, busca, categoria]);

  const produtosEmPromocao = useMemo(() => {
    return produtos.filter((produto) => produto.promocao?.desconto);
  }, [produtos]);

  function calcularPrecoPromocional(produto: ProdutoComPromocao) {
    const desconto = Number(produto.promocao?.desconto || 0);

    if (!desconto) {
      return produto.preco;
    }

    return produto.preco - produto.preco * (desconto / 100);
  }

  function temPromocao(produto: ProdutoComPromocao) {
    const dias = calcularDiasRestantes(produto.promocao?.dataFim);
    return Number(produto.promocao?.desconto || 0) > 0 && dias > 0;
  }

  function calcularDiasRestantes(dataFim?: string) {
    if (!dataFim) return 0;
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);
    const hoje = new Date();
    const diffTime = fim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function enviarWhatsApp(produto: ProdutoComPromocao) {
    const preco = calcularPrecoPromocional(produto);

    const mensagem = `Olá! Tenho interesse no produto ${produto.nome}, da marca ${produto.marca}, no valor de ${formatarPreco(preco)}.`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>A</div>

          <div>
            <h1 style={styles.brandTitle}>Aura Gold</h1>
            <p style={styles.brandSubtitle}>perfumaria & cosméticos</p>
          </div>
        </div>

        <nav style={styles.nav}>
          <a href="#catalogo" style={styles.navLink}>Catálogo</a>
          <a href="#promocoes" style={styles.navLink}>Promoções</a>
          <a href="#contato" style={styles.navButton}>Atendimento</a>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.kicker}>Catálogo exclusivo</span>

          <h2 style={styles.heroTitle}>
            Descubra fragrâncias, cuidados e ofertas especiais.
          </h2>

          <p style={styles.heroSubtitle}>
            Explore os produtos cadastrados no sistema da perfumaria e acompanhe
            as promoções disponíveis em tempo real.
          </p>

          <div style={styles.heroActions}>
            <a href="#catalogo" style={styles.primaryButton}>
              Ver catálogo
            </a>

            <a href="#promocoes" style={styles.secondaryButton}>
              Ver promoções
            </a>
          </div>
        </div>

        <div style={styles.heroImageBox}>
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=90"
            alt="Perfumes premium"
            style={styles.heroImage}
          />

          <div style={styles.heroFloatingCard}>
            <span>Produtos em promoção</span>
            <strong>{produtosEmPromocao.length}</strong>
          </div>
        </div>
      </section>

      <section id="promocoes" style={styles.promoSection}>
        <div>
          <span style={styles.sectionTag}>Ofertas especiais</span>
          <h2 style={styles.sectionTitle}>Promoções disponíveis</h2>
          <p style={styles.sectionText}>
            Os produtos com promoção ativa aparecem destacados no catálogo com o
            valor original e o valor com desconto.
          </p>
        </div>

        <div style={styles.promoBadge}>
          <strong>{produtosEmPromocao.length}</strong>
          <span>ofertas</span>
        </div>
      </section>

      <section id="catalogo" style={styles.catalogHeader}>
        <div>
          <span style={styles.sectionTag}>Catálogo</span>
          <h2 style={styles.sectionTitle}>Produtos disponíveis</h2>
        </div>

        <div style={styles.filters}>
          <input
            style={styles.input}
            placeholder="Buscar produto, marca ou categoria..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />

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

          <button style={styles.refreshButton} onClick={buscarProdutos}>
            Atualizar
          </button>
        </div>
      </section>

      {erro && <div style={styles.warning}>{erro}</div>}

      {carregando ? (
        <div style={styles.warning}>Carregando catálogo...</div>
      ) : produtosFiltrados.length === 0 ? (
        <div style={styles.warning}>
          Nenhum produto encontrado no catálogo.
        </div>
      ) : (
        <section style={styles.grid}>
          {produtosFiltrados.map((produto) => {
            const promocional = calcularPrecoPromocional(produto);
            const possuiPromocao = temPromocao(produto);

            return (
              <article key={produto.id} style={styles.card}>
                <div style={styles.imageBox}>
                  <img src={produto.imagem} alt={produto.nome} style={styles.image} />

                  {possuiPromocao && (
                    <div style={styles.discountTag}>
                      {produto.promocao?.desconto}% OFF
                    </div>
                  )}
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.cardTop}>
                    <span style={styles.category}>{produto.categoria}</span>
                    <small style={styles.brandName}>{produto.marca}</small>
                  </div>

                  <h3 style={styles.productName}>{produto.nome}</h3>

                  <p style={styles.description}>{produto.descricao}</p>

                  {possuiPromocao && (
                    <div style={styles.promoInfo}>
                      <strong>{produto.promocao?.nome || "Promoção ativa"}</strong>
                      <span style={{ color: '#d40000', fontWeight: 800 }}>
                        ⏳ Acaba em {calcularDiasRestantes(produto.promocao?.dataFim)} dias
                      </span>
                    </div>
                  )}

                  <div style={styles.priceArea}>
                    {possuiPromocao ? (
                      <div>
                        <span style={styles.oldPrice}>
                          {formatarPreco(produto.preco)}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <strong style={styles.price}>
                            {formatarPreco(promocional)}
                          </strong>
                          <span style={styles.savingsLabel}>
                            Economize {formatarPreco(produto.preco - promocional)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <strong style={styles.price}>
                        {formatarPreco(produto.preco)}
                      </strong>
                    )}

                    <button
                      style={styles.buyButton}
                      onClick={() => enviarWhatsApp(produto)}
                    >
                      Tenho interesse
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section id="contato" style={styles.contact}>
        <div>
          <span style={styles.sectionTag}>Atendimento</span>
          <h2 style={styles.sectionTitle}>Gostou de algum produto?</h2>
          <p style={styles.sectionText}>
            Clique em “Tenho interesse” para iniciar uma conversa sobre o produto.
            O catálogo é atualizado de acordo com os produtos cadastrados no sistema.
          </p>
        </div>

        <button style={styles.primaryButton} onClick={buscarProdutos}>
          Atualizar catálogo
        </button>
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
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "18px clamp(20px, 5vw, 80px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 22,
    background: "rgba(255,253,247,0.86)",
    borderBottom: "1px solid rgba(176,141,47,0.22)",
    backdropFilter: "blur(18px)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontSize: 25,
    fontWeight: 1000,
    boxShadow: "0 14px 32px rgba(166,124,0,0.22)",
  },

  brandTitle: {
    margin: 0,
    fontSize: 25,
    color: "#2a1e0a",
    lineHeight: 1,
  },

  brandSubtitle: {
    margin: "4px 0 0",
    color: "#7b6a42",
    fontSize: 13,
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
  },

  navLink: {
    color: "#5f4513",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 14,
  },

  navButton: {
    textDecoration: "none",
    borderRadius: 999,
    padding: "11px 17px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    boxShadow: "0 14px 32px rgba(166,124,0,0.18)",
  },

  hero: {
    maxWidth: 1220,
    margin: "0 auto",
    padding: "clamp(42px, 7vw, 86px) 24px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: 38,
    alignItems: "center",
  },

  heroText: {
    maxWidth: 720,
  },

  kicker: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(44px, 7vw, 82px)",
    lineHeight: 0.92,
    letterSpacing: -3.4,
    color: "#2a1e0a",
  },

  heroSubtitle: {
    margin: "24px 0 0",
    color: "#7b6a42",
    fontSize: 18,
    lineHeight: 1.75,
  },

  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 32,
  },

  primaryButton: {
    border: "none",
    borderRadius: 999,
    padding: "14px 20px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 16px 38px rgba(166,124,0,0.22)",
  },

  secondaryButton: {
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "14px 20px",
    background: "rgba(255,255,255,0.72)",
    color: "#5f4513",
    fontWeight: 900,
    cursor: "pointer",
    textDecoration: "none",
  },

  heroImageBox: {
    position: "relative",
    minHeight: 520,
    borderRadius: 38,
    overflow: "hidden",
    border: "1px solid rgba(176,141,47,0.24)",
    boxShadow: "0 34px 90px rgba(91,62,8,0.20)",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    minHeight: 520,
    objectFit: "cover",
    display: "block",
  },

  heroFloatingCard: {
    position: "absolute",
    left: 22,
    bottom: 22,
    padding: 20,
    borderRadius: 24,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(212,175,55,0.25)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#5f4513",
  },

  promoSection: {
    maxWidth: 1180,
    margin: "0 auto 24px",
    padding: 30,
    borderRadius: 34,
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "center",
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,249,232,0.78))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.10)",
  },

  promoBadge: {
    width: 140,
    height: 140,
    borderRadius: 34,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    boxShadow: "0 18px 42px rgba(166,124,0,0.24)",
  },

  sectionTag: {
    display: "block",
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(32px, 4vw, 46px)",
    color: "#2a1e0a",
    letterSpacing: -1.5,
  },

  sectionText: {
    maxWidth: 680,
    color: "#7b6a42",
    lineHeight: 1.7,
  },

  catalogHeader: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 22,
    flexWrap: "wrap",
  },

  filters: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  input: {
    minWidth: 220,
    padding: "13px 15px",
    borderRadius: 16,
    border: "1px solid rgba(166,124,0,0.22)",
    background: "#fffef9",
    color: "#2a1e0a",
    outline: "none",
    fontSize: 15,
  },

  refreshButton: {
    border: "none",
    borderRadius: 999,
    padding: "13px 18px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
  },

  warning: {
    maxWidth: 1180,
    margin: "0 auto 20px",
    padding: 18,
    borderRadius: 18,
    background: "rgba(212,175,55,0.12)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#5f4513",
  },

  grid: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 0 52px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },

  card: {
    overflow: "hidden",
    borderRadius: 32,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  imageBox: {
    position: "relative",
    height: 285,
    overflow: "hidden",
    background: "#f7f1df",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  discountTag: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: "9px 13px",
    borderRadius: 999,
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    boxShadow: "0 14px 32px rgba(166,124,0,0.24)",
  },

  cardContent: {
    padding: 22,
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },

  category: {
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  brandName: {
    color: "#9a8654",
    fontWeight: 800,
  },

  productName: {
    margin: "12px 0 10px",
    color: "#2a1e0a",
    fontSize: 25,
    letterSpacing: -0.8,
  },

  description: {
    color: "#7b6a42",
    lineHeight: 1.65,
    minHeight: 76,
  },

  promoInfo: {
    padding: 13,
    borderRadius: 18,
    marginBottom: 18,
    background: "rgba(212,175,55,0.10)",
    border: "1px solid rgba(212,175,55,0.20)",
    color: "#5f4513",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
  },

  priceArea: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 22,
  },

  oldPrice: {
    display: "block",
    color: "#9a8654",
    textDecoration: "line-through",
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 1,
  },

  price: {
    display: "block",
    color: "#2a1e0a",
    fontSize: 26,
    lineHeight: 1,
  },

  savingsLabel: {
    fontSize: 12,
    color: "#166534",
    fontWeight: 800,
    background: "rgba(34,197,94,0.12)",
    padding: "3px 8px",
    borderRadius: 8,
    whiteSpace: "nowrap",
    marginTop: 4,
  },

  buyButton: {
    width: "100%",
    border: "none",
    borderRadius: 999,
    padding: "15px 20px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 10px 25px rgba(166,124,0,0.15)",
    fontSize: 15,
  },

  contact: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "34px 24px 70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 22,
    flexWrap: "wrap",
  },
};