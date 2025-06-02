import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProdutoStore } from "@/store";
import { Produto } from "@/types";
import { ListaProdutos } from "@/components/produto/lista-produtos";
import { ProdutoForm } from "@/components/produto/produto-form";

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="rounded-md border">
          <div className="h-96 animate-pulse bg-muted" />
        </div>
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
    <div className="container mx-auto py-6">
      <ListaProdutos produtos={produtos} onEdit={handleEdit} />
    </div>
  );
}
