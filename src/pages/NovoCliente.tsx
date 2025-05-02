
import { ClienteForm } from "@/components/cliente/cliente-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NovoCliente = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/clientes");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/clientes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Cliente</h1>
          <p className="text-muted-foreground">
            Adicione um novo cliente ao sistema
          </p>
        </div>
      </div>

      <ClienteForm onSuccess={handleSuccess} />
    </div>
  );
};

export default NovoCliente;
