import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBox, FaUsers, FaArrowUp, FaArrowDown, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaShoppingBag } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getClientes, getCompras, getProdutos } from "@/services/mockData";
import { Cliente, Compra } from "@/types";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const clientes = getClientes();
  const produtos = getProdutos();
  const compras = getCompras();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  
  // Calcular estatísticas
  const totalClientes = clientes.length;
  const clientesComPendencia = clientes.filter(c => c.pendingValue > 0).length;
  
  const totalProdutos = produtos.length;
  const produtosComEstoqueBaixo = produtos.filter(p => p.estoque <= 5).length;
  
  const totalCompras = compras.length;
  const totalVendas = compras.reduce((total, compra) => total + compra.valorTotal, 0);
  const totalRecebido = compras.reduce((total, compra) => total + compra.valorPago, 0);
  
  const valorEmAberto = clientes.reduce((total, cliente) => total + cliente.pendingValue, 0);
  
  // Dados para o gráfico de vendas
  const dadosVendas = [
    { dia: "Seg", vendas: 1200 },
    { dia: "Ter", vendas: 1800 },
    { dia: "Qua", vendas: 1400 },
    { dia: "Qui", vendas: 2000 },
    { dia: "Sex", vendas: 1600 },
    { dia: "Sáb", vendas: 2200 },
    { dia: "Dom", vendas: 1100 },
  ];
  
  // Produtos com estoque baixo
  const produtosEstoqueBaixo = produtos
    .filter(p => p.estoque <= 5)
    .sort((a, b) => a.estoque - b.estoque)
    .slice(0, 3);
  
  // Clientes com pendência
  const clientesComDivida = clientes
    .filter(c => c.pendingValue > 0)
    .sort((a, b) => b.pendingValue - a.pendingValue)
    .slice(0, 3);
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    // TODO: Implement data filtering based on date range
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio e atividades recentes.
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos em Estoque
            </CardTitle>
            <FaBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground pt-1">
                {produtosComEstoqueBaixo} produtos com estoque baixo
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2" 
                onClick={() => navigate('/produtos')}
              >
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Registrados
            </CardTitle>
            <FaUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground pt-1">
                {clientesComPendencia} clientes com pendências
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2" 
                onClick={() => navigate('/clientes')}
              >
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entradas
            </CardTitle>
            <FaArrowDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground pt-1">
                Total recebido em {totalCompras} compras
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2" 
                onClick={() => navigate('/relatorios')}
              >
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendências
            </CardTitle>
            <FaArrowUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {valorEmAberto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground pt-1">
                Valor pendente de recebimento
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2" 
                onClick={() => navigate('/relatorios')}
              >
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Visão Geral de Vendas</CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Últimos 7 dias
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/nova-compra')}
              className="flex items-center gap-1"
            >
              <FaShoppingBag className="h-4 w-4 mr-1" /> Nova Venda
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dadosVendas}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, "Vendas"]}
                    cursor={{ stroke: '#ddd', strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {produtosEstoqueBaixo.length > 0 ? (
                produtosEstoqueBaixo.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <div className="text-xs text-muted-foreground">
                        Estoque: {produto.estoque} / Mínimo: 5
                      </div>
                    </div>
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${(produto.estoque / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  Nenhum produto com estoque baixo.
                </p>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate('/produtos')}
              >
                Ver todos os produtos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              Clientes com Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientesComDivida.length > 0 ? (
              <div className="space-y-4">
                {clientesComDivida.map((cliente) => (
                  <div key={cliente.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cliente.nome}</p>
                      <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">
                        {cliente.pendingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0"
                        onClick={() => navigate('/clientes')}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={() => navigate('/clientes')}
                >
                  Ver todos os clientes
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Não há clientes com pagamentos pendentes.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaChartLine className="h-5 w-5 text-blue-500" />
              Desempenho Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Total de Vendas</p>
                  <p className="text-2xl font-bold">
                    {totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Taxa de Conversão</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Produtos</p>
                  <p className="text-2xl font-bold">{totalProdutos}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Clientes</p>
                  <p className="text-2xl font-bold">{totalClientes}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate('/relatorios')}
              >
                Ver relatórios completos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
