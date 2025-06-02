import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";
import { useToast } from "../ui/use-toast";
import { useFinanceiroStore } from "../../store";
import { DialogConfirm } from "../ui/dialog-confirm";
import { FormTransacao } from "./FormTransacao";
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
import { formatarMoeda, formatarData } from "../../lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Search } from "lucide-react";

export function ListaTransacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<"todos" | "receita" | "despesa">(
    "todos"
  );
  const [statusFilter, setStatusFilter] = useState<
    "todos" | "pendente" | "concluida" | "cancelada"
  >("todos");
  const [showForm, setShowForm] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<
    string | null
  >(null);

  const { toast } = useToast();
  const {
    transacoes,
    loading,
    error,
    fetchTransacoes,
    cancelarTransacao,
    saldoAtual,
    totalReceitas,
    totalDespesas,
  } = useFinanceiroStore();

  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setTipoFilter(value as typeof tipoFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as typeof statusFilter);
  };

  const handleEdit = (id: string) => {
    setTransacaoSelecionada(id);
    setShowForm(true);
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelarTransacao(id);
      toast({
        title: "Transação cancelada",
        description: "A transação foi cancelada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a transação.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmCancel = (id: string) => {
    setTransacaoSelecionada(id);
    setShowConfirmCancel(true);
  };

  const filteredTransacoes = transacoes.filter((transacao) => {
    const matchesSearch =
      transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoFilter === "todos" || transacao.tipo === tipoFilter;
    const matchesStatus =
      statusFilter === "todos" || transacao.status === statusFilter;

    return matchesSearch && matchesTipo && matchesStatus;
  });

  if (loading) {
    return <Loading text="Carregando transações..." />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Erro ao carregar transações: {error}</p>
        <Button onClick={() => fetchTransacoes()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Atual</CardTitle>
            <CardDescription>Saldo disponível em caixa</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatarMoeda(saldoAtual)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Receitas</CardTitle>
            <CardDescription>Receitas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {formatarMoeda(totalReceitas)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Despesas</CardTitle>
            <CardDescription>Despesas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatarMoeda(totalDespesas)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
          <CardDescription>
            Todas as transações financeiras registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou categoria..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <Select value={tipoFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransacoes.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{formatarData(transacao.data)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          transacao.tipo === "receita"
                            ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                            : "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                        }
                      >
                        {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{transacao.categoria}</TableCell>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell
                      className={
                        transacao.tipo === "receita"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatarMoeda(transacao.valor)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {transacao.formaPagamento === "dinheiro"
                          ? "Dinheiro"
                          : transacao.formaPagamento === "cartao_credito"
                          ? "Cartão de Crédito"
                          : transacao.formaPagamento === "cartao_debito"
                          ? "Cartão de Débito"
                          : transacao.formaPagamento === "pix"
                          ? "PIX"
                          : "Transferência"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          transacao.status === "concluida"
                            ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                            : transacao.status === "pendente"
                            ? "text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                            : "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                        }
                      >
                        {transacao.status === "concluida"
                          ? "Concluída"
                          : transacao.status === "pendente"
                          ? "Pendente"
                          : "Cancelada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(transacao.id)}
                          >
                            Editar
                          </DropdownMenuItem>
                          {transacao.status === "pendente" && (
                            <DropdownMenuItem
                              onClick={() => handleConfirmCancel(transacao.id)}
                              className="text-red-600"
                            >
                              Cancelar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <DialogConfirm
          open={showForm}
          onOpenChange={setShowForm}
          title={transacaoSelecionada ? "Editar Transação" : "Nova Transação"}
          description=""
          onConfirm={() => {}}
          showConfirmButton={false}
        >
          <FormTransacao
            transacao={
              transacaoSelecionada
                ? transacoes.find((t) => t.id === transacaoSelecionada)
                : undefined
            }
            onSuccess={() => {
              setShowForm(false);
              setTransacaoSelecionada(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setTransacaoSelecionada(null);
            }}
          />
        </DialogConfirm>
      )}

      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Cancelar transação"
        description="Tem certeza que deseja cancelar esta transação?"
        onConfirm={() => {
          if (transacaoSelecionada) {
            handleCancel(transacaoSelecionada);
          }
          setShowConfirmCancel(false);
          setTransacaoSelecionada(null);
        }}
      />
    </div>
  );
}
