import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Download } from "lucide-react";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { useDateRange } from "@/context/date-range-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label, Input } from "@/components/ui/label";

import {
  BarChart as RechartBarChart,
  Bar,
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getDadosVendasPorPeriodo,
  getDadosProdutosMaisVendidos,
  getDadosClientesMaisAtivos,
} from "@/services/mockData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Relatorios = () => {
  const { dateRange } = useDateRange();
  const [tipoGrafico, setTipoGrafico] = useState<"bar" | "line">("bar");
  const dadosVendas = getDadosVendasPorPeriodo();
  const dadosProdutos = getDadosProdutosMaisVendidos();
  const dadosClientes = getDadosClientesMaisAtivos();
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("vendas");
  const [periodo, setPeriodo] = useState({
    inicio: new Date(),
    fim: new Date(),
  });
  const [relatorioVendas, setRelatorioVendas] =
    useState<RelatorioVendas | null>(null);

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    // TODO: Implement data filtering based on date range
  };

  const exportarCSV = (dados: any[], nomeArquivo: string) => {
    // Converter os dados para formato CSV
    const headers = Object.keys(dados[0]).join(",");
    const rows = dados.map((item) => Object.values(item).join(","));
    const csv = [headers, ...rows].join("\n");

    // Criar o arquivo para download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${nomeArquivo}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGerarRelatorio = () => {
    // Implemente a lógica para gerar o relatório
  };

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
            </div>
          )}
        </TabsContent>

        <TabsContent value="financeiro">
          {/* Implemente o conteúdo do tab financeiro */}
        </TabsContent>

        <TabsContent value="estoque">
          {/* Implemente o conteúdo do tab estoque */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
