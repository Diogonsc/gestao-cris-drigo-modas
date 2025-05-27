import { Cliente } from "../store";

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ClienteService {
  private static instance: ClienteService;
  private clientes: Cliente[] = [];

  private constructor() {}

  static getInstance(): ClienteService {
    if (!ClienteService.instance) {
      ClienteService.instance = new ClienteService();
    }
    return ClienteService.instance;
  }

  async listarClientes(): Promise<Cliente[]> {
    await delay(500); // Simula delay de rede
    return this.clientes;
  }

  async buscarClientePorId(id: string): Promise<Cliente | null> {
    await delay(300);
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente || null;
  }

  async criarCliente(
    cliente: Omit<Cliente, "id" | "dataCadastro">
  ): Promise<Cliente> {
    await delay(800);
    const novoCliente: Cliente = {
      ...cliente,
      id: crypto.randomUUID(),
      dataCadastro: new Date(),
    };
    this.clientes.push(novoCliente);
    return novoCliente;
  }

  async atualizarCliente(
    id: string,
    cliente: Partial<Cliente>
  ): Promise<Cliente> {
    await delay(600);
    const index = this.clientes.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Cliente não encontrado");
    }
    this.clientes[index] = { ...this.clientes[index], ...cliente };
    return this.clientes[index];
  }

  async removerCliente(id: string): Promise<void> {
    await delay(400);
    const index = this.clientes.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Cliente não encontrado");
    }
    this.clientes.splice(index, 1);
  }

  async buscarClientePorCPF(cpf: string): Promise<Cliente | null> {
    await delay(300);
    const cliente = this.clientes.find((c) => c.cpf === cpf);
    return cliente || null;
  }

  async buscarClientePorNome(nome: string): Promise<Cliente[]> {
    await delay(500);
    const termoBusca = nome.toLowerCase();
    return this.clientes.filter((c) =>
      c.nome.toLowerCase().includes(termoBusca)
    );
  }
}
