import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

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
  adicionarCliente: (
    cliente: Omit<Cliente, "id" | "dataCadastro">
  ) => Promise<void>;
  atualizarCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  removerCliente: (id: string) => Promise<void>;
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
  ) => void;
  atualizarProduto: (id: string, produto: Partial<Produto>) => void;
  removerProduto: (id: string) => void;
  setProdutoAtual: (produto: Produto | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProdutos: () => Produto[];
  atualizarEstoque: (
    id: string,
    quantidade: number,
    tipo: "entrada" | "saida"
  ) => void;
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
  produtos: Array<{
    produto: Produto;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
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

type ClienteResumido = {
  id: string;
  nome: string;
  cpf: string;
};

type RelatorioVendas = {
  periodo: { inicio: Date; fim: Date };
  totalVendas: number;
  valorTotal: number;
  vendasPorDia: Array<{ data: Date; quantidade: number; valor: number }>;
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
    cliente: ClienteResumido;
    quantidade: number;
    valor: number;
  }>;
};

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
  periodo: { inicio: Date; fim: Date };
  totalProdutos: number;
  produtosPorCategoria: Array<{
    categoria: string;
    quantidade: number;
  }>;
  produtosBaixoEstoque: Array<{
    produto: Produto;
    estoqueAtual: number;
    estoqueMinimo: number;
  }>;
  produtosSemEstoque: Array<{
    produto: Produto;
    estoqueAtual: number;
    estoqueMinimo: number;
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
  gerarRelatorioEstoque: (periodo: {
    inicio: Date;
    fim: Date;
  }) => Promise<RelatorioEstoque>;
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

// Store de Configurações
export const useConfiguracoesStore = create<ConfiguracoesState>()(
  persist(
    (set, get) => ({
      configuracoes: null,
      isLoading: false,
      error: null,

      fetchConfiguracoes: async () => {
        try {
          set({ isLoading: true, error: null });
          // Usando dados mockados em vez de chamada à API
          const configuracoesMock = {
            empresa: {
              razaoSocial: "Cris & Drigo Modas",
              nomeFantasia: "Cris & Drigo Modas",
              cnpj: "12.345.678/0001-90",
              inscricaoEstadual: "123.456.789",
              endereco: {
                logradouro: "Rua Exemplo",
                numero: "123",
                bairro: "Centro",
                cidade: "São Paulo",
                estado: "SP",
                cep: "01234-567",
              },
              contato: {
                telefone: "(11) 1234-5678",
                email: "contato@crisdrigo.com.br",
              },
            },
            fiscal: {
              regimeTributario: "simples" as
                | "simples"
                | "lucro_presumido"
                | "lucro_real",
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
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar configurações",
            isLoading: false,
          });
          throw error;
        }
      },

      atualizarConfiguracoes: async (novasConfiguracoes) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/configuracoes", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novasConfiguracoes),
          });
          if (!response.ok) throw new Error("Erro ao atualizar configurações");
          const configuracoesAtualizadas = await response.json();
          set({ configuracoes: configuracoesAtualizadas, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao atualizar configurações",
            isLoading: false,
          });
          throw error;
        }
      },

      resetarConfiguracoes: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/configuracoes/reset", {
            method: "POST",
          });
          if (!response.ok) throw new Error("Erro ao resetar configurações");
          const configuracoesPadrao = await response.json();
          set({ configuracoes: configuracoesPadrao, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao resetar configurações",
            isLoading: false,
          });
          throw error;
        }
      },

      realizarBackup: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/configuracoes/backup", {
            method: "POST",
          });
          if (!response.ok) throw new Error("Erro ao realizar backup");
          const backup = await response.json();
          set((state) => ({
            configuracoes: state.configuracoes
              ? { ...state.configuracoes, ultimoBackup: new Date(backup.data) }
              : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao realizar backup",
            isLoading: false,
          });
          throw error;
        }
      },

      restaurarBackup: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(
            `/api/configuracoes/backup/${data.toISOString()}`,
            {
              method: "POST",
            }
          );
          if (!response.ok) throw new Error("Erro ao restaurar backup");
          const configuracoesRestauradas = await response.json();
          set({ configuracoes: configuracoesRestauradas, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao restaurar backup",
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "configuracoes-store",
      partialize: (state) => ({
        configuracoes: state.configuracoes,
      }),
    }
  )
);

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

