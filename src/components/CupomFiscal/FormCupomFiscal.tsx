import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  useCupomFiscalStore,
  useVendaStore,
  useClienteStore,
} from "../../store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loading } from "../ui/loading";
import { Search } from "lucide-react";

const cupomFiscalSchema = z.object({
  cliente: z.object({
    nome: z.string().min(1, "Cliente é obrigatório"),
    cpf: z.string().min(1, "CPF é obrigatório"),
    endereco: z.string().min(1, "Endereço é obrigatório"),
  }),
  itens: z
    .array(
      z.object({
        codigo: z.string().min(1, "Código é obrigatório"),
        descricao: z.string().min(1, "Descrição é obrigatória"),
        quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
        valorUnitario: z
          .number()
          .min(0, "Valor unitário deve ser maior ou igual a zero"),
        valorTotal: z
          .number()
          .min(0, "Valor total deve ser maior ou igual a zero"),
      })
    )
    .min(1, "Adicione pelo menos um item"),
  formaPagamento: z.enum(
    ["dinheiro", "cartao_credito", "cartao_debito", "pix"],
    {
      required_error: "Forma de pagamento é obrigatória",
    }
  ),
  observacoes: z.string().optional(),
});

type CupomFiscalFormData = z.infer<typeof cupomFiscalSchema>;

export function FormCupomFiscal() {
  const [isLoading, setIsLoading] = useState(false);
  const [showClienteDialog, setShowClienteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { adicionarCupom } = useCupomFiscalStore();
  const { vendas } = useVendaStore();
  const { clientes, fetchClientes } = useClienteStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CupomFiscalFormData>({
    resolver: zodResolver(cupomFiscalSchema),
    defaultValues: {
      itens: [],
      formaPagamento: "dinheiro",
    },
  });

  const itens = watch("itens");
  const cliente = watch("cliente");

  const valorTotal = itens.reduce((acc, item) => acc + item.valorTotal, 0);

  const handleBuscarCliente = async () => {
    try {
      setIsLoading(true);
      await fetchClientes();
      setShowClienteDialog(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar os clientes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelecionarCliente = (cliente: any) => {
    setValue("cliente", {
      nome: cliente.nome,
      cpf: cliente.cpf,
      endereco: `${cliente.endereco.logradouro}, ${cliente.endereco.numero}${
        cliente.endereco.complemento ? ` - ${cliente.endereco.complemento}` : ""
      }, ${cliente.endereco.bairro}, ${cliente.endereco.cidade} - ${
        cliente.endereco.estado
      }, CEP: ${cliente.endereco.cep}`,
    });
    setShowClienteDialog(false);
  };

  const handleBuscarVenda = (numero: string) => {
    const venda = vendas.find((v) => v.numero === numero);
    if (venda) {
      setValue("cliente", {
        nome: venda.cliente.nome,
        cpf: venda.cliente.cpf,
        endereco: `${venda.cliente.endereco.logradouro}, ${
          venda.cliente.endereco.numero
        }${
          venda.cliente.endereco.complemento
            ? ` - ${venda.cliente.endereco.complemento}`
            : ""
        }, ${venda.cliente.endereco.bairro}, ${
          venda.cliente.endereco.cidade
        } - ${venda.cliente.endereco.estado}, CEP: ${
          venda.cliente.endereco.cep
        }`,
      });

      setValue(
        "itens",
        venda.itens.map((item) => ({
          codigo: item.produto.codigo,
          descricao: item.produto.nome,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorTotal,
        }))
      );

      setValue("formaPagamento", venda.formaPagamento);
    } else {
      toast({
        title: "Aviso",
        description: "Venda não encontrada.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: CupomFiscalFormData) => {
    try {
      setIsLoading(true);
      const cupom = {
        id: crypto.randomUUID(),
        numero: String(Date.now()).slice(-6),
        dataEmissao: new Date(),
        ...data,
        valorTotal,
        status: "pendente" as const,
      };

      adicionarCupom(cupom);
      toast({
        title: "Sucesso",
        description: "Cupom fiscal gerado com sucesso.",
      });
      navigate("/cupons");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o cupom fiscal.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading text="Processando..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Emitir Cupom Fiscal</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Buscar por Venda</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Número da venda"
                onChange={(e) => handleBuscarVenda(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBuscarCliente}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select
              onValueChange={(value) =>
                setValue("formaPagamento", value as any)
              }
              defaultValue="dinheiro"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao_credito">
                  Cartão de Crédito
                </SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cliente</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Nome" value={cliente?.nome || ""} readOnly />
            <Input placeholder="CPF" value={cliente?.cpf || ""} readOnly />
            <Input
              placeholder="Endereço"
              value={cliente?.endereco || ""}
              readOnly
            />
          </div>
          {errors.cliente && (
            <p className="text-sm text-red-500">{errors.cliente.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Itens</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor Unitário</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{formatarMoeda(item.valorUnitario)}</TableCell>
                  <TableCell>{formatarMoeda(item.valorTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {errors.itens && (
            <p className="text-sm text-red-500">{errors.itens.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Observações</Label>
          <Input
            {...register("observacoes")}
            placeholder="Observações adicionais"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            Total: {formatarMoeda(valorTotal)}
          </div>
          <Button type="submit">Emitir Cupom Fiscal</Button>
        </div>
      </form>

      <Dialog open={showClienteDialog} onOpenChange={setShowClienteDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecionar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes
                  .filter(
                    (cliente) =>
                      cliente.nome
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      cliente.cpf.includes(searchTerm)
                  )
                  .map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>{cliente.nome}</TableCell>
                      <TableCell>{cliente.cpf}</TableCell>
                      <TableCell>
                        {`${cliente.endereco.logradouro}, ${
                          cliente.endereco.numero
                        }${
                          cliente.endereco.complemento
                            ? ` - ${cliente.endereco.complemento}`
                            : ""
                        }, ${cliente.endereco.bairro}, ${
                          cliente.endereco.cidade
                        } - ${cliente.endereco.estado}`}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => handleSelecionarCliente(cliente)}
                        >
                          Selecionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
