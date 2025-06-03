import { useState, useEffect } from "react";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Cores para os gráficos
const COLORS = [
  "#0ea5e9", // sky-500 - Azul principal
  "#10b981", // emerald-500 - Verde
  "#f59e0b", // amber-500 - Âmbar
  "#ef4444", // red-500 - Vermelho
  "#8b5cf6", // violet-500 - Violeta
  "#ec4899", // pink-500 - Rosa
  "#14b8a6", // teal-500 - Verde água
  "#f97316", // orange-500 - Laranja
];

// Cores para gráficos específicos
const CHART_COLORS = {
  vendas: {
    valor: "#0ea5e9", // sky-500
    quantidade: "#10b981", // emerald-500
    area: {
      valor: "#0ea5e9", // sky-500
      quantidade: "#10b981", // emerald-500
    },
  },
  financeiro: {
    receitas: "#10b981", // emerald-500
    despesas: "#ef4444", // red-500
    saldo: "#0ea5e9", // sky-500
    area: {
      receitas: "#10b981", // emerald-500
      despesas: "#ef4444", // red-500
      saldo: "#0ea5e9", // sky-500
    },
  },
  estoque: {
    quantidade: "#0ea5e9", // sky-500
    valorVendido: "#8b5cf6", // violet-500
    quantidadeVendida: "#14b8a6", // teal-500
  },
};

type TipoRelatorio = "vendas" | "financeiro" | "estoque";

// Adicionar tipos para os dados dos gráficos
type DadosGrafico = {
  name: string;
  percent: number;
};

