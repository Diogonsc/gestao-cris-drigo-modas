import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import {
  User,
  Produto,
  Cliente,
  Venda,
  TransacaoFinanceira,
  CupomFiscal,
  MovimentacaoEstoque,
} from "../store";

// Dados mockados iniciais
let produtos: Produto[] = [
  {
    id: "1",
    codigo: "P001",
    nome: "Camisa Básica",
    descricao: "Camisa básica de algodão",
    categoria: "Camisetas",
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
    categoria: "Calças",
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
    categoria: "Vestidos",
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
  {
    id: "4",
    codigo: "P004",
    nome: "Blusa de Frio",
    descricao: "Blusa de frio com capuz",
    categoria: "Blusas",
    precoCusto: 55,
    precoVenda: 99.9,
    margemLucro: 81.64,
    estoque: 15,
    estoqueMinimo: 5,
    unidade: "UN",
    codigoBarras: "7891234567893",
    status: "ativo",
    dataCadastro: new Date("2024-01-04"),
    ultimaAtualizacao: new Date("2024-01-04"),
  },
  {
    id: "5",
    codigo: "P005",
    nome: "Short Jeans",
    descricao: "Short jeans desfiado",
    categoria: "Shorts",
    precoCusto: 35,
    precoVenda: 69.9,
    margemLucro: 99.71,
    estoque: 25,
    estoqueMinimo: 8,
    unidade: "UN",
    codigoBarras: "7891234567894",
    status: "ativo",
    dataCadastro: new Date("2024-01-05"),
    ultimaAtualizacao: new Date("2024-01-05"),
  },
  {
    id: "6",
    codigo: "P006",
    nome: "Saia Midi",
    descricao: "Saia midi plissada",
    categoria: "Saias",
    precoCusto: 40,
    precoVenda: 79.9,
    margemLucro: 99.75,
    estoque: 18,
    estoqueMinimo: 5,
    unidade: "UN",
    codigoBarras: "7891234567895",
    status: "ativo",
    dataCadastro: new Date("2024-01-06"),
    ultimaAtualizacao: new Date("2024-01-06"),
  },
  {
    id: "7",
    codigo: "P007",
    nome: "Blazer Social",
    descricao: "Blazer social slim fit",
    categoria: "Blazers",
    precoCusto: 80,
    precoVenda: 159.9,
    margemLucro: 99.88,
    estoque: 12,
    estoqueMinimo: 3,
    unidade: "UN",
    codigoBarras: "7891234567896",
    status: "ativo",
    dataCadastro: new Date("2024-01-07"),
    ultimaAtualizacao: new Date("2024-01-07"),
  },
  {
    id: "8",
    codigo: "P008",
    nome: "Legging Fitness",
    descricao: "Legging fitness alta compressão",
    categoria: "Fitness",
    precoCusto: 45,
    precoVenda: 89.9,
    margemLucro: 99.78,
    estoque: 35,
    estoqueMinimo: 10,
    unidade: "UN",
    codigoBarras: "7891234567897",
    status: "ativo",
    dataCadastro: new Date("2024-01-08"),
    ultimaAtualizacao: new Date("2024-01-08"),
  },
  {
    id: "9",
    codigo: "P009",
    nome: "Top Esportivo",
    descricao: "Top esportivo com suporte",
    categoria: "Fitness",
    precoCusto: 25,
    precoVenda: 49.9,
    margemLucro: 99.6,
    estoque: 40,
    estoqueMinimo: 12,
    unidade: "UN",
    codigoBarras: "7891234567898",
    status: "ativo",
    dataCadastro: new Date("2024-01-09"),
    ultimaAtualizacao: new Date("2024-01-09"),
  },
  {
    id: "10",
    codigo: "P010",
    nome: "Conjunto Pijama",
    descricao: "Conjunto pijama algodão",
    categoria: "Pijamas",
    precoCusto: 50,
    precoVenda: 99.9,
    margemLucro: 99.8,
    estoque: 22,
    estoqueMinimo: 6,
    unidade: "UN",
    codigoBarras: "7891234567899",
    status: "ativo",
    dataCadastro: new Date("2024-01-10"),
    ultimaAtualizacao: new Date("2024-01-10"),
  },
  {
    id: "11",
    codigo: "P011",
    nome: "Bermuda Cargo",
    descricao: "Bermuda cargo masculina",
    categoria: "Bermudas",
    precoCusto: 40,
    precoVenda: 79.9,
    margemLucro: 99.75,
    estoque: 28,
    estoqueMinimo: 8,
    unidade: "UN",
    codigoBarras: "7891234567900",
    status: "ativo",
    dataCadastro: new Date("2024-01-11"),
    ultimaAtualizacao: new Date("2024-01-11"),
  },
  {
    id: "12",
    codigo: "P012",
    nome: "Macacão Jeans",
    descricao: "Macacão jeans com alça",
    categoria: "Macacões",
    precoCusto: 65,
    precoVenda: 129.9,
    margemLucro: 99.85,
    estoque: 15,
    estoqueMinimo: 4,
    unidade: "UN",
    codigoBarras: "7891234567901",
    status: "ativo",
    dataCadastro: new Date("2024-01-12"),
    ultimaAtualizacao: new Date("2024-01-12"),
  },
];

let clientes: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
    endereco: {
      logradouro: "Rua A",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    dataCadastro: new Date("2024-01-01"),
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    cpf: "987.654.321-00",
    email: "maria@email.com",
    telefone: "(11) 98888-8888",
    endereco: {
      logradouro: "Rua B",
      numero: "456",
      bairro: "Jardim",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890",
    },
    dataCadastro: new Date("2024-01-02"),
    status: "ativo",
  },
  {
    id: "3",
    nome: "Pedro Santos",
    cpf: "456.789.123-00",
    email: "pedro@email.com",
    telefone: "(11) 97777-7777",
    endereco: {
      logradouro: "Rua C",
      numero: "789",
      bairro: "Vila Nova",
      cidade: "São Paulo",
      estado: "SP",
      cep: "07890-123",
    },
    dataCadastro: new Date("2024-01-03"),
    status: "ativo",
  },
];

