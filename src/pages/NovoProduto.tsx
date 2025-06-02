import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProdutoForm } from "@/components/produto/produto-form";
import { FaArrowLeft } from "react-icons/fa";

export default function NovoProduto() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/produtos");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            navigate("/produtos");
          }}
        >
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
          <p className="text-muted-foreground">
            Adicione um novo produto ao catálogo
          </p>
        </div>
      </div>

      <ProdutoForm onSuccess={handleSuccess} />
    </div>
  );
}
