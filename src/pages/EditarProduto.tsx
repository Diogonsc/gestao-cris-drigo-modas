import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProdutoStore } from "@/store";
import { Produto } from "@/types";
import { ProdutoForm } from "@/components/produto/produto-form";

export default function EditarProduto() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { produtos, setProdutoAtual } = useProdutoStore();
  const [produto, setProduto] = useState<Produto | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado.",
        variant: "destructive",
      });
      navigate("/produtos");
      return;
    }

    const produtoEncontrado = produtos.find((p) => p.id === id);
    if (!produtoEncontrado) {
      toast({
        title: "Erro",
        description: "Produto não encontrado.",
        variant: "destructive",
      });
      navigate("/produtos");
      return;
    }

    setProduto(produtoEncontrado);
    setProdutoAtual(produtoEncontrado);
  }, [id, produtos, navigate, toast, setProdutoAtual]);

  const handleSuccess = () => {
    navigate("/produtos");
  };

  if (!produto) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => {
            navigate("/produtos");
          }}
        >
          Voltar
        </Button>
      </div>
      <ProdutoForm produto={produto} onSuccess={handleSuccess} />
    </div>
  );
}
