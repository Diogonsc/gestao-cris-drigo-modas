import { Produto } from "../types";

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ProdutoService {
  private static instance = new ProdutoService();
  private produtos: Produto[] = [];

  private constructor() {
    // Inicializa com dados mockados
    this.produtos = [
      {
        id: "1",
        codigo: "P001",
        nome: "Camisa Básica",
        descricao: "Camisa básica de algodão",
        categoria: "Vestuário",
        precoCusto: 30,
        precoVenda: 59.9,
        margemLucro: 99.67,
        estoque: 50,
        estoqueMinimo: 10,
        unidade: "UN",
        codigoBarras: "7891234567890",
        status: "ativo",
        dataCadastro: new Date("2024-01-01"),
        ultimaAtualizacao: new Date("2024-01-01"),
      },
      {
        id: "2",
        codigo: "P002",
        nome: "Calça Jeans",
        descricao: "Calça jeans skinny",
        categoria: "Vestuário",
        precoCusto: 45,
        precoVenda: 89.9,
        margemLucro: 99.78,
        estoque: 30,
        estoqueMinimo: 5,
        unidade: "UN",
        codigoBarras: "7891234567891",
        status: "ativo",
        dataCadastro: new Date("2024-01-02"),
        ultimaAtualizacao: new Date("2024-01-02"),
      },
      {
        id: "3",
        codigo: "P003",
        nome: "Vestido Floral",
        descricao: "Vestido floral estampado",
        categoria: "Vestuário",
        precoCusto: 60,
        precoVenda: 119.9,
        margemLucro: 99.83,
        estoque: 20,
        estoqueMinimo: 3,
        unidade: "UN",
        codigoBarras: "7891234567892",
        status: "ativo",
        dataCadastro: new Date("2024-01-03"),
        ultimaAtualizacao: new Date("2024-01-03"),
      },
    ];
  }

  static getInstance(): ProdutoService {
    return ProdutoService.instance;
  }

  async listarProdutos(): Promise<Produto[]> {
    await delay(500);
    return this.produtos;
  }

  async buscarProdutoPorId(id: string): Promise<Produto | null> {
    await delay(300);
    const produto = this.produtos.find((p) => p.id === id);
    return produto || null;
  }

  async criarProduto(
    produto: Omit<Produto, "id" | "dataCadastro" | "ultimaAtualizacao">
  ): Promise<Produto> {
    await delay(800);
    const novoProduto: Produto = {
      ...produto,
      id: crypto.randomUUID(),
      dataCadastro: new Date(),
      ultimaAtualizacao: new Date(),
    };
    this.produtos.push(novoProduto);
    return novoProduto;
  }

  async atualizarProduto(
    id: string,
    produto: Partial<Omit<Produto, "id" | "dataCadastro" | "ultimaAtualizacao">>
  ): Promise<Produto | null> {
    await delay(800);
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const produtoAtualizado: Produto = {
      ...this.produtos[index],
      ...produto,
      ultimaAtualizacao: new Date(),
    };
    this.produtos[index] = produtoAtualizado;
    return produtoAtualizado;
  }

  async excluirProduto(id: string): Promise<boolean> {
    await delay(500);
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.produtos.splice(index, 1);
    return true;
  }

  async buscarProdutoPorCodigo(codigo: string): Promise<Produto | null> {
    await delay(300);
    const produto = this.produtos.find((p) => p.codigo === codigo);
    return produto || null;
  }

  async buscarProdutoPorCodigoBarras(
    codigoBarras: string
  ): Promise<Produto | null> {
    await delay(300);
    const produto = this.produtos.find((p) => p.codigoBarras === codigoBarras);
    return produto || null;
  }

  async buscarProdutosPorCategoria(categoria: string): Promise<Produto[]> {
    await delay(500);
    return this.produtos.filter((p) => p.categoria === categoria);
  }

  async atualizarEstoque(
    id: string,
    quantidade: number,
    tipo: "entrada" | "saida"
  ): Promise<Produto | null> {
    await delay(800);
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const produto = this.produtos[index];
    const novoEstoque =
      tipo === "entrada"
        ? produto.estoque + quantidade
        : produto.estoque - quantidade;

    if (novoEstoque < 0) return null;

    const produtoAtualizado: Produto = {
      ...produto,
      estoque: novoEstoque,
      ultimaAtualizacao: new Date(),
    };
    this.produtos[index] = produtoAtualizado;
    return produtoAtualizado;
  }

  async buscarProdutosPorNome(nome: string): Promise<Produto[]> {
    await delay(500);
    const termoBusca = nome.toLowerCase();
    return this.produtos.filter((p) =>
      p.nome.toLowerCase().includes(termoBusca)
    );
  }

  async listarProdutosComEstoqueBaixo(): Promise<Produto[]> {
    await delay(500);
    return this.produtos.filter(
      (p) => p.estoque <= p.estoqueMinimo && p.status === "ativo"
    );
  }
}
