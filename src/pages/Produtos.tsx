import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProdutoStore } from "@/store";
import { Produto } from "@/types";
import { ListaProdutos } from "@/components/produto/lista-produtos";
import { ProdutoForm } from "@/components/produto/produto-form";
import { FaPlus } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExportButton } from "@/components/ui/export-button";

export default function Produtos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { produtos, fetchProdutos, isLoading, error } = useProdutoStore();
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(
    null
  );

  useEffect(() => {
    const loadProdutos = async () => {
      try {
        await fetchProdutos();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os produtos.",
          variant: "destructive",
        });
      }
    };

    void loadProdutos();
  }, [fetchProdutos, toast]);

  const handleEdit = (produto: Produto) => {
    setProdutoParaEditar(produto);
  };

  const handleSuccess = () => {
    setProdutoParaEditar(null);
    navigate("/produtos");
  };

  const handleRetry = () => {
    void fetchProdutos();
  };

  const handleNovoProduto = () => {
    navigate("/produtos/novo");
  };

  const headers = [
    "Código",
    "Nome",
    "Categoria",
    "Preço de Venda",
    "Estoque",
    "Status",
  ];

  const exportData = produtos.map((produto) => ({
    codigo: produto.codigo,
    nome: produto.nome,
    categoria: produto.categoria,
    preco_venda: produto.precoVenda.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    estoque: produto.estoque,
    status: produto.status === "ativo" ? "Ativo" : "Inativo",
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie seu catálogo de produtos e controle seu estoque
            </p>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="h-96 animate-pulse bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-lg text-muted-foreground">{error}</p>
        <Button onClick={handleRetry}>Tentar novamente</Button>
      </div>
    );
  }

  if (produtoParaEditar) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setProdutoParaEditar(null);
            }}
          >
            Voltar
          </Button>
        </div>
        <ProdutoForm produto={produtoParaEditar} onSuccess={handleSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos e controle seu estoque
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            filename="produtos"
            headers={headers}
            disabled={produtos.length === 0}
          />
          <Button onClick={handleNovoProduto}>
            <FaPlus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            Todos os produtos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListaProdutos produtos={produtos} onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}
