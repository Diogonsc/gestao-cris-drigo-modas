import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormTransacao } from "@/components/Financeiro/FormTransacao";
import { FaArrowLeft } from "react-icons/fa";

export default function NovaTransacao() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/financeiro");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            navigate("/financeiro");
          }}
        >
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Transação</h1>
          <p className="text-muted-foreground">
            Registre uma nova transação financeira
          </p>
        </div>
      </div>
      <FormTransacao onSuccess={handleSuccess} />
    </div>
  );
} 