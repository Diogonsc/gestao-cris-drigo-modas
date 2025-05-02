import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationCircle, FaUpload } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { registrarEntradaEstoque, registrarSaidaEstoque, getProdutosComEstoqueBaixo, atualizarEstoqueViaCSV } from "@/services/estoqueService";
import { Produto } from "@/types";

interface EstoqueManagerProps {
  produto: Produto;
  onSuccess: () => void;
}

export function EstoqueManager({ produto, onSuccess }: EstoqueManagerProps) {
  const { toast } = useToast();
  const [quantidade, setQuantidade] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleEntrada = async () => {
    if (quantidade <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resultado = registrarEntradaEstoque(produto.id, quantidade);
      if (resultado) {
        toast({
          title: "Sucesso",
          description: `Entrada de ${quantidade} unidades registrada.`,
        });
        setQuantidade(0);
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a entrada.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaida = async () => {
    if (quantidade <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (quantidade > produto.estoque) {
      toast({
        title: "Erro",
        description: "Quantidade maior que o estoque disponível.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resultado = registrarSaidaEstoque(produto.id, quantidade);
      if (resultado) {
        toast({
          title: "Sucesso",
          description: `Saída de ${quantidade} unidades registrada.`,
        });
        setQuantidade(0);
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a saída.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target?.result as string;
        const resultado = atualizarEstoqueViaCSV(csvData);
        
        if (resultado.sucesso) {
          toast({
            title: "Sucesso",
            description: resultado.mensagem,
          });
          setFile(null);
          onSuccess();
        } else {
          toast({
            title: "Erro",
            description: resultado.mensagem,
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const produtosComEstoqueBaixo = getProdutosComEstoqueBaixo();
  const temEstoqueBaixo = produtosComEstoqueBaixo.some(p => p.id === produto.id);

  return (
    <div className="space-y-6">
      {temEstoqueBaixo && (
        <Alert variant="destructive">
          <FaExclamationCircle className="h-4 w-4" />
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>
            O estoque deste produto está abaixo do mínimo recomendado.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Movimentação de Estoque</CardTitle>
          <CardDescription>
            Registre entradas e saídas de produtos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-32"
            />
            <Button
              onClick={handleEntrada}
              disabled={isLoading || quantidade <= 0}
            >
              Registrar Entrada
            </Button>
            <Button
              variant="outline"
              onClick={handleSaida}
              disabled={isLoading || quantidade <= 0 || quantidade > produto.estoque}
            >
              Registrar Saída
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atualização em Massa</CardTitle>
          <CardDescription>
            Atualize o estoque através de um arquivo CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <Button
              onClick={handleUpload}
              disabled={isLoading || !file}
            >
              <FaUpload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            O arquivo CSV deve conter as colunas: SKU, Quantidade
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 