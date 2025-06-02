import { FormProduto } from "@/components/Produtos/FormProduto";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NovoProduto = () => {
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
          onClick={() => navigate("/produtos")}
        >
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
          <p className="text-muted-foreground">
            Adicione um novo produto ao sistema
          </p>
        </div>
      </div>

      <FormProduto onSuccess={handleSuccess} />
    </div>
  );
};

export default NovoProduto;
