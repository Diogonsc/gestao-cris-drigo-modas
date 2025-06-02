import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface CupomFiscalState {
  cupons: CupomFiscal[];
  cupomAtual: CupomFiscal | null;
  adicionarCupom: (cupom: CupomFiscal) => void;
  atualizarCupom: (id: string, cupom: Partial<CupomFiscal>) => void;
  removerCupom: (id: string) => void;
  setCupomAtual: (cupom: CupomFiscal | null) => void;
}

export interface CupomFiscal {
  id: string;
  numero: string;
  dataEmissao: Date;
  cliente: {
    nome: string;
    cpf: string;
    endereco: string;
  };
  itens: Array<{
    codigo: string;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
  valorTotal: number;
  formaPagamento: string;
  status: "pendente" | "emitido" | "cancelado";
  xml?: string;
  pdf?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCadastro: Date;
  status: "ativo" | "inativo";
}

export interface ClienteState {
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  isLoading: boolean;
  error: string | null;
  adicionarCliente: (cliente: Omit<Cliente, "id" | "dataCadastro">) => void;
  atualizarCliente: (id: string, cliente: Partial<Cliente>) => void;
  removerCliente: (id: string) => void;
  setClienteAtual: (cliente: Cliente | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchClientes: () => Promise<Cliente[]>;
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  margemLucro: number;
  estoque: number;
  estoqueMinimo: number;
  unidade: string;
  codigoBarras?: string;
  status: "ativo" | "inativo";
  dataCadastro: Date;
  ultimaAtualizacao: Date;
}

export interface ProdutoState {
  produtos: Produto[];
  produtoAtual: Produto | null;
  isLoading: boolean;
  error: string | null;
  adicionarProduto: (
    produto: Omit<Produto, "id" | "dataCadastro" | "ultimaAtualizacao">
  ) => Promise<void>;
  atualizarProduto: (id: string, produto: Partial<Produto>) => Promise<void>;
  removerProduto: (id: string) => Promise<void>;
  setProdutoAtual: (produto: Produto | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProdutos: () => Promise<Produto[]>;
  atualizarEstoque: (
    id: string,
    quantidade: number,
    tipo: "entrada" | "saida"
  ) => Promise<void>;
  buscarProdutoPorCodigo: (codigo: string) => Produto | undefined;
  buscarProdutoPorCodigoBarras: (codigoBarras: string) => Produto | undefined;
}

export interface ItemVenda {
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  desconto: number;
}

export interface Venda {
  id: string;
  numero: string;
  data: string;
  cliente: {
    id: string;
    nome: string;
    cpf: string;
  };
  produtos: {
    produto: {
      id: string;
      nome: string;
      preco: number;
    };
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }[];
  total: number;
  valorPago: number;
  formaPagamento: "dinheiro" | "cartao_credito" | "cartao_debito" | "pix";
  status: "pendente" | "concluida" | "cancelada";
}

export interface VendaState {
  vendas: Venda[];
  isLoading: boolean;
  error: string | null;
  fetchVendas: () => Promise<void>;
  adicionarVenda: (venda: Omit<Venda, "id" | "numero">) => Promise<void>;
  cancelarVenda: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export interface TransacaoFinanceira {
  id: string;
  data: Date;
  tipo: "receita" | "despesa";
  categoria: string;
  descricao: string;
  valor: number;
  formaPagamento:
    | "dinheiro"
    | "cartao_credito"
    | "cartao_debito"
    | "pix"
    | "transferencia";
  status: "pendente" | "concluida" | "cancelada";
  venda?: Venda;
  dataVencimento?: Date;
  observacoes?: string;
  usuario: User;
}

export interface FinanceiroState {
  transacoes: TransacaoFinanceira[];
  transacaoAtual: TransacaoFinanceira | null;
  isLoading: boolean;
  error: string | null;
  adicionarTransacao: (
    transacao: Omit<TransacaoFinanceira, "id" | "data">
  ) => void;
  atualizarTransacao: (
    id: string,
    transacao: Partial<TransacaoFinanceira>
  ) => void;
  cancelarTransacao: (id: string) => void;
  setTransacaoAtual: (transacao: TransacaoFinanceira | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchTransacoes: () => Promise<TransacaoFinanceira[]>;
  getSaldo: () => number;
  getReceitas: (periodo?: { inicio: Date; fim: Date }) => number;
  getDespesas: (periodo?: { inicio: Date; fim: Date }) => number;
}

export interface RelatorioVendas {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  totalVendas: number;
  valorTotal: number;
  vendasPorDia: Array<{
    data: Date;
    quantidade: number;
    valor: number;
  }>;
  vendasPorFormaPagamento: Array<{
    forma: string;
    quantidade: number;
    valor: number;
  }>;
  vendasPorCategoria: Array<{
    categoria: string;
    quantidade: number;
    valor: number;
  }>;
  produtosMaisVendidos: Array<{
    produto: Produto;
    quantidade: number;
    valor: number;
  }>;
  clientesMaisFrequentes: Array<{
    cliente: Cliente;
    quantidade: number;
    valor: number;
  }>;
}

export interface RelatorioFinanceiro {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  saldoInicial: number;
  saldoFinal: number;
  totalReceitas: number;
  totalDespesas: number;
  receitasPorCategoria: Array<{
    categoria: string;
    quantidade: number;
    valor: number;
  }>;
  despesasPorCategoria: Array<{
    categoria: string;
    quantidade: number;
    valor: number;
  }>;
  receitasPorFormaPagamento: Array<{
    forma: string;
    quantidade: number;
    valor: number;
  }>;
  despesasPorFormaPagamento: Array<{
    forma: string;
    quantidade: number;
    valor: number;
  }>;
  fluxoCaixa: Array<{
    data: Date;
    receitas: number;
    despesas: number;
    saldo: number;
  }>;
}

export interface RelatorioEstoque {
  produtosBaixoEstoque: Array<{
    produto: Produto;
    estoqueAtual: number;
    estoqueMinimo: number;
  }>;
  produtosSemEstoque: Produto[];
  produtosMaisVendidos: Array<{
    produto: Produto;
    quantidadeVendida: number;
    valorVendido: number;
  }>;
  produtosMenosVendidos: Array<{
    produto: Produto;
    quantidadeVendida: number;
    valorVendido: number;
  }>;
  movimentacoesEstoque: Array<{
    produto: Produto;
    tipo: "entrada" | "saida";
    quantidade: number;
    data: Date;
    motivo: string;
  }>;
}

export interface RelatorioState {
  relatorioVendas: RelatorioVendas | null;
  relatorioFinanceiro: RelatorioFinanceiro | null;
  relatorioEstoque: RelatorioEstoque | null;
  isLoading: boolean;
  error: string | null;
  gerarRelatorioVendas: (periodo: {
    inicio: Date;
    fim: Date;
  }) => Promise<RelatorioVendas>;
  gerarRelatorioFinanceiro: (periodo: {
    inicio: Date;
    fim: Date;
  }) => Promise<RelatorioFinanceiro>;
  gerarRelatorioEstoque: () => Promise<RelatorioEstoque>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface ConfiguracoesEmpresa {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    telefone: string;
    email: string;
    site?: string;
  };
}

export interface ConfiguracoesFiscais {
  regimeTributario: "simples" | "lucro_presumido" | "lucro_real";
  cnae: string;
  certificadoDigital?: {
    numero: string;
    dataValidade: Date;
  };
  serieNFe: string;
  numeroNFe: string;
}

export interface ConfiguracoesSistema {
  empresa: ConfiguracoesEmpresa;
  fiscal: ConfiguracoesFiscais;
  tema: "claro" | "escuro" | "sistema";
  idioma: "pt-BR";
  backupAutomatico: boolean;
  intervaloBackup: number; // em horas
  ultimoBackup?: Date;
}

interface ConfiguracoesState {
  configuracoes: ConfiguracoesSistema | null;
  isLoading: boolean;
  error: string | null;
  fetchConfiguracoes: () => Promise<void>;
  atualizarConfiguracoes: (
    configuracoes: Partial<ConfiguracoesSistema>
  ) => Promise<void>;
  resetarConfiguracoes: () => Promise<void>;
  realizarBackup: () => Promise<void>;
  restaurarBackup: (data: Date) => Promise<void>;
}

export interface MovimentacaoEstoque {
  id: string;
  produto: Produto;
  tipo: "entrada" | "saida" | "ajuste" | "transferencia";
  quantidade: number;
  data: Date;
  motivo: string;
  observacoes?: string;
  usuario: User;
  origem?: string; // Para transferências
  destino?: string; // Para transferências
  documento?: string; // Número do documento (NF, etc)
}

export interface AjusteEstoque {
  id: string;
  produto: Produto;
  quantidadeAnterior: number;
  quantidadeNova: number;
  data: Date;
  motivo: string;
  observacoes?: string;
  usuario: User;
}

export interface TransferenciaEstoque {
  id: string;
  produto: Produto;
  quantidade: number;
  data: Date;
  origem: string;
  destino: string;
  status: "pendente" | "concluida" | "cancelada";
  observacoes?: string;
  usuario: User;
}

export interface EstoqueState {
  movimentacoes: MovimentacaoEstoque[];
  ajustes: AjusteEstoque[];
  transferencias: TransferenciaEstoque[];
  isLoading: boolean;
  error: string | null;
  adicionarMovimentacao: (
    movimentacao: Omit<MovimentacaoEstoque, "id" | "data">
  ) => void;
  adicionarAjuste: (ajuste: Omit<AjusteEstoque, "id" | "data">) => void;
  adicionarTransferencia: (
    transferencia: Omit<TransferenciaEstoque, "id" | "data">
  ) => void;
  atualizarTransferencia: (
    id: string,
    status: TransferenciaEstoque["status"]
  ) => void;
  getMovimentacoesPorProduto: (produtoId: string) => MovimentacaoEstoque[];
  getAjustesPorProduto: (produtoId: string) => AjusteEstoque[];
  getTransferenciasPorProduto: (produtoId: string) => TransferenciaEstoque[];
  getProdutosBaixoEstoque: () => Array<{
    produto: Produto;
    estoqueAtual: number;
    estoqueMinimo: number;
  }>;
  getProdutosSemEstoque: () => Produto[];
  getHistoricoMovimentacoes: (periodo?: {
    inicio: Date;
    fim: Date;
  }) => MovimentacaoEstoque[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: "ativo" | "inativo";
  ultimoAcesso: string;
}

interface UsuarioStore {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<void>;
  adicionarUsuario: (
    usuario: Omit<Usuario, "id" | "ultimoAcesso">
  ) => Promise<void>;
  atualizarUsuario: (id: string, usuario: Partial<Usuario>) => Promise<void>;
  removerUsuario: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

// Store de Autenticação
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// Store de Cupom Fiscal
export const useCupomFiscalStore = create<CupomFiscalState>()(
  persist(
    (set) => ({
      cupons: [],
      cupomAtual: null,
      adicionarCupom: (cupom) => {
        set((state) => ({ cupons: [...state.cupons, cupom] }));
      },
      atualizarCupom: (id, cupomAtualizado) => {
        set((state) => ({
          cupons: state.cupons.map((cupom) =>
            cupom.id === id ? { ...cupom, ...cupomAtualizado } : cupom
          ),
        }));
      },
      removerCupom: (id) => {
        set((state) => ({
          cupons: state.cupons.filter((cupom) => cupom.id !== id),
        }));
      },
      setCupomAtual: (cupom) => {
        set({ cupomAtual: cupom });
      },
    }),
    {
      name: "cupom-fiscal-storage",
    }
  )
);

// Store de Clientes
export const useClienteStore = create<ClienteState>()(
  persist(
    (set, get) => ({
      clientes: [],
      clienteAtual: null,
      isLoading: false,
      error: null,
      adicionarCliente: async (cliente) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente),
          });
          if (!response.ok) throw new Error("Erro ao adicionar cliente");
          const novoCliente = await response.json();
          set((state) => ({ clientes: [...state.clientes, novoCliente] }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar cliente",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      atualizarCliente: async (id, clienteAtualizado) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`/api/clientes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteAtualizado),
          });
          if (!response.ok) throw new Error("Erro ao atualizar cliente");
          const clienteAtualizado = await response.json();
          set((state) => ({
            clientes: state.clientes.map((c) =>
              c.id === id ? clienteAtualizado : c
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao atualizar cliente",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      removerCliente: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`/api/clientes/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Erro ao remover cliente");
          set((state) => ({
            clientes: state.clientes.filter((c) => c.id !== id),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao remover cliente",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      setClienteAtual: (cliente) => {
        set({ clienteAtual: cliente });
      },
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      setError: (error) => {
        set({ error });
      },
      fetchClientes: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/clientes");
          if (!response.ok) throw new Error("Erro ao carregar clientes");
          const clientes = await response.json();
          set({ clientes });
          return clientes;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar clientes",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "clientes-storage",
    }
  )
);

// Store de Produtos
export const useProdutoStore = create<ProdutoState>()(
  persist(
    (set, get) => ({
      produtos: [
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
      ],
      produtoAtual: null,
      isLoading: false,
      error: null,
      adicionarProduto: async (produto) => {
        try {
          set({ isLoading: true, error: null });
          const novoProduto = {
            ...produto,
            id: crypto.randomUUID(),
            dataCadastro: new Date(),
            ultimaAtualizacao: new Date(),
          };
          set((state) => ({ produtos: [...state.produtos, novoProduto] }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar produto",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      atualizarProduto: async (id, produtoAtualizado) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            produtos: state.produtos.map((p) =>
              p.id === id
                ? {
                    ...p,
                    ...produtoAtualizado,
                    ultimaAtualizacao: new Date(),
                  }
                : p
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao atualizar produto",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      removerProduto: async (id) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            produtos: state.produtos.filter((p) => p.id !== id),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao remover produto",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      setProdutoAtual: (produto) => {
        set({ produtoAtual: produto });
      },
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      setError: (error) => {
        set({ error });
      },
      fetchProdutos: async () => {
        try {
          set({ isLoading: true, error: null });
          const produtos = get().produtos;
          return produtos;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar produtos",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      atualizarEstoque: async (id, quantidade, tipo) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            produtos: state.produtos.map((p) =>
              p.id === id
                ? {
                    ...p,
                    estoque:
                      tipo === "entrada"
                        ? p.estoque + quantidade
                        : p.estoque - quantidade,
                    ultimaAtualizacao: new Date(),
                  }
                : p
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao atualizar estoque",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      buscarProdutoPorCodigo: (codigo) => {
        return get().produtos.find((p) => p.codigo === codigo);
      },
      buscarProdutoPorCodigoBarras: (codigoBarras) => {
        return get().produtos.find((p) => p.codigoBarras === codigoBarras);
      },
    }),
    {
      name: "produtos-storage",
    }
  )
);

// Store de Vendas
export const useVendaStore = create<VendaState>((set, get) => ({
  vendas: [],
  isLoading: false,
  error: null,
  fetchVendas: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/vendas");
      if (!response.ok) throw new Error("Erro ao carregar vendas");
      const vendas = await response.json();
      set({ vendas, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar vendas",
        isLoading: false,
      });
    }
  },
  adicionarVenda: async (venda) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
      if (!response.ok) throw new Error("Erro ao adicionar venda");
      const novaVenda = await response.json();
      set((state) => ({
        vendas: [...state.vendas, novaVenda],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao adicionar venda",
        isLoading: false,
      });
    }
  },
  cancelarVenda: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/vendas/${id}/cancelar`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Erro ao cancelar venda");
      const vendaCancelada = await response.json();
      set((state) => ({
        vendas: state.vendas.map((v) => (v.id === id ? vendaCancelada : v)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao cancelar venda",
        isLoading: false,
      });
    }
  },
}));

// Store Financeiro
export const useFinanceiroStore = create<FinanceiroState>()(
  persist(
    (set, get) => ({
      transacoes: [],
      isLoading: false,
      error: null,
      fetchTransacoes: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/financeiro/transacoes");
          if (!response.ok) throw new Error("Erro ao carregar transações");
          const transacoes = await response.json();
          set({ transacoes, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar transações",
            isLoading: false,
          });
        }
      },
      adicionarTransacao: async (transacao) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/financeiro/transacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transacao),
          });
          if (!response.ok) throw new Error("Erro ao adicionar transação");
          const novaTransacao = await response.json();
          set((state) => ({
            transacoes: [...state.transacoes, novaTransacao],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar transação",
            isLoading: false,
          });
        }
      },
      cancelarTransacao: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(
            `/api/financeiro/transacoes/${id}/cancelar`,
            {
              method: "POST",
            }
          );
          if (!response.ok) throw new Error("Erro ao cancelar transação");
          const transacaoCancelada = await response.json();
          set((state) => ({
            transacoes: state.transacoes.map((t) =>
              t.id === id ? transacaoCancelada : t
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao cancelar transação",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "financeiro-storage",
    }
  )
);

// Store de Relatórios
export const useRelatorioStore = create<RelatorioState>()(
  persist(
    (set, get) => ({
      relatorioVendas: null,
      relatorioFinanceiro: null,
      relatorioEstoque: null,
      isLoading: false,
      error: null,
      gerarRelatorioVendas: async (periodo) => {
        try {
          set({ isLoading: true, error: null });

          // Busca dados das vendas
          const response = await fetch("/api/vendas");
          if (!response.ok) throw new Error("Erro ao carregar vendas");
          const vendas = await response.json();

          // Filtra vendas pelo período
          const vendasNoPeriodo = vendas.filter((venda: Venda) => {
            const dataVenda = new Date(venda.data);
            return dataVenda >= periodo.inicio && dataVenda <= periodo.fim;
          });

          // Calcula totais
          const totalVendas = vendasNoPeriodo.length;
          const valorTotal = vendasNoPeriodo.reduce(
            (total: number, venda: Venda) => total + venda.total,
            0
          );

          // Agrupa vendas por dia
          const vendasPorDia = vendasNoPeriodo.reduce(
            (acc: any[], venda: Venda) => {
              const data = new Date(venda.data).toLocaleDateString("pt-BR");
              const index = acc.findIndex((item) => item.data === data);
              if (index === -1) {
                acc.push({ data, valor: venda.total });
              } else {
                acc[index].valor += venda.total;
              }
              return acc;
            },
            []
          );

          // Agrupa vendas por forma de pagamento
          const vendasPorFormaPagamento = vendasNoPeriodo.reduce(
            (acc: any[], venda: Venda) => {
              const index = acc.findIndex(
                (item) => item.forma === venda.formaPagamento
              );
              if (index === -1) {
                acc.push({ forma: venda.formaPagamento, valor: venda.total });
              } else {
                acc[index].valor += venda.total;
              }
              return acc;
            },
            []
          );

          // Agrupa vendas por categoria
          const vendasPorCategoria = vendasNoPeriodo.reduce(
            (acc: any[], venda: Venda) => {
              venda.produtos.forEach((item: any) => {
                const categoria = item.produto.categoria;
                const index = acc.findIndex(
                  (item) => item.categoria === categoria
                );
                if (index === -1) {
                  acc.push({ categoria, valor: item.valorTotal });
                } else {
                  acc[index].valor += item.valorTotal;
                }
              });
              return acc;
            },
            []
          );

          // Calcula produtos mais vendidos
          const produtosMaisVendidos = vendasNoPeriodo
            .reduce((acc: any[], venda: Venda) => {
              venda.produtos.forEach((item: any) => {
                const index = acc.findIndex((p) => p.id === item.produto.id);
                if (index === -1) {
                  acc.push({
                    id: item.produto.id,
                    nome: item.produto.nome,
                    quantidade: item.quantidade,
                    valor: item.valorTotal,
                  });
                } else {
                  acc[index].quantidade += item.quantidade;
                  acc[index].valor += item.valorTotal;
                }
              });
              return acc;
            }, [])
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 5);

          // Calcula clientes mais frequentes
          const clientesMaisFrequentes = vendasNoPeriodo
            .reduce((acc: any[], venda: Venda) => {
              const index = acc.findIndex((c) => c.id === venda.cliente.id);
              if (index === -1) {
                acc.push({
                  id: venda.cliente.id,
                  nome: venda.cliente.nome,
                  compras: 1,
                  valor: venda.total,
                });
              } else {
                acc[index].compras += 1;
                acc[index].valor += venda.total;
              }
              return acc;
            }, [])
            .sort((a, b) => b.compras - a.compras)
            .slice(0, 5);

          const relatorio = {
            periodo,
            totalVendas,
            valorTotal,
            vendasPorDia,
            vendasPorFormaPagamento,
            vendasPorCategoria,
            produtosMaisVendidos,
            clientesMaisFrequentes,
          };

          set({ relatorioVendas: relatorio, isLoading: false });
          return relatorio;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao gerar relatório de vendas",
            isLoading: false,
          });
          throw error;
        }
      },
      gerarRelatorioFinanceiro: async (periodo) => {
        try {
          set({ isLoading: true, error: null });

          // Busca dados financeiros
          const response = await fetch("/api/financeiro/transacoes");
          if (!response.ok) throw new Error("Erro ao carregar transações");
          const transacoes = await response.json();

          // Filtra transações pelo período
          const transacoesNoPeriodo = transacoes.filter(
            (transacao: TransacaoFinanceira) => {
              const data = new Date(transacao.data);
              return data >= periodo.inicio && data <= periodo.fim;
            }
          );

          // Calcula totais
          const receitas = transacoesNoPeriodo
            .filter((t: TransacaoFinanceira) => t.tipo === "receita")
            .reduce(
              (total: number, t: TransacaoFinanceira) => total + t.valor,
              0
            );

          const despesas = transacoesNoPeriodo
            .filter((t: TransacaoFinanceira) => t.tipo === "despesa")
            .reduce(
              (total: number, t: TransacaoFinanceira) => total + t.valor,
              0
            );

          // Agrupa transações por categoria
          const transacoesPorCategoria = transacoesNoPeriodo.reduce(
            (acc: any[], transacao: TransacaoFinanceira) => {
              const index = acc.findIndex(
                (item) => item.categoria === transacao.categoria
              );
              if (index === -1) {
                acc.push({
                  categoria: transacao.categoria,
                  receitas: transacao.tipo === "receita" ? transacao.valor : 0,
                  despesas: transacao.tipo === "despesa" ? transacao.valor : 0,
                });
              } else {
                if (transacao.tipo === "receita") {
                  acc[index].receitas += transacao.valor;
                } else {
                  acc[index].despesas += transacao.valor;
                }
              }
              return acc;
            },
            []
          );

          // Agrupa transações por dia
          const transacoesPorDia = transacoesNoPeriodo.reduce(
            (acc: any[], transacao: TransacaoFinanceira) => {
              const data = new Date(transacao.data).toLocaleDateString("pt-BR");
              const index = acc.findIndex((item) => item.data === data);
              if (index === -1) {
                acc.push({
                  data,
                  receitas: transacao.tipo === "receita" ? transacao.valor : 0,
                  despesas: transacao.tipo === "despesa" ? transacao.valor : 0,
                });
              } else {
                if (transacao.tipo === "receita") {
                  acc[index].receitas += transacao.valor;
                } else {
                  acc[index].despesas += transacao.valor;
                }
              }
              return acc;
            },
            []
          );

          const relatorio = {
            periodo,
            saldo: receitas - despesas,
            receitas,
            despesas,
            transacoesPorCategoria,
            transacoesPorDia,
          };

          set({ relatorioFinanceiro: relatorio, isLoading: false });
          return relatorio;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao gerar relatório financeiro",
            isLoading: false,
          });
          throw error;
        }
      },
      gerarRelatorioEstoque: async () => {
        try {
          set({ isLoading: true, error: null });

          // Busca dados de produtos e movimentações
          const [produtosResponse, movimentacoesResponse] = await Promise.all([
            fetch("/api/produtos"),
            fetch("/api/estoque/movimentacoes"),
          ]);

          if (!produtosResponse.ok)
            throw new Error("Erro ao carregar produtos");
          if (!movimentacoesResponse.ok)
            throw new Error("Erro ao carregar movimentações");

          const produtos = await produtosResponse.json();
          const movimentacoes = await movimentacoesResponse.json();

          // Calcula totais
          const totalProdutos = produtos.length;
          const valorTotalEstoque = produtos.reduce(
            (total: number, p: Produto) => total + p.precoCusto * p.estoque,
            0
          );

          // Agrupa produtos por categoria
          const produtosPorCategoria = produtos.reduce(
            (acc: any[], produto: Produto) => {
              const index = acc.findIndex(
                (item) => item.categoria === produto.categoria
              );
              if (index === -1) {
                acc.push({
                  categoria: produto.categoria,
                  quantidade: 1,
                  valor: produto.precoCusto * produto.estoque,
                });
              } else {
                acc[index].quantidade += 1;
                acc[index].valor += produto.precoCusto * produto.estoque;
              }
              return acc;
            },
            []
          );

          // Produtos com estoque baixo
          const produtosComEstoqueBaixo = produtos.filter(
            (p: Produto) => p.estoque <= p.estoqueMinimo
          ).length;

          // Produtos sem estoque
          const produtosSemEstoque = produtos.filter(
            (p: Produto) => p.estoque === 0
          ).length;

          // Movimentações recentes
          const movimentacoesRecentes = movimentacoes
            .sort(
              (a: MovimentacaoEstoque, b: MovimentacaoEstoque) =>
                new Date(b.data).getTime() - new Date(a.data).getTime()
            )
            .slice(0, 10);

          const relatorio = {
            totalProdutos,
            valorTotalEstoque,
            produtosPorCategoria,
            produtosComEstoqueBaixo,
            produtosSemEstoque,
            movimentacoesRecentes,
          };

          set({ relatorioEstoque: relatorio, isLoading: false });
          return relatorio;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao gerar relatório de estoque",
            isLoading: false,
          });
          throw error;
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "relatorio-store",
      partialize: (state) => ({
        relatorioVendas: state.relatorioVendas,
        relatorioFinanceiro: state.relatorioFinanceiro,
        relatorioEstoque: state.relatorioEstoque,
      }),
    }
  )
);

export const useConfiguracoesStore = create<ConfiguracoesState>((set, get) => ({
  configuracoes: null,
  isLoading: false,
  error: null,

  fetchConfiguracoes: async () => {
    try {
      set({ isLoading: true, error: null });
      // Aqui você implementaria a chamada à API
      // Por enquanto, vamos usar dados mockados
      const configuracoesMock: ConfiguracoesSistema = {
        empresa: {
          razaoSocial: "Cris & Drigo Modas LTDA",
          nomeFantasia: "Cris & Drigo Modas",
          cnpj: "12.345.678/0001-90",
          inscricaoEstadual: "123.456.789",
          endereco: {
            logradouro: "Rua Principal",
            numero: "123",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567",
          },
          contato: {
            telefone: "(11) 1234-5678",
            email: "contato@crisdrigo.com.br",
            site: "www.crisdrigo.com.br",
          },
        },
        fiscal: {
          regimeTributario: "simples",
          cnae: "4781-4/00",
          serieNFe: "1",
          numeroNFe: "1",
        },
        tema: "claro",
        idioma: "pt-BR",
        backupAutomatico: true,
        intervaloBackup: 24,
      };

      set({ configuracoes: configuracoesMock, isLoading: false });
    } catch (error) {
      set({ error: "Erro ao carregar configurações", isLoading: false });
    }
  },

  atualizarConfiguracoes: async (
    novasConfiguracoes: Partial<ConfiguracoesSistema>
  ) => {
    try {
      set({ isLoading: true, error: null });
      const configuracoesAtuais = get().configuracoes;

      if (!configuracoesAtuais) {
        throw new Error("Configurações não carregadas");
      }

      // Aqui você implementaria a chamada à API
      const configuracoesAtualizadas = {
        ...configuracoesAtuais,
        ...novasConfiguracoes,
      };

      set({ configuracoes: configuracoesAtualizadas, isLoading: false });
    } catch (error) {
      set({ error: "Erro ao atualizar configurações", isLoading: false });
      throw error;
    }
  },

  resetarConfiguracoes: async () => {
    try {
      set({ isLoading: true, error: null });
      // Aqui você implementaria a chamada à API para resetar as configurações
      await get().fetchConfiguracoes();
    } catch (error) {
      set({ error: "Erro ao resetar configurações", isLoading: false });
      throw error;
    }
  },

  realizarBackup: async () => {
    try {
      set({ isLoading: true, error: null });
      // Aqui você implementaria a lógica de backup
      const configuracoes = get().configuracoes;
      if (!configuracoes) {
        throw new Error("Configurações não carregadas");
      }

      // Simulando um backup
      const backup = {
        ...configuracoes,
        ultimoBackup: new Date(),
      };

      set({ configuracoes: backup, isLoading: false });
    } catch (error) {
      set({ error: "Erro ao realizar backup", isLoading: false });
      throw error;
    }
  },

  restaurarBackup: async (data: Date) => {
    try {
      set({ isLoading: true, error: null });
      // Aqui você implementaria a lógica de restauração
      // Por enquanto, apenas recarregamos as configurações
      await get().fetchConfiguracoes();
    } catch (error) {
      set({ error: "Erro ao restaurar backup", isLoading: false });
      throw error;
    }
  },
}));

// Store de Estoque
export const useEstoqueStore = create<EstoqueState>()(
  persist(
    (set, get) => ({
      movimentacoes: [],
      ajustes: [],
      transferencias: [],
      isLoading: false,
      error: null,
      fetchMovimentacoes: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/estoque/movimentacoes");
          if (!response.ok) throw new Error("Erro ao carregar movimentações");
          const movimentacoes = await response.json();
          set({ movimentacoes, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar movimentações",
            isLoading: false,
          });
        }
      },
      adicionarMovimentacao: async (movimentacao) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/estoque/movimentacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movimentacao),
          });
          if (!response.ok) throw new Error("Erro ao adicionar movimentação");
          const novaMovimentacao = await response.json();
          set((state) => ({
            movimentacoes: [...state.movimentacoes, novaMovimentacao],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar movimentação",
            isLoading: false,
          });
        }
      },
      getProdutosBaixoEstoque: () => {
        try {
          const produtos =
            require("./index").useProdutoStore.getState().produtos || [];
          return produtos
            .filter((p) => p.estoque <= p.estoqueMinimo)
            .map((p) => ({
              produto: p,
              estoqueAtual: p.estoque,
              estoqueMinimo: p.estoqueMinimo,
            }));
        } catch {
          return [];
        }
      },
      getProdutosSemEstoque: () => {
        try {
          const produtos =
            require("./index").useProdutoStore.getState().produtos || [];
          return produtos.filter((p) => p.estoque === 0);
        } catch {
          return [];
        }
      },
      getHistoricoMovimentacoes: (periodo?: { inicio: Date; fim: Date }) => {
        try {
          const movimentacoes = get().movimentacoes || [];
          if (!periodo) return movimentacoes;
          return movimentacoes.filter((m) => {
            const dataMov = new Date(m.data);
            return dataMov >= periodo.inicio && dataMov <= periodo.fim;
          });
        } catch {
          return [];
        }
      },
    }),
    {
      name: "estoque-storage",
    }
  )
);

export const useUsuarioStore = create<UsuarioStore>((set, get) => ({
  usuarios: [],
  loading: false,
  error: null,

  fetchUsuarios: async () => {
    try {
      set({ loading: true, error: null });
      // TODO: Implementar chamada à API
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      set({ usuarios: data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar usuários",
        loading: false,
      });
    }
  },

  adicionarUsuario: async (usuario) => {
    try {
      set({ loading: true, error: null });
      // TODO: Implementar chamada à API
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      const data = await response.json();
      set((state) => ({
        usuarios: [...state.usuarios, data],
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao adicionar usuário",
        loading: false,
      });
      throw error;
    }
  },

  atualizarUsuario: async (id, usuario) => {
    try {
      set({ loading: true, error: null });
      // TODO: Implementar chamada à API
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      const data = await response.json();
      set((state) => ({
        usuarios: state.usuarios.map((u) =>
          u.id === id ? { ...u, ...data } : u
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao atualizar usuário",
        loading: false,
      });
      throw error;
    }
  },

  removerUsuario: async (id) => {
    try {
      set({ loading: true, error: null });
      // TODO: Implementar chamada à API
      await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });
      set((state) => ({
        usuarios: state.usuarios.filter((u) => u.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao remover usuário",
        loading: false,
      });
      throw error;
    }
  },

  setError: (error) => set({ error }),
}));
