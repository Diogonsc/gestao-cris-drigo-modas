import { useState } from "react";
import { useRelatorioStore } from "../../store";
import { Button } from "../ui/button";
import { Loading } from "../ui/loading";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatarMoeda, formatarData } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type TipoRelatorio = "vendas" | "financeiro" | "estoque";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("vendas");
  const [periodo, setPeriodo] = useState({
    inicio: new Date(new Date().setDate(1)), // Primeiro dia do mês atual
    fim: new Date(), // Hoje
  });
  const { toast } = useToast();

  const {
    relatorioVendas,
    relatorioFinanceiro,
    relatorioEstoque,
    isLoading,
    error,
    gerarRelatorioVendas,
    gerarRelatorioFinanceiro,
    gerarRelatorioEstoque,
  } = useRelatorioStore();

  const handleGerarRelatorio = async () => {
    try {
      switch (tipoRelatorio) {
        case "vendas":
          await gerarRelatorioVendas(periodo);
          break;
        case "financeiro":
          await gerarRelatorioFinanceiro(periodo);
          break;
        case "estoque":
          await gerarRelatorioEstoque();
          break;
      }
      toast({
        title: "Relatório gerado",
        description: "O relatório foi gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize e analise os dados do seu negócio
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-[400px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize e analise os dados do seu negócio
            </p>
          </div>
        </div>
        <div className="text-center text-red-500 p-4">
          <p>Erro ao gerar relatório: {error}</p>
          <Button onClick={handleGerarRelatorio} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize e analise os dados do seu negócio
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>
            Selecione o tipo de relatório e o período desejado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select
                value={tipoRelatorio}
                onValueChange={(value) =>
                  setTipoRelatorio(value as TipoRelatorio)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="estoque">Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoRelatorio !== "estoque" && (
              <>
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Input
                    type="date"
                    value={periodo.inicio.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setPeriodo((prev) => ({
                        ...prev,
                        inicio: new Date(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Input
                    type="date"
                    value={periodo.fim.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setPeriodo((prev) => ({
                        ...prev,
                        fim: new Date(e.target.value),
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>

          <Button onClick={handleGerarRelatorio} className="w-full md:w-auto">
            Gerar Relatório
          </Button>
        </CardContent>
      </Card>

      <Tabs
        value={tipoRelatorio}
        onValueChange={(value) => setTipoRelatorio(value as TipoRelatorio)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas">
          {relatorioVendas && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total de Vendas</CardTitle>
                    <CardDescription>
                      Período: {formatarData(relatorioVendas.periodo.inicio)} a{" "}
                      {formatarData(relatorioVendas.periodo.fim)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {relatorioVendas.totalVendas}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Valor Total: {formatarMoeda(relatorioVendas.valorTotal)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vendas por Forma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={relatorioVendas.vendasPorFormaPagamento}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="forma" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="valor" name="Valor" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={relatorioVendas.vendasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="data"
                        tickFormatter={(value) => formatarData(value)}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => formatarData(value)}
                        formatter={(value) => formatarMoeda(value as number)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        name="Valor"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Mais Vendidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatorioVendas.produtosMaisVendidos.map((item) => (
                          <TableRow key={item.produto.id}>
                            <TableCell>{item.produto.nome}</TableCell>
                            <TableCell>{item.quantidade}</TableCell>
                            <TableCell>{formatarMoeda(item.valor)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Clientes Mais Frequentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Compras</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatorioVendas.clientesMaisFrequentes.map((item) => (
                          <TableRow key={item.cliente.id}>
                            <TableCell>{item.cliente.nome}</TableCell>
                            <TableCell>{item.quantidade}</TableCell>
                            <TableCell>{formatarMoeda(item.valor)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="financeiro">
          {relatorioFinanceiro && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo Inicial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatarMoeda(relatorioFinanceiro.saldoInicial)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Saldo Final</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatarMoeda(relatorioFinanceiro.saldoFinal)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resultado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatarMoeda(
                        relatorioFinanceiro.totalReceitas -
                          relatorioFinanceiro.totalDespesas
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Receitas:{" "}
                      {formatarMoeda(relatorioFinanceiro.totalReceitas)}
                      <br />
                      Despesas:{" "}
                      {formatarMoeda(relatorioFinanceiro.totalDespesas)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Receitas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={relatorioFinanceiro.receitasPorCategoria}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="categoria" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatarMoeda(value as number)}
                        />
                        <Legend />
                        <Bar dataKey="valor" name="Valor" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Despesas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={relatorioFinanceiro.despesasPorCategoria}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="categoria" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatarMoeda(value as number)}
                        />
                        <Legend />
                        <Bar dataKey="valor" name="Valor" fill="#f87171" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Caixa</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={relatorioFinanceiro.fluxoCaixa}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="data"
                        tickFormatter={(value) => formatarData(value)}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => formatarData(value)}
                        formatter={(value) => formatarMoeda(value as number)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="receitas"
                        name="Receitas"
                        stroke="#4ade80"
                      />
                      <Line
                        type="monotone"
                        dataKey="despesas"
                        name="Despesas"
                        stroke="#f87171"
                      />
                      <Line
                        type="monotone"
                        dataKey="saldo"
                        name="Saldo"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="estoque">
          {relatorioEstoque && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos com Estoque Baixo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Estoque Atual</TableHead>
                          <TableHead>Estoque Mínimo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatorioEstoque.produtosBaixoEstoque.map((item) => (
                          <TableRow key={item.produto.id}>
                            <TableCell>{item.produto.nome}</TableCell>
                            <TableCell>{item.estoqueAtual}</TableCell>
                            <TableCell>{item.estoqueMinimo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Sem Estoque</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Código</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatorioEstoque.produtosSemEstoque.map((produto) => (
                          <TableRow key={produto.id}>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell>{produto.codigo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Mais Vendidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatorioEstoque.produtosMaisVendidos.map((item) => (
                          <TableRow key={item.produto.id}>
                            <TableCell>{item.produto.nome}</TableCell>
                            <TableCell>{item.quantidadeVendida}</TableCell>
                            <TableCell>
                              {formatarMoeda(item.valorVendido)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Menos Vendidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatorioEstoque.produtosMenosVendidos.map((item) => (
                          <TableRow key={item.produto.id}>
                            <TableCell>{item.produto.nome}</TableCell>
                            <TableCell>{item.quantidadeVendida}</TableCell>
                            <TableCell>
                              {formatarMoeda(item.valorVendido)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Movimentações de Estoque</CardTitle>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorioEstoque.movimentacoesEstoque.map(
                        (item, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatarData(item.data)}</TableCell>
                            <TableCell>{item.produto.nome}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.tipo === "entrada"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.tipo === "entrada" ? "Entrada" : "Saída"}
                              </span>
                            </TableCell>
                            <TableCell>{item.quantidade}</TableCell>
                            <TableCell>{item.motivo}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
