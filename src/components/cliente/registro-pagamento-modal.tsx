
import { useState } from "react";
import { Compra } from "@/types";
import { formatarMoeda } from "@/utils/masks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface RegistroPagamentoModalProps {
  compra: Compra;
  open: boolean;
  onClose: () => void;
  onSubmit: (compraId: string, valor: number) => void;
}

export function RegistroPagamentoModal({ compra, open, onClose, onSubmit }: RegistroPagamentoModalProps) {
  const [valor, setValor] = useState<string>("");
  const valorPendente = compra.valorTotal - compra.valorPago;
  
  const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    setValor(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valorNumerico = parseFloat(valor);
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      return;
    }
    
    // Limitar ao valor pendente
    const valorFinal = Math.min(valorNumerico, valorPendente);
    
    onSubmit(compra.id, valorFinal);
    setValor("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
          <DialogDescription>
            Informe o valor recebido para esta compra
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
              <span>Valor Total:</span>
              <span>{formatarMoeda(compra.valorTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Valor já Pago:</span>
              <span>{formatarMoeda(compra.valorPago)}</span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span>Valor Pendente:</span>
              <span className="text-red-500">{formatarMoeda(valorPendente)}</span>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="valor">Valor do pagamento</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0.01"
                max={valorPendente}
                value={valor}
                onChange={handleChangeValor}
                placeholder="0,00"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Pagamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
