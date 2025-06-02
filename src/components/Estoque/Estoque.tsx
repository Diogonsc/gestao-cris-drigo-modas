import { useEffect, useState } from "react";
import { useEstoqueStore, useProdutoStore } from "../../store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { Loading } from "../ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatarData, formatarMoeda } from "../../lib/utils";
import { useAuthStore } from "../../store";
import {
  AlertCircle,
  Package,
  TrendingDown,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Search } from "lucide-react";

export default function Estoque() {
  const [isLoading, setIsLoading] = useState(false);
  const [showMovimentacaoDialog, setShowMovimentacaoDialog] = useState(false);
  const [showAjusteDialog, setShowAjusteDialog] = useState(false);
  const [showTransferenciaDialog, setShowTransferenciaDialog] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState<"entrada" | "saida">(
    "entrada"
  );
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [documento, setDocumento] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();
  const { user } = useAuthStore();
  const { produtos } = useProdutoStore();
  const {
    movimentacoes,
    ajustes,
    transferencias,
    isLoading: isLoadingEstoque,
    error,
    adicionarMovimentacao,
    adicionarAjuste,
    adicionarTransferencia,
    atualizarTransferencia,
    getProdutosBaixoEstoque,
    getProdutosSemEstoque,
    getHistoricoMovimentacoes,
  } = useEstoqueStore();

  const produtosBaixoEstoque = getProdutosBaixoEstoque();
  const produtosSemEstoque = getProdutosSemEstoque();
  const historicoMovimentacoes = getHistoricoMovimentacoes();

  const handleMovimentacao = async () => {
    if (!selectedProduto || !quantidade || !motivo || !user) return;

    try {
      setIsLoading(true);
      const produto = produtos.find((p) => p.id === selectedProduto);
      if (!produto) throw new Error("Produto não encontrado");

      await adicionarMovimentacao({
        produto,
        tipo: tipoMovimentacao,
        quantidade,
        motivo,
        observacoes,
        usuario: user,
        documento,
      });

      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso.",
      });

      setShowMovimentacaoDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a movimentação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAjuste = async () => {
    if (!selectedProduto || !quantidade || !motivo || !user) return;

    try {
      setIsLoading(true);
      const produto = produtos.find((p) => p.id === selectedProduto);
      if (!produto) throw new Error("Produto não encontrado");

      await adicionarAjuste({
        produto,
        quantidadeAnterior: produto.estoque,
        quantidadeNova: quantidade,
        motivo,
        observacoes,
        usuario: user,
      });

      toast({
        title: "Sucesso",
        description: "Ajuste de estoque realizado com sucesso.",
      });

      setShowAjusteDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o ajuste de estoque.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferencia = async () => {
    if (!selectedProduto || !quantidade || !origem || !destino || !user) return;

    try {
      setIsLoading(true);
      const produto = produtos.find((p) => p.id === selectedProduto);
      if (!produto) throw new Error("Produto não encontrado");

      await adicionarTransferencia({
        produto,
        quantidade,
        origem,
        destino,
        status: "pendente",
        observacoes,
        usuario: user,
      });

      toast({
        title: "Sucesso",
        description: "Transferência registrada com sucesso.",
      });

      setShowTransferenciaDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a transferência.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConcluirTransferencia = async (id: string) => {
    try {
      setIsLoading(true);
      await atualizarTransferencia(id, "concluida");
      toast({
        title: "Sucesso",
        description: "Transferência concluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível concluir a transferência.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedProduto("");
    setQuantidade(0);
    setMotivo("");
    setObservacoes("");
    setTipoMovimentacao("entrada");
    setOrigem("");
    setDestino("");
    setDocumento("");
  };

  const filteredMovimentacoes = movimentacoes.filter(
    (mov) =>
      mov.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingEstoque) {
    return <Loading text="Carregando estoque..." />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Erro ao carregar estoque: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque e acompanhe as movimentações de produtos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Movimentação
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações de Estoque</CardTitle>
          <CardDescription>
            Registro de todas as movimentações de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="movimentacoes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
              <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
              <TabsTrigger value="transferencias">Transferências</TabsTrigger>
              <TabsTrigger value="alertas">Alertas</TabsTrigger>
            </TabsList>

            <TabsContent value="movimentacoes">
              <div className="relative flex-1 mb-6">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar movimentações por produto ou motivo..."
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
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Documento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovimentacoes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center h-32 text-muted-foreground"
                        >
                          Nenhuma movimentação encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMovimentacoes.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell>{formatarData(mov.data)}</TableCell>
                          <TableCell className="font-medium">
                            {mov.produto.nome}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                mov.tipo === "entrada"
                                  ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                                  : "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                              }
                            >
                              {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                            </Badge>
                          </TableCell>
                          <TableCell>{mov.quantidade}</TableCell>
                          <TableCell>{mov.motivo}</TableCell>
                          <TableCell>{mov.usuario}</TableCell>
                          <TableCell>{mov.documento}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="ajustes">
              <Card>
                <CardHeader>
                  <CardTitle>Ajustes de Estoque</CardTitle>
                  <CardDescription>
                    Registro de ajustes realizados no estoque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade Anterior</TableHead>
                        <TableHead>Nova Quantidade</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Usuário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ajustes.map((ajuste) => (
                        <TableRow key={ajuste.id}>
                          <TableCell>{formatarData(ajuste.data)}</TableCell>
                          <TableCell>{ajuste.produto.nome}</TableCell>
                          <TableCell>{ajuste.quantidadeAnterior}</TableCell>
                          <TableCell>{ajuste.quantidadeNova}</TableCell>
                          <TableCell>{ajuste.motivo}</TableCell>
                          <TableCell>{ajuste.usuario.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transferencias">
              <Card>
                <CardHeader>
                  <CardTitle>Transferências</CardTitle>
                  <CardDescription>
                    Registro de transferências entre unidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transferencias.map((transferencia) => (
                        <TableRow key={transferencia.id}>
                          <TableCell>
                            {formatarData(transferencia.data)}
                          </TableCell>
                          <TableCell>{transferencia.produto.nome}</TableCell>
                          <TableCell>{transferencia.quantidade}</TableCell>
                          <TableCell>{transferencia.origem}</TableCell>
                          <TableCell>{transferencia.destino}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transferencia.status === "concluida"
                                  ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                                  : "text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                              }
                            >
                              {transferencia.status === "concluida"
                                ? "Concluída"
                                : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>{transferencia.usuario.name}</TableCell>
                          <TableCell>
                            {transferencia.status === "pendente" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleConcluirTransferencia(transferencia.id)
                                }
                              >
                                Concluir
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alertas">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos em Baixo Estoque</CardTitle>
                    <CardDescription>
                      Produtos com estoque abaixo do mínimo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Estoque Atual</TableHead>
                          <TableHead>Estoque Mínimo</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produtosBaixoEstoque.map(
                          ({ produto, estoqueAtual, estoqueMinimo }) => (
                            <TableRow key={produto.id}>
                              <TableCell>{produto.nome}</TableCell>
                              <TableCell>{estoqueAtual}</TableCell>
                              <TableCell>{estoqueMinimo}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800"
                                >
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  Baixo Estoque
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Sem Estoque</CardTitle>
                    <CardDescription>
                      Produtos com estoque zerado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produtosSemEstoque.map((produto) => (
                          <TableRow key={produto.id}>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell>{produto.codigo}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Sem Estoque
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
          </DialogHeader>
          <FormMovimentacao onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
