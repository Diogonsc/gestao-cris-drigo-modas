import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationCircle, FaBox, FaDollarSign, FaTag, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { gerarRelatorioEstoque } from "@/services/relatorioService";

export function EstoqueRelatorios() {
  const relatorio = gerarRelatorioEstoque();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaBox className="h-4 w-4" />
            Total de Produtos
          </CardTitle>
          <CardDescription>Quantidade total de produtos no estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{relatorio.totalProdutos}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaDollarSign className="h-4 w-4" />
            Valor Total
          </CardTitle>
          <CardDescription>Valor total do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {relatorio.valorTotalEstoque.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaTag className="h-4 w-4" />
            Produtos por Categoria
          </CardTitle>
          <CardDescription>Distribuição por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(relatorio.produtosPorCategoria).map(([categoria, quantidade]) => (
              <div key={categoria} className="flex justify-between items-center">
                <span>{categoria}</span>
                <span className="font-medium">{quantidade}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaExclamationTriangle className="h-4 w-4" />
            Estoque Baixo
          </CardTitle>
          <CardDescription>Produtos com estoque abaixo do mínimo</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-500">{relatorio.produtosComEstoqueBaixo}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaTimesCircle className="h-4 w-4" />
            Sem Estoque
          </CardTitle>
          <CardDescription>Produtos com estoque zerado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-500">{relatorio.produtosSemEstoque}</p>
        </CardContent>
      </Card>
    </div>
  );
} 