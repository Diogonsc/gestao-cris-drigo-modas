import { FormUsuario } from "@/components/Usuarios/FormUsuario";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NovoUsuario = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/usuarios");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/usuarios")}
        >
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
          <p className="text-muted-foreground">
            Adicione um novo usuário ao sistema
          </p>
        </div>
      </div>

      <FormUsuario onSuccess={handleSuccess} />
    </div>
  );
};

export default NovoUsuario;