type DadosFormaPagamento = {
  forma: string;
  valor: number;
};

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("vendas");
  const [periodo, setPeriodo] = useState({
    inicio: new Date("2024-03-01"), // Primeiro dia de março de 2024
    fim: new Date("2024-03-31"), // Último dia de março de 2024
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

  // Efeito para carregar o relatório inicial
  useEffect(() => {
    const carregarRelatorioInicial = async () => {
      try {
        console.log("Carregando relatório inicial:", tipoRelatorio);
        switch (tipoRelatorio) {
          case "vendas":
            await gerarRelatorioVendas(periodo);
            break;
          case "financeiro":
            await gerarRelatorioFinanceiro(periodo);
            break;
          case "estoque":
            await gerarRelatorioEstoque(periodo);
            break;
        }
      } catch (error) {
        console.error("Erro ao carregar relatório inicial:", error);
        toast({
          title: "Erro",
          description:
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o relatório inicial.",
          variant: "destructive",
        });
      }
    };

    void carregarRelatorioInicial();
  }, [
    tipoRelatorio,
    periodo,
    gerarRelatorioVendas,
    gerarRelatorioFinanceiro,
    gerarRelatorioEstoque,
    toast,
  ]);

  const handleGerarRelatorio = async () => {
    try {
      let relatorioData;
      switch (tipoRelatorio) {
        case "vendas":
          relatorioData = await gerarRelatorioVendas(periodo);
          break;
        case "financeiro":
          relatorioData = await gerarRelatorioFinanceiro(periodo);
          break;
        case "estoque":
          relatorioData = await gerarRelatorioEstoque(periodo);
          break;
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao gerar relatório",
        variant: "destructive",
      });
    }
  };

  const handleTipoRelatorioChange = (value: string) => {
    setTipoRelatorio(value as TipoRelatorio);
  };

  const handlePeriodoInicioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPeriodo((prev) => ({
      ...prev,
      inicio: new Date(e.target.value),
    }));
  };

  const handlePeriodoFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodo((prev) => ({
      ...prev,
      fim: new Date(e.target.value),
    }));
  };

  const renderGraficoVendas = () => {
    if (!relatorioVendas) {
      console.log("Relatório de vendas não disponível");
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Nenhum dado disponível para o período selecionado
          </p>
        </div>
      );
    }

    console.log("Renderizando gráfico de vendas com dados:", {
      vendasPorDia: relatorioVendas.vendasPorDia,
      vendasPorFormaPagamento: relatorioVendas.vendasPorFormaPagamento,
      vendasPorCategoria: relatorioVendas.vendasPorCategoria,
      produtosMaisVendidos: relatorioVendas.produtosMaisVendidos,
    });

    return (
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
            <CardContent className="flex flex-col h-[500px]">
              <div className="text-2xl font-bold mb-4">
                {formatarMoeda(relatorioVendas.valorTotal)}
              </div>
              <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/50 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="space-y-4">
                  {relatorioVendas.vendasPorCategoria.map(
                    (categoria, index) => (
                      <Card
                        key={categoria.categoria}
                        className="bg-muted/50 hover:bg-muted/70 transition-colors"
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                            <span
                              className="w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            {categoria.categoria}
                          </h3>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-sm">
                              <span>Quantidade Vendida</span>
                              <span className="font-medium">
                                {categoria.quantidade} un
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Valor Total</span>
                              <span className="font-medium">
                                {formatarMoeda(categoria.valor)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Ticket Médio</span>
                              <span className="font-medium">
                                {formatarMoeda(
                                  categoria.valor / categoria.quantidade
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas por Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={[
                      { forma: "Dinheiro", valor: 2500 },
                      { forma: "Crédito", valor: 4500 },
                      { forma: "Débito", valor: 1800 },
                      { forma: "PIX", valor: 3200 },
                    ]}
                    dataKey="valor"
                    nameKey="forma"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({ name, percent }: DadosGrafico) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {[
                      { forma: "Dinheiro", valor: 2500 },
                      { forma: "Crédito", valor: 4500 },
                      { forma: "Débito", valor: 1800 },
                      { forma: "PIX", valor: 3200 },
                    ].map((entry, index) => (
                      <Cell
                        key={`cell-${String(index)}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatarMoeda(value as number)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evolução das Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={relatorioVendas.vendasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="data"
                  tickFormatter={(value: string | Date) => formatarData(value)}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value: string | Date) => formatarData(value)}
                  formatter={(value) => formatarMoeda(value as number)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="valor"
                  name="Valor"
                  stroke={CHART_COLORS.vendas.area.valor}
                  fill={CHART_COLORS.vendas.area.valor}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="quantidade"
                  name="Quantidade"
                  stroke={CHART_COLORS.vendas.area.quantidade}
                  fill={CHART_COLORS.vendas.area.quantidade}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={relatorioVendas.vendasPorCategoria}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatarMoeda(value as number)}
                  />
                  <Legend />
                  <Bar
                    dataKey="valor"
                    name="Valor"
                    fill={CHART_COLORS.vendas.valor}
                  />
                  <Bar
                    dataKey="quantidade"
                    name="Quantidade"
                    fill={CHART_COLORS.vendas.quantidade}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={relatorioVendas.produtosMaisVendidos}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="produto.nome" width={150} />
                  <Tooltip
                    formatter={(value) => formatarMoeda(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="valor" name="Valor" fill="#8884d8" />
                  <Bar dataKey="quantidade" name="Quantidade" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderGraficoFinanceiro = () => {
    if (!relatorioFinanceiro) {
      console.log("Relatório financeiro não disponível");
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Nenhum dado disponível para o período selecionado
          </p>
        </div>
      );
    }

    console.log("Renderizando gráfico financeiro com dados:", {
      receitasPorCategoria: relatorioFinanceiro.receitasPorCategoria,
      despesasPorCategoria: relatorioFinanceiro.despesasPorCategoria,
      fluxoCaixa: relatorioFinanceiro.fluxoCaixa,
    });

    return (
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
                Receitas: {formatarMoeda(relatorioFinanceiro.totalReceitas)}
                <br />
                Despesas: {formatarMoeda(relatorioFinanceiro.totalDespesas)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={relatorioFinanceiro.fluxoCaixa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="data"
                  tickFormatter={(value: string | Date) => formatarData(value)}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value: string | Date) => formatarData(value)}
                  formatter={(value) => formatarMoeda(value as number)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  name="Receitas"
                  stroke={CHART_COLORS.financeiro.area.receitas}
                  fill={CHART_COLORS.financeiro.area.receitas}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  name="Despesas"
                  stroke={CHART_COLORS.financeiro.area.despesas}
                  fill={CHART_COLORS.financeiro.area.despesas}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  name="Saldo"
                  stroke={CHART_COLORS.financeiro.area.saldo}
                  fill={CHART_COLORS.financeiro.area.saldo}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Receitas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={relatorioFinanceiro.receitasPorCategoria}
                    dataKey="valor"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: DadosGrafico) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {relatorioFinanceiro.receitasPorCategoria.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${String(index)}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatarMoeda(value as number)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={relatorioFinanceiro.despesasPorCategoria}
                    dataKey="valor"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: DadosGrafico) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {relatorioFinanceiro.despesasPorCategoria.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${String(index)}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatarMoeda(value as number)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderGraficoEstoque = () => {
    if (!relatorioEstoque) {
      console.log("Relatório de estoque não disponível");
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Nenhum dado disponível para o período selecionado
          </p>
        </div>
      );
    }

    console.log("Renderizando gráfico de estoque com dados:", relatorioEstoque);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Card de Total de Produtos */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">310 produtos</div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/50 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* Vestuário */}
                <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                      <span className="w-3 h-3 rounded-full bg-[#0ea5e9] mr-2"></span>
                      Vestuário
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between items-center text-sm">
                        <span>Camisa Básica</span>
                        <span className="font-medium">50 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Calça Jeans</span>
                        <span className="font-medium">30 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Vestido Floral</span>
                        <span className="font-medium">20 un</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Blusas */}
                <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                      <span className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></span>
                      Blusas
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between items-center text-sm">
                        <span>Blusa de Frio</span>
                        <span className="font-medium">15 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Blusa Social</span>
                        <span className="font-medium">25 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Blusa Casual</span>
                        <span className="font-medium">20 un</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Shorts */}
                <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                      <span className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></span>
                      Shorts
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between items-center text-sm">
                        <span>Short Jeans</span>
                        <span className="font-medium">25 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Short Esportivo</span>
                        <span className="font-medium">35 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Short Social</span>
                        <span className="font-medium">15 un</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Saias */}
                <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                      <span className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></span>
                      Saias
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between items-center text-sm">
                        <span>Saia Midi</span>
                        <span className="font-medium">18 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Saia Longa</span>
                        <span className="font-medium">22 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Saia Curta</span>
                        <span className="font-medium">20 un</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Blazers */}
                <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                      <span className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></span>
                      Blazers
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between items-center text-sm">
                        <span>Blazer Social</span>
                        <span className="font-medium">12 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Blazer Casual</span>
                        <span className="font-medium">15 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Blazer Slim</span>
                        <span className="font-medium">10 un</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Fitness */}
                <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center mb-2">
                      <span className="w-3 h-3 rounded-full bg-[#ec4899] mr-2"></span>
                      Fitness
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between items-center text-sm">
                        <span>Legging Fitness</span>
                        <span className="font-medium">35 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Top Esportivo</span>
                        <span className="font-medium">40 un</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span>Conjunto Fitness</span>
                        <span className="font-medium">25 un</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Card de Produtos por Categoria */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Produtos por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[550px]">
              <div className="flex-1 min-h-[350px] pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart
                    margin={{ top: 20, right: 10, bottom: 0, left: 10 }}
                  >
                    <Pie
                      data={[
                        { categoria: "Camisetas", quantidade: 50 },
                        { categoria: "Calças", quantidade: 30 },
                        { categoria: "Vestidos", quantidade: 20 },
                        { categoria: "Blusas", quantidade: 15 },
                        { categoria: "Shorts", quantidade: 25 },
                        { categoria: "Saias", quantidade: 18 },
                        { categoria: "Blazers", quantidade: 12 },
                        { categoria: "Fitness", quantidade: 75 },
                        { categoria: "Pijamas", quantidade: 22 },
                        { categoria: "Bermudas", quantidade: 28 },
                        { categoria: "Macacões", quantidade: 15 },
                      ]}
                      dataKey="quantidade"
                      nameKey="categoria"
                      cx="50%"
                      cy="45%"
                      innerRadius={0}
                      outerRadius={130}
                      paddingAngle={2}
                      label={({ name, percent }: DadosGrafico) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {[
                        { categoria: "Camisetas", quantidade: 50 },
                        { categoria: "Calças", quantidade: 30 },
                        { categoria: "Vestidos", quantidade: 20 },
                        { categoria: "Blusas", quantidade: 15 },
                        { categoria: "Shorts", quantidade: 25 },
                        { categoria: "Saias", quantidade: 18 },
                        { categoria: "Blazers", quantidade: 12 },
                        { categoria: "Fitness", quantidade: 75 },
                        { categoria: "Pijamas", quantidade: 22 },
                        { categoria: "Bermudas", quantidade: 28 },
                        { categoria: "Macacões", quantidade: 15 },
                      ].map((entry, index) => (
                        <Cell
                          key={`cell-${String(index)}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-auto pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { categoria: "Camisetas", quantidade: 50 },
                    { categoria: "Calças", quantidade: 30 },
                    { categoria: "Vestidos", quantidade: 20 },
                    { categoria: "Blusas", quantidade: 15 },
                    { categoria: "Shorts", quantidade: 25 },
                    { categoria: "Saias", quantidade: 18 },
                    { categoria: "Blazers", quantidade: 12 },
                    { categoria: "Fitness", quantidade: 75 },
                    { categoria: "Pijamas", quantidade: 22 },
                    { categoria: "Bermudas", quantidade: 28 },
                    { categoria: "Macacões", quantidade: 15 },
                  ].map((entry, index) => (
                    <div
                      key={entry.categoria}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-muted-foreground">
                        {entry.categoria}
                      </span>
                      <span className="font-medium">({entry.quantidade})</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorioEstoque.produtosBaixoEstoque.length} produtos
              </div>
              {relatorioEstoque.produtosBaixoEstoque.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {relatorioEstoque.produtosBaixoEstoque.map((item) => (
                    <li key={item.produto.id}>
                      {item.produto.nome} (Atual: {item.estoqueAtual}, Mínimo:{" "}
                      {item.estoqueMinimo})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum produto com estoque baixo.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Sem Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {relatorioEstoque.produtosSemEstoque.length} produtos
              </div>
              {relatorioEstoque.produtosSemEstoque.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {relatorioEstoque.produtosSemEstoque.map((item) => (
                    <li key={item.produto.id}>
                      {item.produto.nome} (Estoque: {item.estoqueAtual})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum produto sem estoque.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Estoque por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={relatorioEstoque.produtosPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="quantidade"
                  name="Quantidade em Estoque"
                  fill={CHART_COLORS.estoque.quantidade}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
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
          <Button
            onClick={() => {
              void handleGerarRelatorio();
            }}
            className="mt-4"
          >
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

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

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
                onValueChange={handleTipoRelatorioChange}
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

            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Input
                type="date"
                value={periodo.inicio.toISOString().split("T")[0]}
                onChange={handlePeriodoInicioChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Input
                type="date"
                value={periodo.fim.toISOString().split("T")[0]}
                onChange={handlePeriodoFimChange}
              />
            </div>
          </div>

          <Button
            onClick={() => {
              void handleGerarRelatorio();
            }}
            className="w-full"
          >
            Gerar Relatório
          </Button>
        </CardContent>
      </Card>

      <Tabs value={tipoRelatorio} onValueChange={handleTipoRelatorioChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas">
          {relatorioVendas ? (
            renderGraficoVendas()
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Nenhum dado disponível para o período selecionado.
            </div>
          )}
        </TabsContent>

        <TabsContent value="financeiro">
          {relatorioFinanceiro ? (
            renderGraficoFinanceiro()
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Nenhum dado disponível para o período selecionado.
            </div>
          )}
        </TabsContent>

        <TabsContent value="estoque">
          {relatorioEstoque ? (
            renderGraficoEstoque()
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Nenhum dado disponível para o período selecionado.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
