
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
  getDadosClientesMaisAtivos 
} from "@/services/mockData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Relatorios = () => {
  const [tipoGrafico, setTipoGrafico] = useState<"bar" | "line">("bar");
  const dadosVendas = getDadosVendasPorPeriodo();
  const dadosProdutos = getDadosProdutosMaisVendidos();
  const dadosClientes = getDadosClientesMaisAtivos();

  const exportarCSV = (dados: any[], nomeArquivo: string) => {
    // Converter os dados para formato CSV
    const headers = Object.keys(dados[0]).join(',');
    const rows = dados.map(item => Object.values(item).join(','));
    const csv = [headers, ...rows].join('\n');
    
    // Criar o arquivo para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise de dados e performance do seu negócio
        </p>
      </div>
      
      <Tabs defaultValue="vendas" className="w-full">
        <TabsList className="mb-4 grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendas" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Vendas no Período</CardTitle>
                <CardDescription>
                  Desempenho das vendas nos últimos meses
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setTipoGrafico("bar")}
                  className={tipoGrafico === "bar" ? "bg-muted" : ""}
                >
                  <BarChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setTipoGrafico("line")}
                  className={tipoGrafico === "line" ? "bg-muted" : ""}
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => exportarCSV(dadosVendas, "vendas_por_periodo")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {tipoGrafico === "bar" ? (
                    <RechartBarChart data={dadosVendas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                      <Legend />
                      <Bar dataKey="valor" name="Valor de Vendas" fill="#8884d8" />
                    </RechartBarChart>
                  ) : (
                    <RechartLineChart data={dadosVendas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                      <Legend />
                      <Line type="monotone" dataKey="valor" name="Valor de Vendas" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </RechartLineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="produtos" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                  Os produtos com maior volume de vendas
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => exportarCSV(dadosProdutos, "produtos_mais_vendidos")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart>
                    <Pie
                      data={dadosProdutos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nome, quantidade, percent }) => `${nome}: ${quantidade} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="quantidade"
                      nameKey="nome"
                    >
                      {dadosProdutos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} unidades`, props.payload.nome]} />
                    <Legend />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Movimentação de Estoque</CardTitle>
              <CardDescription>
                Entradas e saídas de produtos do estoque
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart
                  data={[
                    { mes: "Jan", entradas: 20, saidas: 15 },
                    { mes: "Fev", entradas: 30, saidas: 25 },
                    { mes: "Mar", entradas: 15, saidas: 30 },
                    { mes: "Abr", entradas: 25, saidas: 20 },
                    { mes: "Mai", entradas: 35, saidas: 30 },
                    { mes: "Jun", entradas: 40, saidas: 35 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entradas" name="Entradas" fill="#00C49F" />
                  <Bar dataKey="saidas" name="Saídas" fill="#FF8042" />
                </RechartBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clientes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Clientes Mais Ativos</CardTitle>
                <CardDescription>
                  Clientes com mais compras realizadas
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => exportarCSV(dadosClientes, "clientes_mais_ativos")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={dadosClientes}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compras" name="Número de Compras" fill="#8884d8" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Clientes e Faturamento</CardTitle>
              <CardDescription>
                Análise de receita por cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart
                  data={[
                    { nome: "João Silva", compras: 8, valor: 2500 },
                    { nome: "Maria Oliveira", compras: 6, valor: 3200 },
                    { nome: "Ana Costa", compras: 5, valor: 1800 },
                    { nome: "Carlos Ferreira", compras: 4, valor: 1200 },
                    { nome: "Pedro Santos", compras: 2, valor: 700 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === "valor" ? `R$ ${value}` : `${value} compras`,
                    name === "valor" ? "Valor Total" : "Número de Compras"
                  ]} />
                  <Legend />
                  <Bar dataKey="valor" name="Valor Total (R$)" fill="#0088FE" />
                </RechartBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
