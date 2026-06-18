export const API_URL = "http://localhost:8080";

export type ProdutoApi = {
  id?: number;
  idProduto?: number;
  nome: string;
  categoria: string;
  marca: string;
  preco: number;
  descricao: string;
  imagemUrl?: string | null;
  promocao?: {
    id?: number;
    nome?: string;
    desconto?: number;
    dataInicio?: string;
    dataFim?: string;
  } | null;
};

export type Produto = {
  id: number;
  nome: string;
  categoria: string;
  marca: string;
  preco: number;
  descricao: string;
  imagem: string;
  promocao?: {
    id?: number;
    nome?: string;
    desconto?: number;
    dataInicio?: string;
    dataFim?: string;
  } | null;
};

export type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
};

export type RelatorioApi = Record<string, unknown>;

export const imagensProdutos = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1629732047848-50219e9c5aef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
];

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function converterProdutoApi(produto: ProdutoApi, index: number): Produto {
  return {
    id: produto.idProduto ?? produto.id ?? index + 1,
    nome: produto.nome || "Produto sem nome",
    categoria: produto.categoria || "Sem categoria",
    marca: produto.marca || "Sem marca",
    preco: Number(produto.preco || 0),
    descricao: produto.descricao || "Produto cadastrado no sistema.",
    imagem: produto.imagemUrl || imagensProdutos[index % imagensProdutos.length],
    promocao: produto.promocao || null,
  };
}

export function formatarRelatorio(data: RelatorioApi): string {
  if (!data || Object.keys(data).length === 0) {
    return "Nenhum dado encontrado no relatório.";
  }

  return Object.entries(data)
    .map(([chave, valor]) => {
      const nomeCampo = chave
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (letra) => letra.toUpperCase());

      if (typeof valor === "number") {
        const chaveLower = chave.toLowerCase();

        if (
          chaveLower.includes("valor") ||
          chaveLower.includes("total") ||
          chaveLower.includes("preco") ||
          chaveLower.includes("preço") ||
          chaveLower.includes("ticket")
        ) {
          return `${nomeCampo}: ${formatarPreco(valor)}`;
        }

        return `${nomeCampo}: ${valor}`;
      }

      return `${nomeCampo}: ${String(valor)}`;
    })
    .join("\n");
}