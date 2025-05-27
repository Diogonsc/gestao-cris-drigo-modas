import { useState, useEffect } from "react";
import { Cliente, Compra } from "@/types";
import {
  formatarMoeda,
  formatarData,
  formatarWhatsAppLink,
  formatarWhatsAppMensagem,
} from "@/utils/masks";
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
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaPhone, FaFileAlt, FaCreditCard } from "react-icons/fa";
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
  useEffect(() => {
    if (cliente) {
      const comprasCliente = getComprasPorCliente(cliente.id);
      // Ordena as compras por data, mais recente primeiro
      setCompras(
        comprasCliente.sort(
          (a, b) =>
            new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime()
        )
      );
    }
  }, [cliente]);

  // Agrupa as compras por dia
  const comprasPorDia = compras.reduce((acc, compra) => {
    const data = new Date(compra.dataCompra).toLocaleDateString("pt-BR");
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(compra);
    return acc;
  }, {} as Record<string, Compra[]>);

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
        description: `Pagamento de ${formatarMoeda(
          valor
        )} registrado com sucesso!`,
      });
    }
    setModalPagamentoAberto(false);
  };

  const getStatusCompra = (compra: Compra) => {
    switch (compra.status) {
      case "quitado":
        return <Badge className="bg-green-500">Quitado</Badge>;
      case "parcialmente_pago":
        return <Badge className="bg-yellow-500">Parcialmente Pago</Badge>;
      default:
        return <Badge className="bg-red-500">Em Aberto</Badge>;
    }
  };

  const handleEnviarCobranca = (compra: Compra) => {
    const mensagem =
      `Olá ${
        cliente?.nome
      }, gostaria de lembrar sobre o pagamento da compra realizada em ${formatarData(
        compra.dataCompra
      )}.\n\n` +
      `Detalhes da compra:\n` +
      `Compra #${compra.id}\n\n` +
      `Produtos:\n` +
      compra.produtos
        .map(
          (item) =>
            `- ${item.produto.nome} (${item.quantidade}x ${formatarMoeda(
              item.valorUnitario
            )})`
        )
        .join("\n") +
      "\n\n" +
      `Valor total: ${formatarMoeda(compra.valorTotal)}\n` +
      `Valor pago: ${formatarMoeda(compra.valorPago)}\n` +
      `Valor pendente: ${formatarMoeda(
        compra.valorTotal - compra.valorPago
      )}\n\n` +
      `Forma de pagamento: ${
        compra.tipoPagamento === "avista"
          ? "À vista"
          : `${compra.numeroParcelas}x`
      }\n\n` +
      `Agradecemos a atenção!\n` +
      `Para mais informações, entre em contato conosco.`;

    const whatsappLink = `${formatarWhatsAppLink(
      cliente?.whatsapp || ""
    )}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, "_blank");
  };

  const handleEnviarCupom = (compra: Compra) => {
    const mensagem =
      `Olá ${
        cliente?.nome
      }, segue o cupom fiscal da sua compra realizada em ${formatarData(
        compra.dataCompra
      )}.\n\n` +
      `Cupom Fiscal - Compra #${compra.id}\n\n` +
      `Produtos:\n` +
      compra.produtos
        .map(
          (item) =>
            `- ${item.produto.nome}\n` +
            `  Quantidade: ${item.quantidade}\n` +
            `  Valor unitário: ${formatarMoeda(item.valorUnitario)}\n` +
            `  Subtotal: ${formatarMoeda(item.valorTotal)}`
        )
        .join("\n\n") +
      "\n\n" +
      `Subtotal: ${formatarMoeda(compra.valorTotal)}\n` +
      `Forma de pagamento: ${
        compra.tipoPagamento === "avista"
          ? "À vista"
          : `${compra.numeroParcelas}x`
      }\n` +
      `Status: ${
        compra.status === "quitado"
          ? "Quitado"
          : compra.status === "parcialmente_pago"
          ? "Parcialmente Pago"
          : "Em Aberto"
      }\n\n` +
      `Agradecemos a preferência!\n` +
      `Para mais informações, entre em contato conosco.`;

    const whatsappLink = `${formatarWhatsAppLink(
      cliente?.whatsapp || ""
    )}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, "_blank");
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
                        href={`${formatarWhatsAppLink(
                          cliente.whatsapp
                        )}?text=${formatarWhatsAppMensagem(cliente)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FaPhone className="h-4 w-4" />
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
                      <p
                        className={`text-xl font-bold ${
                          cliente.pendingValue > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {formatarMoeda(cliente.pendingValue)}
                      </p>
                    </div>
                    {cliente.pendingValue > 0 && (
                      <a
                        href={`${formatarWhatsAppLink(
                          cliente.whatsapp
                        )}?text=${formatarWhatsAppMensagem(cliente)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FaPhone className="h-4 w-4" />
                        <span>Enviar Cobrança</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compras" className="mt-4">
              {Object.entries(comprasPorDia).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(comprasPorDia).map(([data, comprasDoDia]) => (
                    <div key={data} className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        {data}
                      </h3>
                      {comprasDoDia.map((compra) => (
                        <Card key={compra.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-base">
                                  Compra #{compra.id}
                                </CardTitle>
                                <CardDescription>
                                  {compra.tipoPagamento === "avista"
                                    ? "Pagamento à vista"
                                    : `Parcelado em ${compra.numeroParcelas}x`}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusCompra(compra)}
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleEnviarCupom(compra)}
                                  >
                                    <FaFileAlt className="h-4 w-4" />
                                    Cupom
                                  </Button>
                                  {compra.status !== "quitado" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1 bg-green-500 text-white hover:bg-green-600"
                                      onClick={() =>
                                        handleEnviarCobranca(compra)
                                      }
                                    >
                                      <FaPhone className="h-4 w-4" />
                                      Cobrar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-5 font-medium text-sm border-b pb-2">
                                <span>Produto</span>
                                <span className="text-right">Preço</span>
                                <span className="text-right">Qtd</span>
                                <span className="text-right">Total</span>
                                <span></span>
                              </div>
                              {compra.produtos.map((item, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-5 text-sm border-b pb-2"
                                >
                                  <span className="font-medium">
                                    {item.produto.nome}
                                  </span>
                                  <span className="text-right">
                                    {formatarMoeda(item.valorUnitario)}
                                  </span>
                                  <span className="text-right">
                                    {item.quantidade}
                                  </span>
                                  <span className="text-right font-medium">
                                    {formatarMoeda(item.valorTotal)}
                                  </span>
                                  <span></span>
                                </div>
                              ))}
                              <div className="flex justify-between items-center pt-2">
                                <div className="space-y-1">
                                  <div className="flex gap-2">
                                    <span className="text-sm font-medium">
                                      Total:
                                    </span>
                                    <span className="text-sm font-bold">
                                      {formatarMoeda(compra.valorTotal)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-sm font-medium">
                                      Pago:
                                    </span>
                                    <span className="text-sm text-green-600">
                                      {formatarMoeda(compra.valorPago)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-sm font-medium">
                                      Pendente:
                                    </span>
                                    <span
                                      className={`text-sm font-bold ${
                                        compra.valorTotal - compra.valorPago > 0
                                          ? "text-red-500"
                                          : "text-green-500"
                                      }`}
                                    >
                                      {formatarMoeda(
                                        compra.valorTotal - compra.valorPago
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {compra.status !== "quitado" && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() =>
                                        handleAbrirPagamento(compra)
                                      }
                                    >
                                      <FaCreditCard className="h-4 w-4" />
                                      Registrar Pagamento
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleGerarRecibo(compra)}
                                  >
                                    <FaFileAlt className="h-4 w-4" />
                                    Recibo
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      Este cliente ainda não realizou compras.
                    </p>
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
