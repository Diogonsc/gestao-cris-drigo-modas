import { Cliente, Compra, Produto, Usuario, Empresa } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const mockClientes: Cliente[] = [
  {
    id: "c1",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    whatsapp: "11987654321",
    endereco: {
      cep: "01310-200",
      logradouro: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP"
    },
    pendingValue: 0
  },
  {
    id: "c2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    telefone: "(21) 98765-4321",
    whatsapp: "21987654321",
    endereco: {
      cep: "22250-040",
      logradouro: "Rua Barata Ribeiro",
      numero: "500",
      complemento: "",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ"
    },
    pendingValue: 350.75
  },
  {
    id: "c3",
    nome: "Pedro Santos",
    email: "pedro.santos@email.com",
    telefone: "(31) 98765-4321",
    whatsapp: "31987654321",
    endereco: {
      cep: "30130-110",
      logradouro: "Avenida Afonso Pena",
      numero: "1500",
      complemento: "Sala 303",
      bairro: "Centro",
      cidade: "Belo Horizonte",
      estado: "MG"
    },
    pendingValue: 0
  },
  {
    id: "c4",
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    telefone: "(41) 98765-4321",
    whatsapp: "41987654321",
    endereco: {
      cep: "80060-000",
      logradouro: "Rua XV de Novembro",
      numero: "700",
      complemento: "",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR"
    },
    pendingValue: 1250.50
  },
  {
    id: "c5",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    telefone: "(51) 98765-4321",
    whatsapp: "51987654321",
    endereco: {
      cep: "90030-100",
      logradouro: "Avenida Borges de Medeiros",
      numero: "5000",
      complemento: "Bloco B",
      bairro: "Centro",
      cidade: "Porto Alegre",
      estado: "RS"
    },
    pendingValue: 0
  },
];

const mockProdutos: Produto[] = [
  {
    id: "p1",
    nome: "Camiseta Básica P",
    sku: "CAM001",
    preco: 59.9,
    estoque: 15,
    categoria: "Vestuário",
    estoqueMinimo: 5
  },
  {
    id: "p2",
    nome: "Calça Jeans 42",
    sku: "CAL001",
    preco: 129.9,
    estoque: 8,
    categoria: "Vestuário",
    estoqueMinimo: 3
  },
  {
    id: "p3",
    nome: "Tênis Casual 39",
    sku: "TEN001",
    preco: 199.9,
    estoque: 5,
    categoria: "Calçados",
    estoqueMinimo: 2
  },
  {
    id: "p4",
    nome: "Moletom Unissex G",
    sku: "MOL001",
    preco: 149.9,
    estoque: 12,
    categoria: "Vestuário",
    estoqueMinimo: 4
  },
  {
    id: "p5",
    nome: "Boné Aba Reta",
    sku: "BON001",
    preco: 49.9,
    estoque: 20,
    categoria: "Acessórios",
    estoqueMinimo: 5
  },
];

const mockCompras: Compra[] = [
  {
    id: "co1",
    clienteId: "c2",
    produtos: [
      {
        produto: mockProdutos[0],
        quantidade: 2,
        valorUnitario: 59.9,
        valorTotal: 119.8
      },
      {
        produto: mockProdutos[4],
        quantidade: 1,
        valorUnitario: 49.9,
        valorTotal: 49.9
      }
    ],
    dataCompra: "2025-05-01T15:30:00",
    valorTotal: 169.7,
    tipoPagamento: "parcelado",
    numeroParcelas: 3,
    valorPago: 56.57,
    status: "parcialmente_pago"
  },
  {
    id: "co2",
    clienteId: "c2",
    produtos: [
      {
        produto: mockProdutos[1],
        quantidade: 1,
        valorUnitario: 129.9,
        valorTotal: 129.9
      }
    ],
    dataCompra: "2025-05-02T10:15:00",
    valorTotal: 129.9,
    tipoPagamento: "parcelado",
    numeroParcelas: 2,
    valorPago: 65.0,
    status: "parcialmente_pago"
  },
  {
    id: "co3",
    clienteId: "c4",
    produtos: [
      {
        produto: mockProdutos[2],
        quantidade: 2,
        valorUnitario: 199.9,
        valorTotal: 399.8
      },
      {
        produto: mockProdutos[3],
        quantidade: 1,
        valorUnitario: 149.9,
        valorTotal: 149.9
      }
    ],
    dataCompra: "2025-05-01T09:45:00",
    valorTotal: 549.7,
    tipoPagamento: "parcelado",
    numeroParcelas: 5,
    valorPago: 220.0,
    status: "parcialmente_pago"
  }
];

