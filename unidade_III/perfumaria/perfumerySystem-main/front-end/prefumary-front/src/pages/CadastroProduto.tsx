import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type ProdutoForm = {
  nome: string;
  marca: string;
  categoria: string;
  preco: string;
  descricao: string;
  imagemUrl: string;
};

export default function CadastroProduto() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  const [form, setForm] = useState<ProdutoForm>({
    nome: "",
    marca: "",
    categoria: "",
    preco: "",
    descricao: "",
    imagemUrl: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limparFormulario() {
    setForm({
      nome: "",
      marca: "",
      categoria: "",
      preco: "",
      descricao: "",
      imagemUrl: "",
    });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!usuarioLogado || !usuarioLogado.id) {
      setErro("Sessão expirada. Faça login novamente.");
      return;
    }

    if (
      !form.nome ||
      !form.marca ||
      !form.categoria ||
      !form.preco ||
      !form.descricao
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    const precoConvertido = Number(
      form.preco.replace(",", ".").replace(/[^\d.]/g, "")
    );

    if (Number.isNaN(precoConvertido) || precoConvertido <= 0) {
      setErro("Informe um preço válido.");
      setMensagem("");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const produtoRequest = {
        nome: form.nome,
        categoria: form.categoria,
        marca: form.marca,
        preco: precoConvertido,
        descricao: form.descricao,
        administradorId: usuarioLogado.id,
        imagemUrl: form.imagemUrl,
      };

      const response = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoRequest),
      });

      if (!response.ok) {
        const respostaErro = await response.text();
        throw new Error(respostaErro || "Erro ao cadastrar produto.");
      }

      setMensagem(`Produto "${form.nome}" cadastrado com sucesso!`);
      limparFormulario();
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar o produto. Verifique a conexão com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={form.imagemUrl ? styles.leftPanelImage : styles.leftPanel}>
          <div style={styles.brandAreaOverlay}>
            <div style={styles.logo}>A</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Gold</h1>
              <p style={styles.brandSubtitle}>produtos & catálogo</p>
            </div>
          </div>

          {!form.imagemUrl && (
            <div style={styles.emptyState}>
              <span style={styles.tag}>Cadastro de produto</span>
              <h2 style={styles.heroTitle}>
                Adicione novos itens ao catálogo da perfumaria.
              </h2>
            </div>
          )}

          {form.imagemUrl && (
            <img
              src={form.imagemUrl}
              alt="Preview"
              style={styles.fullImage}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/600x800?text=Imagem+não+encontrada";
              }}
            />
          )}

          <div style={styles.infoBoxOverlay}>
            <strong>Responsável:</strong>
            <p>{usuarioLogado?.nome || "Indisponível"}</p>
          </div>
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Novo produto</h2>
              <p style={styles.formSubtitle}>
                Preencha as informações comerciais do item.
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

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Nome do produto</label>
              <input
                style={styles.input}
                name="nome"
                placeholder="Ex: Blue Essence"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Marca</label>
              <input
                style={styles.input}
                name="marca"
                placeholder="Ex: Aura Gold"
                value={form.marca}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Categoria</label>
              <select
                style={styles.input}
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecionar categoria</option>
                <option value="Perfume">Perfume</option>
                <option value="Perfume Feminino">Perfume Feminino</option>
                <option value="Perfume Masculino">Perfume Masculino</option>
                <option value="Perfume Unissex">Perfume Unissex</option>
                <option value="Body Splash">Body Splash</option>
                <option value="Hidratante">Hidratante</option>
                <option value="Skincare">Skincare</option>
                <option value="Kit Presente">Kit Presente</option>
              </select>
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Preço</label>
              <input
                style={styles.input}
                name="preco"
                placeholder="Ex: 199.90"
                value={form.preco}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>URL da Imagem</label>
              <input
                style={styles.input}
                name="imagemUrl"
                placeholder="https://exemplo.com/foto.jpg"
                value={form.imagemUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={styles.label}>Descrição</label>
          <textarea
            style={styles.textarea}
            name="descricao"
            placeholder="Descreva a fragrância, textura, proposta ou composição do produto..."
            value={form.descricao}
            onChange={handleChange}
          />

          <div style={styles.previewCard}>
            <span style={styles.previewLabel}>Prévia do produto</span>

            <div style={styles.previewContent}>
              <div>
                <strong style={styles.previewTitle}>
                  {form.nome || "Nome do produto"}
                </strong>

                <p style={styles.previewText}>
                  {form.categoria || "Categoria"} · {form.marca || "Marca"}
                </p>

                <p style={styles.previewDescription}>
                  {form.descricao || "A descrição do produto aparecerá aqui."}
                </p>
              </div>

              <div style={styles.priceBadge}>
                {form.preco ? `R$ ${form.preco}` : "R$ 0,00"}
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => navigate("/produtos")}
            >
              Ver produtos
            </button>

            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar produto"}
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
    maxWidth: 1080,
    minHeight: 650,
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
      "linear-gradient(135deg, rgba(43,31,9,0.78), rgba(166,124,0,0.44)), url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=90') center/cover",
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

  imageDropZone: {
    width: "100%",
    height: 320,
    borderRadius: 24,
    background: "rgba(255,255,255,0.12)",
    border: "2px dashed rgba(255,244,198,0.30)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 20,
  },

  imagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  dropZonePlaceholder: {
    textAlign: "center",
    color: "#fff0bd",
    display: "flex",
    flexDirection: "column",
    gap: 10,
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
    fontSize: "clamp(38px, 5vw, 58px)",
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

  textarea: {
    width: "100%",
    height: 104,
    resize: "none",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(166,124,0,0.22)",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box",
    background: "#fffef9",
    color: "#2a1e0a",
    fontFamily: "inherit",
    lineHeight: 1.5,
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
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
  },

  previewTitle: {
    display: "block",
    fontSize: 22,
    color: "#2a1e0a",
    marginBottom: 5,
  },

  previewText: {
    margin: 0,
    color: "#7b6a42",
    fontSize: 13,
  },

  previewDescription: {
    margin: "7px 0 0",
    color: "#9a8654",
    fontSize: 13,
    lineHeight: 1.5,
  },

  priceBadge: {
    minWidth: 110,
    padding: "14px 16px",
    borderRadius: 22,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    boxShadow: "0 16px 36px rgba(166,124,0,0.24)",
    textAlign: "center",
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