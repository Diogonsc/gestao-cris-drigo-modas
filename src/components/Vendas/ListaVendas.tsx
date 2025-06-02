import { useState, useEffect } from "react";
import { useVendaStore } from "../../store";
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
import {
  MoreHorizontal,
  Search,
  Plus,
  Edit,
  Trash2,
  Receipt,
  Filter,
  Eye,
} from "lucide-react";
import { FormVenda } from "./FormVenda";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Venda } from "../../store";
import { formatarMoeda, formatarData } from "../../lib/utils";
import { ExportButton } from "@/components/ui/export-button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ListaVendas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vendaParaExcluir, setVendaParaExcluir] = useState<Venda | null>(null);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const { vendas, isLoading, fetchVendas, cancelarVenda, setError } =
    useVendaStore();

  const filteredVendas = vendas.filter(
    (venda) =>
      venda.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.numero.toString().includes(searchTerm) ||
      (statusFilter !== "all" && venda.status === statusFilter)
  );

  const handleCancel = (venda: Venda) => {
    setVendaParaExcluir(venda);
    setShowDeleteConfirm(true);
  };

  const confirmCancel = async () => {
    if (vendaParaExcluir) {
      await cancelarVenda(vendaParaExcluir.id);
      setShowDeleteConfirm(false);
      setVendaParaExcluir(null);
      fetchVendas();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setVendaSelecionada(null);
    fetchVendas();
  };

  const headers = [
    "Data",
    "Cliente",
    "Valor Total",
    "Valor Pago",
    "Status",
    "Forma de Pagamento",
  ];

  const exportData = vendas.map((venda) => ({
    data: new Date(venda.data).toLocaleDateString("pt-BR"),
    cliente: venda.cliente.nome,
    valor_total: venda.total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    valor_pago: venda.valorPago.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    status: venda.status,
    forma_pagamento: venda.formaPagamento,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
            <p className="text-muted-foreground">
              Gerencie suas vendas e acompanhe o desempenho
            </p>
          </div>
          <div className="flex gap-2">
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" /> Nova Venda
            </Button>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-[400px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie as vendas e acompanhe o histórico de transações
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            filename="vendas"
            headers={headers}
            disabled={filteredVendas.length === 0}
          />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Venda
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
          <CardDescription>
            Todas as vendas registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vendas por cliente, produto ou código..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-32 text-muted-foreground"
                    >
                      Nenhuma venda encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendas.map((venda) => (
                    <TableRow key={venda.id}>
                      <TableCell>{formatarData(venda.data)}</TableCell>
                      <TableCell className="font-medium">
                        {venda.cliente.nome}
                      </TableCell>
                      <TableCell>{formatarMoeda(venda.valorTotal)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {venda.formaPagamento}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            venda.status === "concluida"
                              ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                              : venda.status === "cancelada"
                              ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                              : "text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                          }
                        >
                          {venda.status === "concluida"
                            ? "Concluída"
                            : venda.status === "cancelada"
                            ? "Cancelada"
                            : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setVendaSelecionada(venda);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancel(venda)}
                            disabled={venda.status === "cancelada"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.print()}
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nova Venda</DialogTitle>
          </DialogHeader>
          <FormVenda onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
          </DialogHeader>
          {vendaSelecionada && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Cliente</h3>
                  <p className="text-muted-foreground">
                    {vendaSelecionada.cliente.nome}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Data</h3>
                  <p className="text-muted-foreground">
                    {formatarData(vendaSelecionada.data)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Valor Total</h3>
                  <p className="text-muted-foreground">
                    {formatarMoeda(vendaSelecionada.total)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Valor Pago</h3>
                  <p className="text-muted-foreground">
                    {formatarMoeda(vendaSelecionada.valorPago)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-muted-foreground">
                    {vendaSelecionada.status === "concluida"
                      ? "Concluída"
                      : vendaSelecionada.status === "pendente"
                      ? "Pendente"
                      : "Cancelada"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Forma de Pagamento</h3>
                  <p className="text-muted-foreground">
                    {vendaSelecionada.formaPagamento}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Produtos</h3>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Produto</th>
                        <th className="text-right p-2">Quantidade</th>
                        <th className="text-right p-2">Valor Unitário</th>
                        <th className="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendaSelecionada.produtos.map((item) => (
                        <tr key={item.produto.id} className="border-b">
                          <td className="p-2">{item.produto.nome}</td>
                          <td className="text-right p-2">{item.quantidade}</td>
                          <td className="text-right p-2">
                            {formatarMoeda(item.valorUnitario)}
                          </td>
                          <td className="text-right p-2">
                            {formatarMoeda(item.valorTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DialogConfirm
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Cancelar Venda"
        description={`Tem certeza que deseja cancelar a venda "${vendaParaExcluir?.numero}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
