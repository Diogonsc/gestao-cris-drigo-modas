import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";

export function NovaCompra() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelar = () => {
    navigate("/vendas");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Nova Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancelar}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
