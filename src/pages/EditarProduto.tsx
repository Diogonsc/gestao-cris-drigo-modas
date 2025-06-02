import { FormProduto } from "@/components/Produtos/FormProduto";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useProdutoStore } from "@/store";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";

const EditarProduto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { produtos, loading, error } = useProdutoStore();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    if (id) {
      const produtoEncontrado = produtos.find((p) => p.id === id);
      if (produtoEncontrado) {
        setProduto(produtoEncontrado);
      } else {
        navigate("/produtos");
      }
    }
  }, [id, produtos, navigate]);

  const handleSuccess = () => {
    navigate("/produtos");
  };

  if (loading) {
    return <Loading text="Carregando produto..." />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar produto: {error}
      </div>
    );
  }

  if (!produto) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/produtos")}
        >
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
          <p className="text-muted-foreground">
            Atualize as informações do produto
          </p>
        </div>
      </div>

      <FormProduto produto={produto} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditarProduto;