const vendas: Venda[] = [
  {
    id: "1",
    numero: "001",
    data: "2024-03-20",
    cliente: {
      id: "1",
      nome: "João Silva",
      cpf: "123.456.789-00",
    },
    produtos: [
      {
        produto: produtos[0],
        quantidade: 2,
        valorUnitario: 59.9,
        valorTotal: 119.8,
      },
    ],
    total: 119.8,
    valorPago: 119.8,
    formaPagamento: "dinheiro",
    status: "concluida",
  },
  {
    id: "2",
    numero: "002",
    data: "2024-03-21",
    cliente: {
      id: "2",
      nome: "Maria Oliveira",
      cpf: "987.654.321-00",
    },
    produtos: [
      {
        produto: produtos[1],
        quantidade: 1,
        valorUnitario: 89.9,
        valorTotal: 89.9,
      },
      {
        produto: produtos[2],
        quantidade: 1,
        valorUnitario: 119.9,
        valorTotal: 119.9,
      },
    ],
    total: 209.8,
    valorPago: 209.8,
    formaPagamento: "cartao_credito",
    status: "concluida",
  },
];

const transacoes: TransacaoFinanceira[] = [
  {
    id: "1",
    data: new Date("2024-03-20"),
    tipo: "receita",
    categoria: "Vendas",
    descricao: "Venda de camisas",
    valor: 119.8,
    formaPagamento: "dinheiro",
    status: "concluida",
    usuario: {
      id: "1",
      name: "Admin",
      email: "crisdrigo@gmail.com",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "2",
    data: new Date("2024-03-21"),
    tipo: "receita",
    categoria: "Vendas",
    descricao: "Venda de calça e vestido",
    valor: 209.8,
    formaPagamento: "cartao_credito",
    status: "concluida",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "3",
    data: new Date("2024-03-22"),
    tipo: "despesa",
    categoria: "Fornecedores",
    descricao: "Compra de estoque",
    valor: 135.0,
    formaPagamento: "pix",
    status: "concluida",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
];

const cupons: CupomFiscal[] = [
  {
    id: "1",
    numero: "001",
    dataEmissao: new Date("2024-03-20"),
    cliente: {
      nome: "João Silva",
      cpf: "123.456.789-00",
      endereco: "Rua A, 123 - Centro, São Paulo - SP",
    },
    itens: [
      {
        codigo: "P001",
        descricao: "Camisa Básica",
        quantidade: 2,
        valorUnitario: 59.9,
        valorTotal: 119.8,
      },
    ],
    valorTotal: 119.8,
    formaPagamento: "dinheiro",
    status: "emitido",
  },
  {
    id: "2",
    numero: "002",
    dataEmissao: new Date("2024-03-21"),
    cliente: {
      nome: "Maria Oliveira",
      cpf: "987.654.321-00",
      endereco: "Rua B, 456 - Jardim, São Paulo - SP",
    },
    itens: [
      {
        codigo: "P002",
        descricao: "Calça Jeans",
        quantidade: 1,
        valorUnitario: 89.9,
        valorTotal: 89.9,
      },
      {
        codigo: "P003",
        descricao: "Vestido Floral",
        quantidade: 1,
        valorUnitario: 119.9,
        valorTotal: 119.9,
      },
    ],
    valorTotal: 209.8,
    formaPagamento: "cartao_credito",
    status: "emitido",
  },
];

const movimentacoes: MovimentacaoEstoque[] = [
  // Entradas iniciais
  {
    id: "1",
    produto: produtos[0], // Camisa Básica
    tipo: "entrada",
    quantidade: 50,
    data: new Date("2024-01-01"),
    motivo: "Entrada inicial",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "2",
    produto: produtos[1], // Calça Jeans
    tipo: "entrada",
    quantidade: 30,
    data: new Date("2024-01-02"),
    motivo: "Entrada inicial",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  // Saídas por vendas
  {
    id: "3",
    produto: produtos[0], // Camisa Básica
    tipo: "saida",
    quantidade: 2,
    data: new Date("2024-03-20"),
    motivo: "Venda #001",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "4",
    produto: produtos[1], // Calça Jeans
    tipo: "saida",
    quantidade: 1,
    data: new Date("2024-03-21"),
    motivo: "Venda #002",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "5",
    produto: produtos[2], // Vestido Floral
    tipo: "saida",
    quantidade: 1,
    data: new Date("2024-03-21"),
    motivo: "Venda #002",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  // Novas entradas
  {
    id: "6",
    produto: produtos[3], // Blusa de Frio
    tipo: "entrada",
    quantidade: 15,
    data: new Date("2024-03-22"),
    motivo: "Reposição de estoque",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "7",
    produto: produtos[4], // Short Jeans
    tipo: "entrada",
    quantidade: 25,
    data: new Date("2024-03-22"),
    motivo: "Reposição de estoque",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  // Ajustes de estoque
  {
    id: "8",
    produto: produtos[0], // Camisa Básica
    tipo: "ajuste",
    quantidade: -1,
    data: new Date("2024-03-23"),
    motivo: "Ajuste de inventário - Produto com defeito",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "9",
    produto: produtos[5], // Saia Midi
    tipo: "entrada",
    quantidade: 18,
    data: new Date("2024-03-24"),
    motivo: "Nova coleção",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "10",
    produto: produtos[6], // Blazer Social
    tipo: "entrada",
    quantidade: 12,
    data: new Date("2024-03-24"),
    motivo: "Nova coleção",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  // Saídas recentes
  {
    id: "11",
    produto: produtos[7], // Legging Fitness
    tipo: "saida",
    quantidade: 5,
    data: new Date("2024-03-25"),
    motivo: "Venda #003",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "12",
    produto: produtos[8], // Top Esportivo
    tipo: "saida",
    quantidade: 3,
    data: new Date("2024-03-25"),
    motivo: "Venda #003",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  // Transferências entre lojas
  {
    id: "13",
    produto: produtos[9], // Conjunto Pijama
    tipo: "transferencia",
    quantidade: 5,
    data: new Date("2024-03-26"),
    motivo: "Transferência para loja 2",
    origem: "Loja Principal",
    destino: "Loja 2",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "14",
    produto: produtos[10], // Bermuda Cargo
    tipo: "transferencia",
    quantidade: 8,
    data: new Date("2024-03-26"),
    motivo: "Transferência para loja 2",
    origem: "Loja Principal",
    destino: "Loja 2",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  // Últimas movimentações
  {
    id: "15",
    produto: produtos[11], // Macacão Jeans
    tipo: "entrada",
    quantidade: 15,
    data: new Date("2024-03-27"),
    motivo: "Reposição de estoque",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
  {
    id: "16",
    produto: produtos[0], // Camisa Básica
    tipo: "saida",
    quantidade: 3,
    data: new Date("2024-03-27"),
    motivo: "Venda #004",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
];

// Dados mockados para configurações
const configuracoes = {
  tema: "dark",
  corPrimaria: "#2563eb",
  corSecundaria: "#4f46e5",
  corAcentuacao: "#7c3aed",
  corSucesso: "#16a34a",
  corErro: "#dc2626",
  corAlerta: "#d97706",
  corInfo: "#0284c7",
  fontePrincipal: "Inter",
  tamanhoFonte: "medium",
  arredondamento: "medium",
  densidade: "comfortable",
  animacoes: true,
  notificacoes: true,
  backupAutomatico: true,
  intervaloBackup: "diario",
  ultimoBackup: new Date().toISOString(),
  versao: "1.0.0",
};

// Handlers para Produtos
export const produtoHandlers = [
  // Listar produtos
  http.get("/api/produtos", () => {
    return HttpResponse.json(produtos);
  }),

  // Buscar produto por ID
  http.get("/api/produtos/:id", ({ params }) => {
    const produto = produtos.find((p) => p.id === params.id);
    if (!produto) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(produto);
  }),

  // Criar produto
  http.post("/api/produtos", async ({ request }) => {
    const novoProduto = (await request.json()) as Omit<
      Produto,
      "id" | "dataCadastro" | "ultimaAtualizacao"
    >;
    const produto: Produto = {
      ...novoProduto,
      id: uuidv4(),
      dataCadastro: new Date(),
      ultimaAtualizacao: new Date(),
    };
    produtos.push(produto);
    return HttpResponse.json(produto, { status: 201 });
  }),

  // Atualizar produto
  http.put("/api/produtos/:id", async ({ params, request }) => {
    const atualizacao = (await request.json()) as Partial<
      Omit<Produto, "id" | "dataCadastro" | "ultimaAtualizacao">
    >;
    const index = produtos.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    produtos[index] = {
      ...produtos[index],
      ...atualizacao,
      ultimaAtualizacao: new Date(),
    };
    return HttpResponse.json(produtos[index]);
  }),

  // Excluir produto
  http.delete("/api/produtos/:id", ({ params }) => {
    const index = produtos.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    produtos = produtos.filter((p) => p.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];

// Handlers para Clientes
export const clienteHandlers = [
  // Listar clientes
  http.get("/api/clientes", () => {
    return HttpResponse.json(clientes);
  }),

  // Buscar cliente por ID
  http.get("/api/clientes/:id", ({ params }) => {
    const cliente = clientes.find((c) => c.id === params.id);
    if (!cliente) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(cliente);
  }),

  // Criar cliente
  http.post("/api/clientes", async ({ request }) => {
    const novoCliente = (await request.json()) as Omit<
      Cliente,
      "id" | "dataCadastro"
    >;
    const cliente: Cliente = {
      ...novoCliente,
      id: uuidv4(),
      dataCadastro: new Date(),
    };
    clientes.push(cliente);
    return HttpResponse.json(cliente, { status: 201 });
  }),

  // Atualizar cliente
  http.put("/api/clientes/:id", async ({ params, request }) => {
    const atualizacao = (await request.json()) as Partial<
      Omit<Cliente, "id" | "dataCadastro">
    >;
    const index = clientes.findIndex((c) => c.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    clientes[index] = { ...clientes[index], ...atualizacao };
    return HttpResponse.json(clientes[index]);
  }),

  // Excluir cliente
  http.delete("/api/clientes/:id", ({ params }) => {
    const index = clientes.findIndex((c) => c.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    clientes = clientes.filter((c) => c.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];

// Handlers para Vendas
export const vendaHandlers = [
  // Listar vendas
  http.get("/api/vendas", () => {
    console.log("MSW: Interceptando requisição GET /api/vendas");
    console.log("MSW: Retornando vendas:", vendas);
    return HttpResponse.json(vendas);
  }),

  // Buscar venda por ID
  http.get("/api/vendas/:id", ({ params }) => {
    const venda = vendas.find((v) => v.id === params.id);
    if (!venda) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(venda);
  }),

  // Criar venda
  http.post("/api/vendas", async ({ request }) => {
    const novaVenda = (await request.json()) as Omit<Venda, "id" | "numero">;
    const venda: Venda = {
      ...novaVenda,
      id: uuidv4(),
      numero: (vendas.length + 1).toString().padStart(3, "0"),
    };
    vendas.push(venda);
    return HttpResponse.json(venda, { status: 201 });
  }),

  // Cancelar venda
  http.post("/api/vendas/:id/cancelar", ({ params }) => {
    const index = vendas.findIndex((v) => v.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    vendas[index] = { ...vendas[index], status: "cancelada" };
    return HttpResponse.json(vendas[index]);
  }),
];

// Handlers para Financeiro
export const financeiroHandlers = [
  // Listar transações
  http.get("/api/financeiro/transacoes", () => {
    return HttpResponse.json(transacoes);
  }),

  // Buscar transação por ID
  http.get("/api/financeiro/transacoes/:id", ({ params }) => {
    const transacao = transacoes.find((t) => t.id === params.id);
    if (!transacao) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(transacao);
  }),

  // Criar transação
  http.post("/api/financeiro/transacoes", async ({ request }) => {
    const novaTransacao = (await request.json()) as Omit<
      TransacaoFinanceira,
      "id" | "data"
    >;
    const transacao: TransacaoFinanceira = {
      ...novaTransacao,
      id: uuidv4(),
      data: new Date(),
    };
    transacoes.push(transacao);
    return HttpResponse.json(transacao, { status: 201 });
  }),

  // Atualizar transação
  http.put("/api/financeiro/transacoes/:id", async ({ params, request }) => {
    const atualizacao = (await request.json()) as Partial<
      Omit<TransacaoFinanceira, "id" | "data">
    >;
    const index = transacoes.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    transacoes[index] = { ...transacoes[index], ...atualizacao };
    return HttpResponse.json(transacoes[index]);
  }),

  // Cancelar transação
  http.post("/api/financeiro/transacoes/:id/cancelar", ({ params }) => {
    const index = transacoes.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    transacoes[index] = { ...transacoes[index], status: "cancelada" };
    return HttpResponse.json(transacoes[index]);
  }),
];

// Handlers para Cupom Fiscal
export const cupomFiscalHandlers = [
  // Listar cupons
  http.get("/api/cupons", () => {
    return HttpResponse.json(cupons);
  }),

  // Buscar cupom por ID
  http.get("/api/cupons/:id", ({ params }) => {
    const cupom = cupons.find((c) => c.id === params.id);
    if (!cupom) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(cupom);
  }),

  // Criar cupom
  http.post("/api/cupons", async ({ request }) => {
    const novoCupom = (await request.json()) as Omit<
      CupomFiscal,
      "id" | "numero" | "dataEmissao"
    >;
    const cupom: CupomFiscal = {
      ...novoCupom,
      id: uuidv4(),
      numero: (cupons.length + 1).toString().padStart(3, "0"),
      dataEmissao: new Date(),
    };
    cupons.push(cupom);
    return HttpResponse.json(cupom, { status: 201 });
  }),

  // Cancelar cupom
  http.post("/api/cupons/:id/cancelar", ({ params }) => {
    const index = cupons.findIndex((c) => c.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    cupons[index] = { ...cupons[index], status: "cancelado" };
    return HttpResponse.json(cupons[index]);
  }),
];

// Handlers para Estoque
export const estoqueHandlers = [
  // Listar movimentações
  http.get("/api/estoque/movimentacoes", () => {
    return HttpResponse.json(movimentacoes);
  }),

  // Buscar movimentação por ID
  http.get("/api/estoque/movimentacoes/:id", ({ params }) => {
    const movimentacao = movimentacoes.find((m) => m.id === params.id);
    if (!movimentacao) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(movimentacao);
  }),

  // Criar movimentação
  http.post("/api/estoque/movimentacoes", async ({ request }) => {
    const novaMovimentacao = (await request.json()) as Omit<
      MovimentacaoEstoque,
      "id" | "data"
    >;
    const movimentacao: MovimentacaoEstoque = {
      ...novaMovimentacao,
      id: uuidv4(),
      data: new Date(),
    };
    movimentacoes.push(movimentacao);
    return HttpResponse.json(movimentacao, { status: 201 });
  }),
];

// Handlers para Configurações
export const configuracoesHandlers = [
  // Buscar configurações
  http.get("/api/configuracoes", () => {
    console.log("MSW: Interceptando requisição GET /api/configuracoes");
    console.log("MSW: Retornando configurações:", configuracoes);
    return HttpResponse.json(configuracoes);
  }),

  // Atualizar configurações
  http.put("/api/configuracoes", async ({ request }) => {
    console.log("MSW: Interceptando requisição PUT /api/configuracoes");
    const atualizacao = await request.json();
    Object.assign(configuracoes, atualizacao);
    console.log("MSW: Configurações atualizadas:", configuracoes);
    return HttpResponse.json(configuracoes);
  }),

  // Resetar configurações
  http.post("/api/configuracoes/resetar", () => {
    console.log(
      "MSW: Interceptando requisição POST /api/configuracoes/resetar"
    );
    Object.assign(configuracoes, {
      tema: "dark",
      corPrimaria: "#2563eb",
      corSecundaria: "#4f46e5",
      corAcentuacao: "#7c3aed",
      corSucesso: "#16a34a",
      corErro: "#dc2626",
      corAlerta: "#d97706",
      corInfo: "#0284c7",
      fontePrincipal: "Inter",
      tamanhoFonte: "medium",
      arredondamento: "medium",
      densidade: "comfortable",
      animacoes: true,
      notificacoes: true,
      backupAutomatico: true,
      intervaloBackup: "diario",
      ultimoBackup: new Date().toISOString(),
      versao: "1.0.0",
    });
    console.log("MSW: Configurações resetadas:", configuracoes);
    return HttpResponse.json(configuracoes);
  }),
];

// Exporta todos os handlers
export const handlers = [
  ...produtoHandlers,
  ...clienteHandlers,
  ...vendaHandlers,
  ...financeiroHandlers,
  ...cupomFiscalHandlers,
  ...estoqueHandlers,
  ...configuracoesHandlers,
];