interface VendaPorDia {
  data: Date;
  quantidade: number;
  valor: number;
}

interface VendaPorFormaPagamento {
  forma: string;
  quantidade: number;
  valor: number;
}

interface VendaPorCategoria {
  categoria: string;
  quantidade: number;
  valor: number;
}

interface ItemVendaRelatorio {
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
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
          const novoCliente = (await response.json()) as Cliente;
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
      atualizarCliente: async (id, dadosAtualizacao) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`/api/clientes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizacao),
          });
          if (!response.ok) throw new Error("Erro ao atualizar cliente");
          const clienteAtualizado = (await response.json()) as Cliente;
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
          const clientes = (await response.json()) as Cliente[];
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
      adicionarProduto: (produto) => {
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
      atualizarProduto: (id, produtoAtualizado) => {
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
      removerProduto: (id) => {
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
      fetchProdutos: () => {
        try {
          set({ isLoading: true, error: null });
          const produtos = get().produtos;
          set({ isLoading: false });
          return produtos;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar produtos",
          });
          throw error;
        }
      },
      atualizarEstoque: (id, quantidade, tipo) => {
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
      const vendas = (await response.json()) as Venda[];
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
      const novaVenda = (await response.json()) as Venda;
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
      const vendaCancelada = (await response.json()) as Venda;
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
  setError: (error) => {
    set({ error });
  },
}));

// Store Financeiro
export const useFinanceiroStore = create<FinanceiroState>()(
  persist(
    (set, get) => ({
      transacoes: [],
      transacaoAtual: null,
      isLoading: false,
      error: null,
      fetchTransacoes: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/financeiro/transacoes");
          if (!response.ok) throw new Error("Erro ao carregar transações");
          const transacoes = (await response.json()) as TransacaoFinanceira[];
          set({ transacoes, isLoading: false });
          return transacoes;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao carregar transações",
            isLoading: false,
          });
          throw error;
        }
      },
      adicionarTransacao: (transacao) => {
        try {
          set({ isLoading: true, error: null });
          fetch("/api/financeiro/transacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transacao),
          })
            .then((response) => {
              if (!response.ok) throw new Error("Erro ao adicionar transação");
              return response.json();
            })
            .then((novaTransacao) => {
              set((state) => ({
                transacoes: [...state.transacoes, novaTransacao],
                isLoading: false,
              }));
            })
            .catch((error: unknown) => {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : "Erro ao adicionar transação",
                isLoading: false,
              });
            });
        } catch (error: unknown) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar transação",
            isLoading: false,
          });
        }
      },
      atualizarTransacao: (id, transacao) => {
        set((state) => ({
          transacoes: state.transacoes.map((t) =>
            t.id === id ? { ...t, ...transacao } : t
          ),
        }));
      },
      cancelarTransacao: (id) => {
        try {
          set({ isLoading: true, error: null });
          fetch(`/api/financeiro/transacoes/${id}/cancelar`, {
            method: "POST",
          })
            .then((response) => {
              if (!response.ok) throw new Error("Erro ao cancelar transação");
              return response.json();
            })
            .then((transacaoCancelada) => {
              set((state) => ({
                transacoes: state.transacoes.map((t) =>
                  t.id === id ? (transacaoCancelada as TransacaoFinanceira) : t
                ),
                isLoading: false,
              }));
            })
            .catch((error: unknown) => {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : "Erro ao cancelar transação",
                isLoading: false,
              });
            });
        } catch (error: unknown) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao cancelar transação",
            isLoading: false,
          });
        }
      },
      setTransacaoAtual: (transacao) => {
        set({ transacaoAtual: transacao });
      },
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      setError: (error) => {
        set({ error });
      },
      getSaldo: () => {
        return get().transacoes.reduce((total, t) => {
          return total + (t.tipo === "receita" ? t.valor : -t.valor);
        }, 0);
      },
      getReceitas: (periodo) => {
        const transacoes = periodo
          ? get().transacoes.filter(
              (t) =>
                t.tipo === "receita" &&
                t.data >= periodo.inicio &&
                t.data <= periodo.fim
            )
          : get().transacoes.filter((t) => t.tipo === "receita");
        return transacoes.reduce((total, t) => total + t.valor, 0);
      },
      getDespesas: (periodo) => {
        const transacoes = periodo
          ? get().transacoes.filter(
              (t) =>
                t.tipo === "despesa" &&
                t.data >= periodo.inicio &&
                t.data <= periodo.fim
            )
          : get().transacoes.filter((t) => t.tipo === "despesa");
        return transacoes.reduce((total, t) => total + t.valor, 0);
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

      gerarRelatorioVendas: async (periodo: { inicio: Date; fim: Date }) => {
        try {
          console.log("Iniciando geração de relatório de vendas:", periodo);
          set({ isLoading: true, error: null });

          // Usando dados do store local em vez de chamada à API
          const vendas = useVendaStore.getState().vendas;
          console.log("Vendas carregadas do store:", vendas);

          // Filtra vendas pelo período
          const vendasFiltradas = vendas.filter(
            (venda) =>
              new Date(venda.data) >= periodo.inicio &&
              new Date(venda.data) <= periodo.fim
          );

          console.log("Vendas filtradas por período:", vendasFiltradas);

          // Calcula totais
          const totalVendas = vendasFiltradas.reduce(
            (total, venda) => total + venda.total,
            0
          );

          // Agrupa vendas por dia
          const vendasPorDia = vendasFiltradas.reduce<
            Record<string, { quantidade: number; valor: number }>
          >((acc, venda) => {
            const data = new Date(venda.data).toISOString().split("T")[0];
            acc[data] ??= { quantidade: 0, valor: 0 };
            acc[data].quantidade += 1;
            acc[data].valor += venda.total;
            return acc;
          }, {});

          // Agrupa vendas por forma de pagamento
          const vendasPorFormaPagamento = vendasFiltradas.reduce<
            Record<string, { quantidade: number; valor: number }>
          >((acc, venda) => {
            acc[venda.formaPagamento] ??= { quantidade: 0, valor: 0 };
            acc[venda.formaPagamento].quantidade += 1;
            acc[venda.formaPagamento].valor += venda.total;
            return acc;
          }, {});

          // Agrupa vendas por categoria
          const vendasPorCategoria = vendasFiltradas.reduce<
            Record<string, { quantidade: number; valor: number }>
          >((acc, venda) => {
            venda.produtos.forEach((item) => {
              const categoria = item.produto.categoria;
              acc[categoria] ??= { quantidade: 0, valor: 0 };
              acc[categoria].quantidade += item.quantidade;
              acc[categoria].valor += item.valorTotal;
            });
            return acc;
          }, {});

          // Agrupa produtos mais vendidos
          const produtosMaisVendidos = vendasFiltradas.reduce<
            Record<
              string,
              { produto: Produto; quantidade: number; valor: number }
            >
          >((acc, venda) => {
            venda.produtos.forEach((item) => {
              const produtoId = item.produto.id;
              acc[produtoId] ??= {
                produto: item.produto,
                quantidade: 0,
                valor: 0,
              };
              acc[produtoId].quantidade += item.quantidade;
              acc[produtoId].valor += item.valorTotal;
            });
            return acc;
          }, {});

          const relatorio: RelatorioVendas = {
            periodo,
            totalVendas,
            valorTotal: totalVendas,
            vendasPorDia: Object.entries(vendasPorDia).map(([data, dados]) => ({
              data: new Date(data),
              quantidade: dados.quantidade,
              valor: dados.valor,
            })),
            vendasPorFormaPagamento: Object.entries(
              vendasPorFormaPagamento
            ).map(([forma, dados]) => ({
              forma,
              quantidade: dados.quantidade,
              valor: dados.valor,
            })),
            vendasPorCategoria: Object.entries(vendasPorCategoria).map(
              ([categoria, dados]) => ({
                categoria,
                quantidade: dados.quantidade,
                valor: dados.valor,
              })
            ),
            produtosMaisVendidos: Object.values(produtosMaisVendidos),
            clientesMaisFrequentes: vendasFiltradas.reduce<
              Array<{
                cliente: ClienteResumido;
                quantidade: number;
                valor: number;
              }>
            >((acc, venda) => {
              const clienteExistente = acc.find(
                (item) => item.cliente.id === venda.cliente.id
              );
              if (clienteExistente) {
                clienteExistente.quantidade += 1;
                clienteExistente.valor += venda.total;
              } else {
                acc.push({
                  cliente: {
                    id: venda.cliente.id,
                    nome: venda.cliente.nome,
                    cpf: venda.cliente.cpf,
                  },
                  quantidade: 1,
                  valor: venda.total,
                });
              }
              return acc;
            }, []),
          };

          console.log("Relatório de vendas gerado:", relatorio);

          set({ relatorioVendas: relatorio, isLoading: false });
          return relatorio;
        } catch (error) {
          console.error("Erro ao gerar relatório de vendas:", error);
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

      gerarRelatorioFinanceiro: async (periodo: {
        inicio: Date;
        fim: Date;
      }) => {
        try {
          console.log("Iniciando geração de relatório financeiro:", periodo);
          set({ isLoading: true, error: null });

          // Usando dados do store local em vez de chamada à API
          const transacoes = useFinanceiroStore.getState().transacoes;
          console.log("Transações carregadas do store:", transacoes);

          // Filtra transações pelo período
          const transacoesFiltradas = transacoes.filter(
            (transacao) =>
              new Date(transacao.data) >= periodo.inicio &&
              new Date(transacao.data) <= periodo.fim
          );

          console.log("Transações filtradas por período:", transacoesFiltradas);

          // Calcula totais
          const receitas = transacoesFiltradas
            .filter((t) => t.tipo === "receita")
            .reduce((total, t) => total + t.valor, 0);

          const despesas = transacoesFiltradas
            .filter((t) => t.tipo === "despesa")
            .reduce((total, t) => total + t.valor, 0);

          console.log("Totais calculados:", { receitas, despesas });

          // Agrupa transações por categoria
          const transacoesPorCategoria = transacoesFiltradas.reduce<
            Record<string, { receitas: number; despesas: number }>
          >((acc, transacao) => {
            const categoria = transacao.categoria;
            acc[categoria] ??= { receitas: 0, despesas: 0 };
            if (transacao.tipo === "receita") {
              acc[categoria].receitas += transacao.valor;
            } else {
              acc[categoria].despesas += transacao.valor;
            }
            return acc;
          }, {});

          console.log(
            "Transações agrupadas por categoria:",
            transacoesPorCategoria
          );

          // Agrupa transações por forma de pagamento
          const transacoesPorFormaPagamento = transacoesFiltradas.reduce<
            Record<string, { receitas: number; despesas: number }>
          >((acc, transacao) => {
            const forma = transacao.formaPagamento;
            acc[forma] ??= { receitas: 0, despesas: 0 };
            if (transacao.tipo === "receita") {
              acc[forma].receitas += transacao.valor;
            } else {
              acc[forma].despesas += transacao.valor;
            }
            return acc;
          }, {});

          console.log(
            "Transações agrupadas por forma de pagamento:",
            transacoesPorFormaPagamento
          );

          // Agrupa transações por dia
          const transacoesPorDia = transacoesFiltradas.reduce<
            Record<string, { receitas: number; despesas: number }>
          >((acc, transacao) => {
            const data = new Date(transacao.data).toISOString().split("T")[0];
            acc[data] ??= { receitas: 0, despesas: 0 };
            if (transacao.tipo === "receita") {
              acc[data].receitas += transacao.valor;
            } else {
              acc[data].despesas += transacao.valor;
            }
            return acc;
          }, {});

          console.log("Transações agrupadas por dia:", transacoesPorDia);

          const relatorio: RelatorioFinanceiro = {
            periodo,
            saldoInicial: 0, // TODO: Implementar cálculo do saldo inicial
            saldoFinal: receitas - despesas,
            totalReceitas: receitas,
            totalDespesas: despesas,
            receitasPorCategoria: Object.entries(transacoesPorCategoria)
              .filter(([_, dados]) => dados.receitas > 0)
              .map(([categoria, dados]) => ({
                categoria,
                quantidade: 1,
                valor: dados.receitas,
              })),
            despesasPorCategoria: Object.entries(transacoesPorCategoria)
              .filter(([_, dados]) => dados.despesas > 0)
              .map(([categoria, dados]) => ({
                categoria,
                quantidade: 1,
                valor: dados.despesas,
              })),
            receitasPorFormaPagamento: Object.entries(
              transacoesPorFormaPagamento
            )
              .filter(([_, dados]) => dados.receitas > 0)
              .map(([forma, dados]) => ({
                forma,
                quantidade: 1,
                valor: dados.receitas,
              })),
            despesasPorFormaPagamento: Object.entries(
              transacoesPorFormaPagamento
            )
              .filter(([_, dados]) => dados.despesas > 0)
              .map(([forma, dados]) => ({
                forma,
                quantidade: 1,
                valor: dados.despesas,
              })),
            fluxoCaixa: Object.entries(transacoesPorDia).map(
              ([data, dados]) => ({
                data: new Date(data),
                receitas: dados.receitas,
                despesas: dados.despesas,
                saldo: dados.receitas - dados.despesas,
              })
            ),
          };

          console.log("Relatório financeiro gerado:", relatorio);

          set({ relatorioFinanceiro: relatorio, isLoading: false });
          return relatorio;
        } catch (error) {
          console.error("Erro ao gerar relatório financeiro:", error);
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

      gerarRelatorioEstoque: async (periodo: { inicio: Date; fim: Date }) => {
        try {
          console.log("Gerando relatório de estoque para o período:", periodo);
          set({ isLoading: true, error: null });

          // Usando dados do store local em vez de chamada à API
          const produtos = useProdutoStore.getState().produtos;
          console.log("Produtos carregados do store:", produtos);

          // Agrupa produtos por categoria
          const produtosPorCategoria = produtos.reduce<
            Record<string, { quantidade: number }>
          >((acc, produto) => {
            const categoria = produto.categoria;
            acc[categoria] ??= { quantidade: 0 };
            acc[categoria].quantidade += produto.estoque;
            return acc;
          }, {});

          console.log(
            "Produtos agrupados por categoria:",
            produtosPorCategoria
          );

          // Calcula totais
          const totalProdutos = produtos.reduce(
            (total, produto) => total + produto.estoque,
            0
          );

          console.log("Totais calculados:", {
            totalProdutos,
          });

          // Identifica produtos com estoque baixo
          const produtosEstoqueBaixo = produtos.filter(
            (p) => p.estoque < p.estoqueMinimo
          );

          const relatorio: RelatorioEstoque = {
            periodo,
            totalProdutos,
            produtosPorCategoria: Object.entries(produtosPorCategoria).map(
              ([categoria, dados]) => ({
                categoria,
                quantidade: dados.quantidade,
              })
            ),
            produtosBaixoEstoque: produtosEstoqueBaixo.map((p) => ({
              produto: p,
              estoqueAtual: p.estoque,
              estoqueMinimo: p.estoqueMinimo,
            })),
            produtosSemEstoque: produtos
              .filter((p) => p.estoque === 0)
              .map((p) => ({
                produto: p,
                estoqueAtual: p.estoque,
                estoqueMinimo: p.estoqueMinimo,
              })),
          };

          console.log("Relatório de estoque gerado:", relatorio);
          set({ relatorioEstoque: relatorio, isLoading: false });
          return relatorio;
        } catch (error) {
          console.error("Erro ao gerar relatório de estoque:", error);
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

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },
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

// Store de Usuários
export const useUsuarioStore = create<UsuarioStore>((set) => ({
  usuarios: [],
  loading: false,
  error: null,

  fetchUsuarios: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch("/api/usuarios");
      if (!response.ok) throw new Error("Erro ao carregar usuários");
      const data = (await response.json()) as Usuario[];
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
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error("Erro ao adicionar usuário");
      const data = (await response.json()) as Usuario;
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
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuário");
      const data = (await response.json()) as Usuario;
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

  setError: (error) => {
    set({ error });
  },
}));

export const useEstoqueStore = create<EstoqueState>()(
  persist(
    (set, get) => ({
      movimentacoes: [],
      ajustes: [],
      transferencias: [],
      isLoading: false,
      error: null,
      adicionarMovimentacao: (movimentacao) => {
        try {
          set({ isLoading: true, error: null });
          const novaMovimentacao = {
            ...movimentacao,
            id: crypto.randomUUID(),
            data: new Date(),
          };
          set((state) => ({
            movimentacoes: [...state.movimentacoes, novaMovimentacao],
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar movimentação",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      adicionarAjuste: (ajuste) => {
        try {
          set({ isLoading: true, error: null });
          const novoAjuste = {
            ...ajuste,
            id: crypto.randomUUID(),
            data: new Date(),
          };
          set((state) => ({
            ajustes: [...state.ajustes, novoAjuste],
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar ajuste",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      adicionarTransferencia: (transferencia) => {
        try {
          set({ isLoading: true, error: null });
          const novaTransferencia = {
            ...transferencia,
            id: crypto.randomUUID(),
            data: new Date(),
          };
          set((state) => ({
            transferencias: [...state.transferencias, novaTransferencia],
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao adicionar transferência",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      atualizarTransferencia: (id, status) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            transferencias: state.transferencias.map((t) =>
              t.id === id ? { ...t, status } : t
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Erro ao atualizar transferência",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      getMovimentacoesPorProduto: (produtoId) => {
        return get().movimentacoes.filter((m) => m.produto.id === produtoId);
      },
      getAjustesPorProduto: (produtoId) => {
        return get().ajustes.filter((a) => a.produto.id === produtoId);
      },
      getTransferenciasPorProduto: (produtoId) => {
        return get().transferencias.filter((t) => t.produto.id === produtoId);
      },
      getProdutosBaixoEstoque: () => {
        const produtos = useProdutoStore.getState().produtos;
        return produtos
          .filter((p) => p.estoque < p.estoqueMinimo)
          .map((p) => ({
            produto: p,
            estoqueAtual: p.estoque,
            estoqueMinimo: p.estoqueMinimo,
          }));
      },
      getProdutosSemEstoque: () => {
        const produtos = useProdutoStore.getState().produtos;
        return produtos.filter((p) => p.estoque === 0);
      },
      getHistoricoMovimentacoes: (periodo) => {
        const movimentacoes = get().movimentacoes;
        if (!periodo) return movimentacoes;
        return movimentacoes.filter(
          (m) => m.data >= periodo.inicio && m.data <= periodo.fim
        );
      },
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: "estoque-storage",
    }
  )
);
