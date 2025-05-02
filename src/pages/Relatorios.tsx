
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise de dados e performance do seu negócio
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas no Período</CardTitle>
            <CardDescription>
              Veja o desempenho das vendas nos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Gráfico de vendas será exibido aqui</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Movimentação de Estoque</CardTitle>
            <CardDescription>
              Entradas e saídas de produtos do estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Gráfico de estoque será exibido aqui</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Clientes e Faturamento</CardTitle>
            <CardDescription>
              Análise de receita por cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Gráfico de clientes será exibido aqui</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;
