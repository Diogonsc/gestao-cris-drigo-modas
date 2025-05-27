import { Produto } from "../store";

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ProdutoService {
  private static instance: ProdutoService;
  private produtos: Produto[] = [];

  private constructor() {}

  static getInstance(): ProdutoService {
    if (!ProdutoService.instance) {
      ProdutoService.instance = new ProdutoService();
    }
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
    produto: Partial<Produto>
  ): Promise<Produto> {
    await delay(600);
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Produto não encontrado");
    }

    this.produtos[index] = {
      ...this.produtos[index],
      ...produto,
      ultimaAtualizacao: new Date(),
    };

    return this.produtos[index];
  }

  async removerProduto(id: string): Promise<void> {
    await delay(400);
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Produto não encontrado");
    }
    this.produtos.splice(index, 1);
  }

  async atualizarEstoque(
    id: string,
    quantidade: number,
    tipo: "entrada" | "saida"
  ): Promise<Produto> {
    await delay(400);
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Produto não encontrado");
    }

    const produto = this.produtos[index];
    const novoEstoque =
      tipo === "entrada"
        ? produto.estoque + quantidade
        : produto.estoque - quantidade;

    if (novoEstoque < 0) {
      throw new Error("Quantidade em estoque insuficiente");
    }

    this.produtos[index] = {
      ...produto,
      estoque: novoEstoque,
      ultimaAtualizacao: new Date(),
    };

    return this.produtos[index];
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
