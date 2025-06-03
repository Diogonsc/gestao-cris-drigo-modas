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
  {
    id: "1",
    produto: produtos[0],
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
    produto: produtos[1],
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
  {
    id: "3",
    produto: produtos[2],
    tipo: "entrada",
    quantidade: 20,
    data: new Date("2024-01-03"),
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
    id: "4",
    produto: produtos[0],
    tipo: "saida",
    quantidade: 2,
    data: new Date("2024-03-20"),
    motivo: "Venda",
    usuario: {
      id: "1",
      name: "Admin",
      email: "admin@crisdrigo.com.br",
      role: "admin",
      permissions: ["*"],
    },
  },
];

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

// Exporta todos os handlers
export const handlers = [
  ...produtoHandlers,
  ...clienteHandlers,
  ...vendaHandlers,
  ...financeiroHandlers,
  ...cupomFiscalHandlers,
  ...estoqueHandlers,
];
