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
import { AlertCircle, Package, TrendingDown, TrendingUp } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowMovimentacaoDialog(true)}>
            Nova Movimentação
          </Button>
          <Button variant="outline" onClick={() => setShowAjusteDialog(true)}>
            Ajuste de Estoque
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTransferenciaDialog(true)}
          >
            Transferência
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Produtos em Baixo Estoque
              </p>
              <h3 className="text-2xl font-bold">
                {produtosBaixoEstoque.length}
              </h3>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Produtos Sem Estoque
              </p>
              <h3 className="text-2xl font-bold">
                {produtosSemEstoque.length}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Produtos</p>
              <h3 className="text-2xl font-bold">{produtos.length}</h3>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="movimentacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
          <TabsTrigger value="transferencias">Transferências</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="movimentacoes">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
              <CardDescription>
                Registro de todas as movimentações de estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {historicoMovimentacoes.map((movimentacao) => (
                    <TableRow key={movimentacao.id}>
                      <TableCell>{formatarData(movimentacao.data)}</TableCell>
                      <TableCell>{movimentacao.produto.nome}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            movimentacao.tipo === "entrada"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {movimentacao.tipo === "entrada" ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {movimentacao.tipo === "entrada"
                            ? "Entrada"
                            : "Saída"}
                        </span>
                      </TableCell>
                      <TableCell>{movimentacao.quantidade}</TableCell>
                      <TableCell>{movimentacao.motivo}</TableCell>
                      <TableCell>{movimentacao.usuario.name}</TableCell>
                      <TableCell>{movimentacao.documento || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                      <TableCell>{formatarData(transferencia.data)}</TableCell>
                      <TableCell>{transferencia.produto.nome}</TableCell>
                      <TableCell>{transferencia.quantidade}</TableCell>
                      <TableCell>{transferencia.origem}</TableCell>
                      <TableCell>{transferencia.destino}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transferencia.status === "concluida"
                              ? "bg-green-100 text-green-800"
                              : transferencia.status === "pendente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transferencia.status === "concluida"
                            ? "Concluída"
                            : transferencia.status === "pendente"
                            ? "Pendente"
                            : "Cancelada"}
                        </span>
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
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Baixo Estoque
                            </span>
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
                <CardDescription>Produtos com estoque zerado</CardDescription>
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Sem Estoque
                          </span>
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

      {/* Dialog de Movimentação */}
      <Dialog
        open={showMovimentacaoDialog}
        onOpenChange={setShowMovimentacaoDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>
              Registre uma nova movimentação de estoque
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Select
                value={selectedProduto}
                onValueChange={setSelectedProduto}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select
                value={tipoMovimentacao}
                onValueChange={(value: "entrada" | "saida") =>
                  setTipoMovimentacao(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Motivo</Label>
              <Input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Compra de fornecedor, Venda, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Documento</Label>
              <Input
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Ex: Número da NF, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMovimentacaoDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleMovimentacao} disabled={isLoading}>
              Registrar Movimentação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Ajuste */}
      <Dialog open={showAjusteDialog} onOpenChange={setShowAjusteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuste de Estoque</DialogTitle>
            <DialogDescription>
              Realize um ajuste no estoque de um produto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Select
                value={selectedProduto}
                onValueChange={setSelectedProduto}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nova Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Motivo do Ajuste</Label>
              <Input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Inventário, Correção, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAjusteDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAjuste} disabled={isLoading}>
              Realizar Ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Transferência */}
      <Dialog
        open={showTransferenciaDialog}
        onOpenChange={setShowTransferenciaDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Transferência</DialogTitle>
            <DialogDescription>
              Registre uma transferência de estoque entre unidades
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Select
                value={selectedProduto}
                onValueChange={setSelectedProduto}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Origem</Label>
              <Input
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Ex: Loja Principal"
              />
            </div>

            <div className="space-y-2">
              <Label>Destino</Label>
              <Input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ex: Filial 1"
              />
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTransferenciaDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleTransferencia} disabled={isLoading}>
              Registrar Transferência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
