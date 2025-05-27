import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCupomFiscalStore } from "../../store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatarMoeda, formatarData } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, FileText, Download, Printer } from "lucide-react";

export function ListaCupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cupomSelecionado, setCupomSelecionado] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { cupons, atualizarCupom, removerCupom } = useCupomFiscalStore();

  const cuponsFiltrados = cupons.filter((cupom) => {
    const matchSearch =
      cupom.numero.includes(searchTerm) ||
      cupom.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cupom.cliente.cpf.includes(searchTerm);

    const matchStatus =
      statusFilter === "todos" || cupom.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleEmitirCupom = () => {
    navigate("/cupom-fiscal");
  };

  const handleCancelarCupom = (id: string) => {
    setCupomSelecionado(id);
    setShowConfirmDialog(true);
  };

  const confirmarCancelamento = () => {
    if (cupomSelecionado) {
      atualizarCupom(cupomSelecionado, { status: "cancelado" });
      toast({
        title: "Sucesso",
        description: "Cupom fiscal cancelado com sucesso.",
      });
    }
    setShowConfirmDialog(false);
    setCupomSelecionado(null);
  };

  const handleDownloadXML = (cupom: any) => {
    // Aqui você implementaria a lógica para gerar e baixar o XML
    toast({
      title: "Aviso",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const handleDownloadPDF = (cupom: any) => {
    // Aqui você implementaria a lógica para gerar e baixar o PDF
    toast({
      title: "Aviso",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const handleImprimir = (cupom: any) => {
    // Aqui você implementaria a lógica para imprimir o cupom
    toast({
      title: "Aviso",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cupons Fiscais</h1>
        <Button onClick={handleEmitirCupom}>Emitir Cupom Fiscal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            placeholder="Buscar por número, cliente ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="emitido">Emitido</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cuponsFiltrados.map((cupom) => (
              <TableRow key={cupom.id}>
                <TableCell>{cupom.numero}</TableCell>
                <TableCell>{formatarData(cupom.dataEmissao)}</TableCell>
                <TableCell>{cupom.cliente.nome}</TableCell>
                <TableCell>{formatarMoeda(cupom.valorTotal)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cupom.status === "emitido"
                        ? "bg-green-100 text-green-800"
                        : cupom.status === "pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cupom.status === "emitido"
                      ? "Emitido"
                      : cupom.status === "pendente"
                      ? "Pendente"
                      : "Cancelado"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {cupom.status === "pendente" && (
                        <DropdownMenuItem
                          onClick={() => handleCancelarCupom(cupom.id)}
                        >
                          Cancelar
                        </DropdownMenuItem>
                      )}
                      {cupom.status === "emitido" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleDownloadXML(cupom)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Baixar XML
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadPDF(cupom)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleImprimir(cupom)}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este cupom fiscal? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarCancelamento}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
