import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProdutoForm } from "@/components/produto/produto-form";

export default function NovoProduto() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/produtos");
  };

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
      <ProdutoForm onSuccess={handleSuccess} />
    </div>
  );
}