const mockUsuarios: Usuario[] = [
  {
    id: "u1",
    nome: "Admin",
    email: "admin@empresa.com",
    funcao: "admin"
  },
  {
    id: "u2",
    nome: "Vendedor",
    email: "vendedor@empresa.com",
    funcao: "vendedor"
  },
  {
    id: "u3",
    nome: "Visualizador",
    email: "visualizador@empresa.com",
    funcao: "visualizador"
  }
];

const empresa: Empresa = {
  nome: "Gestão Pro",
  email: "contato@gestaopro.com.br",
  telefone: "(11) 3456-7890",
  logo: null,
  corPrimaria: "#0099ff"
};

export const getClientes = () => mockClientes;
export const getProdutos = () => mockProdutos;
export const getCompras = () => mockCompras;
export const getComprasPorCliente = (clienteId: string) => mockCompras.filter(c => c.clienteId === clienteId);
export const getUsuarios = () => mockUsuarios;
export const getEmpresa = () => empresa;

export const adicionarCliente = (cliente: Omit<Cliente, 'id'>) => {
  const novoCliente = { ...cliente, id: uuidv4() };
  mockClientes.push(novoCliente as Cliente);
  return novoCliente;
};

export const atualizarCliente = (cliente: Cliente) => {
  const index = mockClientes.findIndex(c => c.id === cliente.id);
  if (index !== -1) {
    mockClientes[index] = cliente;
    return cliente;
  }
  return null;
};

export const excluirCliente = (id: string) => {
  const index = mockClientes.findIndex(c => c.id === id);
  if (index !== -1) {
    mockClientes.splice(index, 1);
    return true;
  }
  return false;
};

export const adicionarCompra = (compra: Omit<Compra, 'id'>) => {
  const novaCompra = { ...compra, id: uuidv4() };
  mockCompras.push(novaCompra as Compra);
  
  // Atualizar o valor pendente do cliente
  const cliente = mockClientes.find(c => c.id === compra.clienteId);
  if (cliente) {
    cliente.pendingValue += (compra.valorTotal - compra.valorPago);
  }
  
  return novaCompra;
};

export const registrarPagamento = (compraId: string, valor: number) => {
  const compra = mockCompras.find(c => c.id === compraId);
  if (!compra) return null;
  
  compra.valorPago += valor;
  
  // Atualizar status
  if (compra.valorPago >= compra.valorTotal) {
    compra.status = 'quitado';
  } else if (compra.valorPago > 0) {
    compra.status = 'parcialmente_pago';
  }
  
  // Atualizar valor pendente do cliente
  const cliente = mockClientes.find(c => c.id === compra.clienteId);
  if (cliente) {
    cliente.pendingValue = getComprasPorCliente(cliente.id)
      .reduce((total, compra) => total + (compra.valorTotal - compra.valorPago), 0);
  }
  
  return compra;
};

// Função auxiliar para gerar dados para gráficos
export const getDadosVendasPorPeriodo = () => {
  return [
    { nome: "Jan", valor: 4000 },
    { nome: "Fev", valor: 3000 },
    { nome: "Mar", valor: 2000 },
    { nome: "Abr", valor: 2780 },
    { nome: "Mai", valor: 1890 },
    { nome: "Jun", valor: 2390 },
    { nome: "Jul", valor: 3490 },
    { nome: "Ago", valor: 3300 },
    { nome: "Set", valor: 2500 },
    { nome: "Out", valor: 2800 },
    { nome: "Nov", valor: 3300 },
    { nome: "Dez", valor: 4100 },
  ];
};

export const getDadosProdutosMaisVendidos = () => {
  return [
    { nome: "Camiseta Básica P", quantidade: 120 },
    { nome: "Calça Jeans 42", quantidade: 80 },
    { nome: "Tênis Casual 39", quantidade: 70 },
    { nome: "Moletom Unissex G", quantidade: 50 },
    { nome: "Boné Aba Reta", quantidade: 30 },
  ];
};

export const getDadosClientesMaisAtivos = () => {
  return [
    { nome: "João Silva", compras: 8 },
    { nome: "Maria Oliveira", compras: 6 },
    { nome: "Ana Costa", compras: 5 },
    { nome: "Carlos Ferreira", compras: 4 },
    { nome: "Pedro Santos", compras: 2 },
  ];
};

export const adicionarProduto = (produto: Produto) => {
  mockProdutos.push(produto);
  return produto;
};

export const atualizarProduto = (produto: Produto) => {
  const index = mockProdutos.findIndex(p => p.id === produto.id);
  if (index !== -1) {
    mockProdutos[index] = produto;
    return produto;
  }
  return null;
};

export const excluirProduto = (id: string) => {
  const index = mockProdutos.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProdutos.splice(index, 1);
    return true;
  }
  return false;
};

export const getProdutoPorId = (id: string) => {
  return mockProdutos.find(p => p.id === id);
};
