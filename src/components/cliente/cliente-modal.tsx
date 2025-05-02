
import { useState } from "react";
import { Cliente, Compra } from "@/types";
import { formatarMoeda, formatarData, formatarWhatsAppLink, formatarWhatsAppMensagem } from "@/utils/masks";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, FileText, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { gerarRecibo } from "@/services/reciboService";
import { getComprasPorCliente, registrarPagamento } from "@/services/mockData";
import { RegistroPagamentoModal } from "./registro-pagamento-modal";

interface ClienteModalProps {
  cliente: Cliente | null;
  open: boolean;
  onClose: () => void;
}

export function ClienteModal({ cliente, open, onClose }: ClienteModalProps) {
  const { toast } = useToast();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [compraAtual, setCompraAtual] = useState<Compra | null>(null);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  
  // Carrega as compras do cliente quando o modal é aberto
  React.useEffect(() => {
    if (cliente) {
      setCompras(getComprasPorCliente(cliente.id));
    }
  }, [cliente]);
  
  if (!cliente) {
    return null;
  }
  
  const handleGerarRecibo = async (compra: Compra) => {
    try {
      await gerarRecibo(cliente, compra);
      toast({
        title: "Recibo gerado",
        description: "O recibo foi gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar recibo",
        description: "Ocorreu um erro ao gerar o recibo.",
        variant: "destructive",
      });
    }
  };
  
  const handleAbrirPagamento = (compra: Compra) => {
    setCompraAtual(compra);
    setModalPagamentoAberto(true);
  };
  
  const handleRegistrarPagamento = (compraId: string, valor: number) => {
    const compraAtualizada = registrarPagamento(compraId, valor);
    if (compraAtualizada) {
      setCompras(getComprasPorCliente(cliente.id));
      toast({
        title: "Pagamento registrado",
        description: `Pagamento de ${formatarMoeda(valor)} registrado com sucesso!`,
      });
    }
    setModalPagamentoAberto(false);
  };
  
  const getStatusCompra = (compra: Compra) => {
    switch (compra.status) {
      case 'quitado': 
        return <Badge className="bg-green-500">Quitado</Badge>;
      case 'parcialmente_pago': 
        return <Badge className="bg-yellow-500">Parcialmente Pago</Badge>;
      default: 
        return <Badge className="bg-red-500">Em Aberto</Badge>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cliente: {cliente.nome}</DialogTitle>
            <DialogDescription>
              Informações completas do cliente e suas compras
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="informacoes">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="informacoes">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="compras">Compras</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nome:</p>
                    <p className="text-lg">{cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email:</p>
                    <p className="text-lg">{cliente.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Telefone:</p>
                    <p className="text-lg">{cliente.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">WhatsApp:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg">{cliente.telefone}</p>
                      <a
                        href={`${formatarWhatsAppLink(cliente.whatsapp)}?text=${formatarWhatsAppMensagem(cliente)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">CEP:</p>
                    <p className="text-lg">{cliente.endereco.cep}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Logradouro:</p>
                    <p className="text-lg">{cliente.endereco.logradouro}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Número:</p>
                    <p className="text-lg">{cliente.endereco.numero}</p>
                  </div>
                  {cliente.endereco.complemento && (
                    <div>
                      <p className="text-sm font-medium">Complemento:</p>
                      <p className="text-lg">{cliente.endereco.complemento}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Bairro:</p>
                    <p className="text-lg">{cliente.endereco.bairro}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cidade:</p>
                    <p className="text-lg">{cliente.endereco.cidade}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado:</p>
                    <p className="text-lg">{cliente.endereco.estado}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Situação Financeira</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Valor Pendente:</p>
                      <p className={`text-xl font-bold ${cliente.pendingValue > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {formatarMoeda(cliente.pendingValue)}
                      </p>
                    </div>
                    {cliente.pendingValue > 0 && (
                      <a
                        href={`${formatarWhatsAppLink(cliente.whatsapp)}?text=${formatarWhatsAppMensagem(cliente)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Enviar Cobrança</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compras" className="mt-4">
              {compras.length > 0 ? (
                <div className="space-y-4">
                  {compras.map((compra) => (
                    <Card key={compra.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Compra de {formatarData(compra.dataCompra)}</CardTitle>
                          {getStatusCompra(compra)}
                        </div>
                        <CardDescription>
                          {compra.tipoPagamento === 'avista' ? 'Pagamento à vista' : `Parcelado em ${compra.numeroParcelas}x`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="grid grid-cols-5 font-medium text-sm">
                            <span>Produto</span>
                            <span className="text-right">Preço</span>
                            <span className="text-right">Qtd</span>
                            <span className="text-right">Total</span>
                          </div>
                          {compra.produtos.map((item, index) => (
                            <div key={index} className="grid grid-cols-5 text-sm border-b pb-1">
                              <span>{item.produto.nome}</span>
                              <span className="text-right">{formatarMoeda(item.valorUnitario)}</span>
                              <span className="text-right">{item.quantidade}</span>
                              <span className="text-right">{formatarMoeda(item.valorTotal)}</span>
                            </div>
                          ))}
                          <div className="flex flex-col md:flex-row justify-between mt-4 pt-2">
                            <div className="space-y-1 mb-4 md:mb-0">
                              <div className="flex gap-2">
                                <span className="text-sm font-medium">Valor Total:</span>
                                <span className="text-sm">{formatarMoeda(compra.valorTotal)}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-sm font-medium">Valor Pago:</span>
                                <span className="text-sm">{formatarMoeda(compra.valorPago)}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-sm font-medium">Valor Pendente:</span>
                                <span className={`text-sm font-bold ${compra.valorTotal - compra.valorPago > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                  {formatarMoeda(compra.valorTotal - compra.valorPago)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {compra.status !== 'quitado' && (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleAbrirPagamento(compra)}
                                >
                                  <CreditCard className="h-4 w-4" /> Registrar Pagamento
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => handleGerarRecibo(compra)}
                              >
                                <FileText className="h-4 w-4" /> Gerar Recibo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Este cliente ainda não realizou compras.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {compraAtual && (
        <RegistroPagamentoModal
          compra={compraAtual}
          open={modalPagamentoAberto}
          onClose={() => setModalPagamentoAberto(false)}
          onSubmit={handleRegistrarPagamento}
        />
      )}
    </>
  );
}
