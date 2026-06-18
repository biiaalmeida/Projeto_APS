import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR";

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  nivel: NivelAcesso;
};

type ProdutoApi = {
  id?: number;
  nome: string;
  categoria: string;
  marca: string;
  preco: number;
  descricao: string;
  imagemUrl?: string | null;
  administrador?: {
    id?: number;
  } | null;
  promocao?: {
    id?: number;
    nome?: string;
    desconto?: number;
    dataInicio?: string;
    dataFim?: string;
  } | null;
};

type PromocaoApi = {
  id?: number;
  nome?: string;
  desconto?: number;
  dataInicio?: string;
  dataFim?: string;
};

type GerenteApi = {
  id?: number;
  nome?: string;
  email?: string;
  promocoes?: PromocaoApi[];
};

type PromocaoForm = {
  produtoId: string;
  nome: string;
  desconto: string;
  dataInicio: string;
  dataFim: string;
};

export default function CadastroPromocao() {
  const navigate = useNavigate();

  const usuarioLogado: UsuarioLogado | null = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  const [form, setForm] = useState<PromocaoForm>({
    produtoId: "",
    nome: "",
    desconto: "",
    dataInicio: "",
    dataFim: "",
  });

  const [produtos, setProdutos] = useState<ProdutoApi[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setCarregandoProdutos(true);
      setErro("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos.");
      }

      const data: ProdutoApi[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API.");
      }

      setProdutos(data);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os produtos cadastrados.");
      setProdutos([]);
    } finally {
      setCarregandoProdutos(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limparFormulario() {
    setForm({
      produtoId: "",
      nome: "",
      desconto: "",
      dataInicio: "",
      dataFim: "",
    });
  }

  function buscarProdutoSelecionado() {
    return produtos.find((produto) => String(produto.id) === form.produtoId);
  }

  function encontrarPromocaoCriada(
    gerente: GerenteApi,
    nome: string,
    desconto: number
  ) {
    const promocoes = gerente.promocoes || [];

    if (promocoes.length === 0) {
      return null;
    }

    const promocaoEncontrada = [...promocoes]
      .reverse()
      .find(
        (promocao) =>
          promocao.nome === nome && Number(promocao.desconto) === desconto
      );

    return promocaoEncontrada || promocoes[promocoes.length - 1];
  }

  async function atrelarProdutoAPromocao(
    produto: ProdutoApi,
    promocaoId: number
  ) {
    const produtoRequest = {
      nome: produto.nome,
      categoria: produto.categoria,
      marca: produto.marca,
      preco: Number(produto.preco),
      descricao: produto.descricao,
      imagemUrl: produto.imagemUrl || null,
      administradorId: produto.administrador?.id || null,
      promocaoId: promocaoId,
    };

    const response = await fetch(`${API_URL}/produtos/${produto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produtoRequest),
    });

    if (!response.ok) {
      const respostaErro = await response.text();
      throw new Error(
        respostaErro || "Erro ao atrelar produto à promoção criada."
      );
    }

    return response.json();
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!usuarioLogado) {
      setErro("Você precisa estar logado para cadastrar uma promoção.");
      setMensagem("");
      navigate("/login");
      return;
    }

    if (usuarioLogado.nivel !== "GERENTE") {
      setErro("A promoção deve ser cadastrada por um gerente logado.");
      setMensagem("");
      return;
    }

    if (!usuarioLogado.id) {
      setErro("Não foi possível identificar o ID do gerente logado.");
      setMensagem("");
      return;
    }

    if (
      !form.produtoId ||
      !form.nome ||
      !form.desconto ||
      !form.dataInicio ||
      !form.dataFim
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    const produtoSelecionado = buscarProdutoSelecionado();

    if (!produtoSelecionado || !produtoSelecionado.id) {
      setErro("Produto selecionado inválido.");
      setMensagem("");
      return;
    }

    const descontoConvertido = Number(form.desconto);

    if (
      Number.isNaN(descontoConvertido) ||
      descontoConvertido <= 0 ||
      descontoConvertido > 100
    ) {
      setErro("Informe um desconto válido entre 1% e 100%.");
      setMensagem("");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const promocaoRequest = {
        nome: form.nome,
        desconto: descontoConvertido,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
      };

      const responsePromocao = await fetch(
        `${API_URL}/gerentes/${usuarioLogado.id}/promocoes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(promocaoRequest),
        }
      );

      if (!responsePromocao.ok) {
        const respostaErro = await responsePromocao.text();
        throw new Error(respostaErro || "Erro ao cadastrar promoção.");
      }

      const gerenteAtualizado: GerenteApi = await responsePromocao.json();

      const promocaoCriada = encontrarPromocaoCriada(
        gerenteAtualizado,
        form.nome,
        descontoConvertido
      );

      if (!promocaoCriada?.id) {
        throw new Error(
          "A promoção foi criada, mas não foi possível identificar o ID dela no retorno do back-end."
        );
      }

      await atrelarProdutoAPromocao(produtoSelecionado, promocaoCriada.id);

      setMensagem(
        `Promoção "${form.nome}" cadastrada e vinculada ao produto "${produtoSelecionado.nome}".`
      );

      limparFormulario();
      buscarProdutos();
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar a promoção e atrelar ao produto. Verifique se o produto possui administrador vinculado e se o back-end retorna a lista de promoções do gerente."
      );
    } finally {
      setCarregando(false);
    }
  }

  const produtoSelecionado = buscarProdutoSelecionado();
  const descontoNum = Number(form.desconto) || 0;
  const precoOriginal = produtoSelecionado?.preco || 0;
  const precoComDesconto = precoOriginal - (precoOriginal * descontoNum / 100);

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={produtoSelecionado?.imagemUrl ? styles.leftPanelImage : styles.leftPanel}>
          <div style={styles.brandAreaOverlay}>
            <div style={styles.logo}>%</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Gold</h1>
              <p style={styles.brandSubtitle}>promoções & campanhas</p>
            </div>
          </div>

          {!produtoSelecionado?.imagemUrl && (
            <div style={styles.emptyState}>
              <span style={styles.tag}>Cadastro de promoção</span>
              <h2 style={styles.heroTitle}>
                Crie descontos e vincule diretamente a um produto.
              </h2>
            </div>
          )}

          {produtoSelecionado?.imagemUrl && (
            <img
              src={produtoSelecionado.imagemUrl}
              alt="Preview"
              style={styles.fullImage}
            />
          )}

          <div style={styles.infoBoxOverlay}>
            <strong>Gerente:</strong>
            <p>{usuarioLogado?.nome || "Indisponível"}</p>
          </div>
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Nova promoção</h2>
              <p style={styles.formSubtitle}>
                Escolha o produto, informe o desconto e o período da campanha.
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

          <label style={styles.label}>Produto da promoção</label>
          <select
            style={styles.input}
            name="produtoId"
            value={form.produtoId}
            onChange={handleChange}
            disabled={carregandoProdutos}
          >
            <option value="">
              {carregandoProdutos
                ? "Carregando produtos..."
                : "Selecione um produto"}
            </option>

            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} — {produto.marca} — R$ {Number(produto.preco).toFixed(2)}
              </option>
            ))}
          </select>

          <label style={styles.label}>Nome da promoção</label>
          <input
            style={styles.input}
            name="nome"
            placeholder="Ex: Gold Week"
            value={form.nome}
            onChange={handleChange}
          />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Desconto (%)</label>
              <input
                style={styles.input}
                name="desconto"
                type="number"
                min="1"
                max="100"
                placeholder="Ex: 15"
                value={form.desconto}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Gerente responsável</label>
              <input
                style={styles.input}
                value={usuarioLogado?.nome || "Gerente não identificado"}
                disabled
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Data de início</label>
              <input
                style={styles.input}
                name="dataInicio"
                type="date"
                value={form.dataInicio}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Data de fim</label>
              <input
                style={styles.input}
                name="dataFim"
                type="date"
                value={form.dataFim}
                onChange={handleChange}
              />
            </div>
          </div>

          {produtoSelecionado && (
            <div style={styles.previewCard}>
              <span style={styles.previewLabel}>Resumo de Preços</span>

              <div style={styles.previewContent}>
                <div>
                  <strong style={styles.previewTitle}>
                    {produtoSelecionado.nome}
                  </strong>

                  <p style={{ ...styles.previewText, color: '#9a8654' }}>
                    Preço Original: <s>R$ {precoOriginal.toFixed(2)}</s>
                  </p>

                  <p style={{ ...styles.previewText, color: '#166534', fontSize: 18, fontWeight: 800 }}>
                    Preço com Desconto: R$ {precoComDesconto.toFixed(2)}
                  </p>
                </div>

                <div style={styles.discountBadge}>
                  <strong>{form.desconto || "0"}%</strong>
                  <small>OFF</small>
                </div>
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => navigate("/produtos/cadastrar")}
            >
              Cadastrar produto
            </button>

            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar e vincular promoção"}
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
    minHeight: 630,
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
      "linear-gradient(135deg, rgba(43,31,9,0.78), rgba(166,124,0,0.46)), url('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1400&q=90') center/cover",
    color: "#fffaf0",
    position: "relative",
  },

  leftPanelImage: {
    padding: 46,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#000",
    color: "#fffaf0",
    position: "relative",
    overflow: "hidden",
  },

  brandAreaOverlay: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    position: "relative",
    zIndex: 10,
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
  },

  infoBoxOverlay: {
    padding: 18,
    borderRadius: 24,
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    maxWidth: 340,
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 10,
  },

  emptyState: {
    position: "relative",
    zIndex: 10,
  },

  fullImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
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
    maxWidth: 360,
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
    justifyContent: "space-between",
    gap: 18,
  },

  previewTitle: {
    display: "block",
    fontSize: 22,
    color: "#2a1e0a",
    marginBottom: 5,
  },

  previewText: {
    margin: "3px 0",
    color: "#7b6a42",
    fontSize: 13,
  },

  discountBadge: {
    width: 94,
    height: 94,
    minWidth: 94,
    borderRadius: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    boxShadow: "0 16px 36px rgba(166,124,0,0.24)",
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
