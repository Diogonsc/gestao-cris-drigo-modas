import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useVendaStore, Venda, ItemVenda } from "../../store";
import { useClienteStore } from "../../store";
import { useProdutoStore } from "../../store";
import { useAuthStore } from "../../store";
import { Loading } from "../ui/loading";
import { FormFeedback } from "../ui/form-feedback";
import { DialogConfirm } from "../ui/dialog-confirm";
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
import { Trash2, Plus, Search } from "lucide-react";
import { formatarMoeda } from "../../lib/utils";

const schemaVenda = z.object({
  cliente: z.object({
    id: z.string().min(1, "Cliente é obrigatório"),
  }),
  itens: z
    .array(
      z.object({
        produto: z.object({
          id: z.string().min(1, "Produto é obrigatório"),
        }),
        quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
        valorUnitario: z.number().min(0, "Valor unitário inválido"),
        desconto: z.number().min(0, "Desconto não pode ser negativo"),
      })
    )
    .min(1, "Adicione pelo menos um item"),
  formaPagamento: z.enum([
    "dinheiro",
    "cartao_credito",
    "cartao_debito",
    "pix",
  ]),
  observacoes: z.string().optional(),
});

type FormVendaData = z.infer<typeof schemaVenda>;

interface FormVendaProps {
  venda?: Venda;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FormVenda({ venda, onSuccess, onCancel }: FormVendaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchProduto, setSearchProduto] = useState("");
  const { toast } = useToast();

  const { adicionarVenda, atualizarVenda, setError } = useVendaStore();
  const { clientes } = useClienteStore();
  const { produtos } = useProdutoStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormVendaData>({
    resolver: zodResolver(schemaVenda),
    defaultValues: venda || {
      cliente: { id: "" },
      itens: [],
      formaPagamento: "dinheiro",
      observacoes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const itens = watch("itens");
  const clienteId = watch("cliente.id");

  const clienteSelecionado = clientes.find((c) => c.id === clienteId);
  const subtotal = itens.reduce(
    (acc, item) => acc + (item.valorUnitario * item.quantidade - item.desconto),
    0
  );

  const handleAddItem = () => {
    append({
      produto: { id: "" },
      quantidade: 1,
      valorUnitario: 0,
      desconto: 0,
    });
  };

  const handleProdutoChange = (index: number, produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (produto) {
      setValue(`itens.${index}.produto.id`, produtoId);
      setValue(`itens.${index}.valorUnitario`, produto.precoVenda);
    }
  };

  const handleQuantidadeChange = (index: number, quantidade: number) => {
    const item = itens[index];
    if (item) {
      const valorTotal = item.valorUnitario * quantidade;
      setValue(`itens.${index}.quantidade`, quantidade);
      setValue(`itens.${index}.valorTotal`, valorTotal);
    }
  };

  const onSubmit = async (data: FormVendaData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const itensVenda: ItemVenda[] = data.itens.map((item) => {
        const produto = produtos.find((p) => p.id === item.produto.id);
        if (!produto) throw new Error("Produto não encontrado");

        return {
          produto,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorUnitario * item.quantidade - item.desconto,
          desconto: item.desconto,
        };
      });

      const vendaData = {
        cliente: clienteSelecionado!,
        itens: itensVenda,
        subtotal,
        desconto: itens.reduce((acc, item) => acc + item.desconto, 0),
        total: subtotal,
        formaPagamento: data.formaPagamento,
        observacoes: data.observacoes,
        status: "pendente" as const,
        usuario: user,
      };

      if (venda) {
        await atualizarVenda(venda.id, vendaData);
        toast({
          title: "Venda atualizada",
          description: "A venda foi atualizada com sucesso.",
        });
      } else {
        await adicionarVenda(vendaData);
        toast({
          title: "Venda registrada",
          description: "A venda foi registrada com sucesso.",
        });
        reset();
      }
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao salvar venda");
      toast({
        title: "Erro",
        description: "Não foi possível salvar a venda.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(errors).length > 0) {
      setShowConfirmCancel(true);
    } else {
      onCancel?.();
    }
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchCliente.toLowerCase()) ||
      cliente.cpf.includes(searchCliente)
  );

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchProduto.toLowerCase()) ||
      produto.codigo.includes(searchProduto) ||
      produto.codigoBarras?.includes(searchProduto)
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cliente</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={searchCliente}
              onChange={(e) => setSearchCliente(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="max-h-48 overflow-y-auto border rounded-md">
            {clientesFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                className={`p-2 cursor-pointer hover:bg-accent ${
                  clienteId === cliente.id ? "bg-accent" : ""
                }`}
                onClick={() => setValue("cliente.id", cliente.id)}
              >
                <div className="font-medium">{cliente.nome}</div>
                <div className="text-sm text-muted-foreground">
                  CPF: {cliente.cpf}
                </div>
              </div>
            ))}
          </div>
          <FormFeedback error={errors.cliente?.id?.message} />
        </div>

        <div className="space-y-2">
          <Label>Forma de Pagamento</Label>
          <Select
            defaultValue={venda?.formaPagamento || "dinheiro"}
            onValueChange={(value) =>
              setValue(
                "formaPagamento",
                value as FormVendaData["formaPagamento"]
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
              <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
            </SelectContent>
          </Select>
          <FormFeedback error={errors.formaPagamento?.message} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Itens da Venda</h3>
          <Button type="button" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchProduto}
            onChange={(e) => setSearchProduto(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Select
                      value={field.produto.id}
                      onValueChange={(value) =>
                        handleProdutoChange(index, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtosFiltrados.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome} - {produto.codigo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormFeedback
                      error={errors.itens?.[index]?.produto?.id?.message}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      {...register(`itens.${index}.quantidade`, {
                        valueAsNumber: true,
                        onChange: (e) =>
                          handleQuantidadeChange(index, e.target.valueAsNumber),
                      })}
                    />
                    <FormFeedback
                      error={errors.itens?.[index]?.quantidade?.message}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`itens.${index}.valorUnitario`, {
                        valueAsNumber: true,
                      })}
                    />
                    <FormFeedback
                      error={errors.itens?.[index]?.valorUnitario?.message}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`itens.${index}.desconto`, {
                        valueAsNumber: true,
                      })}
                    />
                    <FormFeedback
                      error={errors.itens?.[index]?.desconto?.message}
                    />
                  </TableCell>
                  <TableCell>
                    {formatarMoeda(
                      (field.valorUnitario || 0) * (field.quantidade || 0) -
                        (field.desconto || 0)
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <FormFeedback error={errors.itens?.message} />
      </div>

      <div className="space-y-2">
        <Label>Observações</Label>
        <Input {...register("observacoes")} />
        <FormFeedback error={errors.observacoes?.message} />
      </div>

      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Subtotal</div>
          <div className="text-2xl font-bold">{formatarMoeda(subtotal)}</div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{formatarMoeda(subtotal)}</div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loading size="sm" text="Salvando..." />
          ) : venda ? (
            "Atualizar"
          ) : (
            "Finalizar Venda"
          )}
        </Button>
      </div>

      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Cancelar venda"
        description="Existem dados não salvos. Deseja realmente cancelar?"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
      />
    </form>
  );
}
