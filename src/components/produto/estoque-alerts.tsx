import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationCircle } from "react-icons/fa";
import { getProdutosComEstoqueBaixo } from "@/services/estoqueService";

export function EstoqueAlerts() {
  const produtosComEstoqueBaixo = getProdutosComEstoqueBaixo();

  if (produtosComEstoqueBaixo.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Estoque</CardTitle>
        <CardDescription>
          Produtos com estoque abaixo do mínimo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {produtosComEstoqueBaixo.map((produto) => (
          <Alert key={produto.id} variant="destructive">
            <FaExclamationCircle className="h-4 w-4" />
            <AlertTitle>{produto.nome}</AlertTitle>
            <AlertDescription>
              Estoque atual: {produto.estoque} unidades (Mínimo: {produto.estoqueMinimo})
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
} 