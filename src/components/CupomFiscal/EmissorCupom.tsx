import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCupomFiscalStore } from "../../store";
import { CupomFiscalService } from "../../services/cupomFiscal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputMask } from "../ui/input-mask";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ListaItens } from "./ListaItens";
import { Card } from "../ui/card";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, Save, Trash2 } from "lucide-react";

const cupomSchema = z.object({
  cliente: z.object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
    endereco: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  }),
  itens: z
    .array(
      z.object({
        codigo: z.string().min(1, "Código é obrigatório"),
        descricao: z.string().min(1, "Descrição é obrigatória"),
        quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
        valorUnitario: z
          .number()
          .min(0, "Valor unitário deve ser maior ou igual a 0"),
      })
    )
    .min(1, "Adicione pelo menos um item"),
  formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
});

type CupomFormData = z.infer<typeof cupomSchema>;

const formasPagamento = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "cartao_credito", label: "Cartão de Crédito" },
  { id: "cartao_debito", label: "Cartão de Débito" },
  { id: "pix", label: "PIX" },
  { id: "transferencia", label: "Transferência" },
];

export function EmissorCupom() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const adicionarCupom = useCupomFiscalStore((state) => state.adicionarCupom);

  const methods = useForm<CupomFormData>({
    resolver: zodResolver(cupomSchema),
    defaultValues: {
      itens: [],
      formaPagamento: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = methods;

  const onSubmit = async (data: CupomFormData) => {
    try {
      setIsLoading(true);

      const itensComTotal = data.itens.map((item) => ({
        ...item,
        valorTotal: item.quantidade * item.valorUnitario,
      }));

      const valorTotal = itensComTotal.reduce(
        (acc, item) => acc + item.valorTotal,
        0
      );

      const cupom = await CupomFiscalService.gerarCupom({
        ...data,
        itens: itensComTotal,
        valorTotal,
      });

      adicionarCupom(cupom);
      toast.success("Cupom gerado com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro ao gerar cupom fiscal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (isDirty) {
      setShowResetConfirm(true);
    } else {
      reset();
    }
  };

  const confirmReset = () => {
    reset();
    setShowResetConfirm(false);
    toast.success("Formulário limpo com sucesso");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Novo Cupom Fiscal</h1>
          {isDirty && (
            <ConfirmDialog
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar Formulário
                </Button>
              }
              title="Limpar Formulário"
              description="Tem certeza que deseja limpar o formulário? Todos os dados serão perdidos."
              confirmText="Limpar"
              variant="destructive"
              onConfirm={confirmReset}
            />
          )}
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dados do Cliente</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente.nome">Nome</Label>
                <Input
                  id="cliente.nome"
                  {...register("cliente.nome")}
                  error={errors.cliente?.nome?.message}
                  placeholder="Nome completo do cliente"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="cliente.cpf">CPF</Label>
                <InputMask
                  id="cliente.cpf"
                  mask="999.999.999-99"
                  maskChar=""
                  {...register("cliente.cpf")}
                  error={errors.cliente?.cpf?.message}
                  placeholder="000.000.000-00"
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="cliente.endereco">Endereço</Label>
                <Input
                  id="cliente.endereco"
                  {...register("cliente.endereco")}
                  error={errors.cliente?.endereco?.message}
                  placeholder="Endereço completo"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <ListaItens />
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Forma de Pagamento</h2>
            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select
                onValueChange={(value) =>
                  methods.setValue("formaPagamento", value)
                }
                defaultValue={methods.getValues("formaPagamento")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma.id} value={forma.id}>
                      {forma.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.formaPagamento && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.formaPagamento.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading || !isDirty}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isDirty}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Gerar Cupom
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
