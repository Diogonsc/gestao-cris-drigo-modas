import { useState, useEffect } from "react";
import { useClienteStore } from "../../store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";
import { DialogConfirm } from "../ui/dialog-confirm";
import { useToast } from "../ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MoreHorizontal, Search, Plus, Edit, Trash2, User } from "lucide-react";
import { FormCliente } from "./FormCliente";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Cliente } from "../../store";

export function ListaClientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(
    null
  );
  const { toast } = useToast();

  const { clientes, loading, error, fetchClientes, removerCliente, setError } =
    useClienteStore();

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredClientes = clientes.filter((cliente) => {
    const matchSearch =
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFiltro === "Todos" || cliente.status === statusFiltro;

    return matchSearch && matchStatus;
  });

  const handleEdit = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setShowForm(true);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteParaExcluir(cliente);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!clienteParaExcluir) return;

    try {
      await removerCliente(clienteParaExcluir.id);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao excluir cliente"
      );
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setClienteParaExcluir(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setClienteSelecionado(null);
    fetchClientes();
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
  };

  if (loading) {
    return <Loading text="Carregando clientes..." />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar clientes: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade/UF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {cliente.nome}
                    </div>
                  </TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    {cliente.endereco.cidade}/{cliente.endereco.estado}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        cliente.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(cliente)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {clienteSelecionado ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <FormCliente
            cliente={clienteSelecionado || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setClienteSelecionado(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <DialogConfirm
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Excluir Cliente"
        description={`Tem certeza que deseja excluir o cliente "${clienteParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
