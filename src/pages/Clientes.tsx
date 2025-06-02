import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch, FaPlus, FaWhatsapp, FaEye } from "react-icons/fa";
import { ExportButton } from "@/components/ui/export-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Cliente } from "@/types";
import { getClientes } from "@/services/mockData";
import { formatarWhatsAppLink, formatarWhatsAppMensagem } from "@/utils/masks";
import { ClienteModal } from "@/components/cliente/cliente-modal";
import { useNavigate } from "react-router-dom";

const Clientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>(getClientes());
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.cpf.includes(searchTerm)
  );

  const handleAbrirModal = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setClienteSelecionado(null);
  };

  const handleNovoCliente = () => {
    navigate("/novo-cliente");
  };

  const handleEnviarCobranca = (cliente: Cliente) => {
    const mensagem =
      `Olá ${cliente.nome}, gostaria de lembrar sobre os pagamentos pendentes.\n\n` +
      `Valor total pendente: ${cliente.pendingValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}\n\n` +
      `Para mais informações sobre suas compras, entre em contato conosco.\n` +
      `Agradecemos a atenção!`;

    const whatsappLink = `${formatarWhatsAppLink(
      cliente.whatsapp
    )}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, "_blank");
  };

  const headers = ["Nome", "Email", "Telefone", "WhatsApp", "Valor Pendente"];

  const exportData = filteredClientes.map((cliente) => ({
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    whatsapp: cliente.whatsapp,
    valor_pendente: cliente.pendingValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie seus clientes e acompanhe suas compras
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="relative flex-1 mb-6">
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead className="text-right">Valor Pendente</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e acompanhe suas compras
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            filename="clientes"
            headers={headers}
            disabled={filteredClientes.length === 0}
          />
          <Button onClick={handleNovoCliente}>
            <FaPlus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 mb-6">
            <FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes por nome, email, telefone ou CPF..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead className="text-right">Valor Pendente</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">
                      {cliente.nome}
                    </TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell className="text-right">
                      {cliente.pendingValue > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                        >
                          {cliente.pendingValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                        >
                          Pago
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAbrirModal(cliente)}
                          className="h-8 w-8 p-0"
                          title="Ver detalhes"
                        >
                          <FaEye className="h-4 w-4 text-gray-500" />
                        </Button>
                        {cliente.pendingValue > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEnviarCobranca(cliente)}
                            className="h-8 w-8 p-0"
                            title="Enviar cobrança"
                          >
                            <FaWhatsapp className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClientes.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-32 text-muted-foreground"
                    >
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClienteModal
        cliente={clienteSelecionado}
        open={modalAberto}
        onClose={handleFecharModal}
      />
    </div>
  );
};

export default Clientes;
