import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useFinanceiroStore, TransacaoFinanceira } from "../../store";
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
import { formatarMoeda } from "../../lib/utils";

const categoriasReceita = [
  "Vendas",
  "Serviços",
  "Investimentos",
  "Outros",
] as const;

const categoriasDespesa = [
  "Compras",
  "Salários",
  "Aluguel",
  "Impostos",
  "Serviços",
  "Manutenção",
  "Outros",
] as const;

const schemaTransacao = z.object({
  tipo: z.enum(["receita", "despesa"]),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  descricao: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  formaPagamento: z.enum([
    "dinheiro",
    "cartao_credito",
    "cartao_debito",
    "pix",
    "transferencia",
  ]),
  status: z.enum(["pendente", "concluida", "cancelada"]),
  dataVencimento: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormTransacaoData = z.infer<typeof schemaTransacao>;

interface FormTransacaoProps {
  transacao?: TransacaoFinanceira;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FormTransacao({
  transacao,
  onSuccess,
  onCancel,
}: FormTransacaoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const { toast } = useToast();

  const { adicionarTransacao, atualizarTransacao, setError } =
    useFinanceiroStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormTransacaoData>({
    resolver: zodResolver(schemaTransacao),
    defaultValues: transacao || {
      tipo: "receita",
      categoria: "",
      descricao: "",
      valor: 0,
      formaPagamento: "dinheiro",
      status: "pendente",
      dataVencimento: "",
      observacoes: "",
    },
  });

  const tipo = watch("tipo");

  const onSubmit = async (data: FormTransacaoData) => {
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

      const transacaoData = {
        ...data,
        usuario: user,
        dataVencimento: data.dataVencimento
          ? new Date(data.dataVencimento)
          : undefined,
      };

      if (transacao) {
        await atualizarTransacao(transacao.id, transacaoData);
        toast({
          title: "Transação atualizada",
          description: "A transação foi atualizada com sucesso.",
        });
      } else {
        await adicionarTransacao(transacaoData);
        toast({
          title: "Transação registrada",
          description: "A transação foi registrada com sucesso.",
        });
        reset();
      }
      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar transação"
      );
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            defaultValue={transacao?.tipo || "receita"}
            onValueChange={(value) => {
              setValue("tipo", value as "receita" | "despesa");
              setValue("categoria", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
          <FormFeedback error={errors.tipo?.message} />
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select
            value={watch("categoria")}
            onValueChange={(value) => setValue("categoria", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {(tipo === "receita" ? categoriasReceita : categoriasDespesa).map(
                (categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <FormFeedback error={errors.categoria?.message} />
        </div>

        <div className="space-y-2">
          <Label>Valor</Label>
          <Input
            type="number"
            step="0.01"
            {...register("valor", { valueAsNumber: true })}
            error={errors.valor?.message}
          />
          <FormFeedback error={errors.valor?.message} />
        </div>

        <div className="space-y-2">
          <Label>Forma de Pagamento</Label>
          <Select
            defaultValue={transacao?.formaPagamento || "dinheiro"}
            onValueChange={(value) =>
              setValue(
                "formaPagamento",
                value as FormTransacaoData["formaPagamento"]
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
              <SelectItem value="transferencia">Transferência</SelectItem>
            </SelectContent>
          </Select>
          <FormFeedback error={errors.formaPagamento?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Descrição</Label>
          <Input {...register("descricao")} error={errors.descricao?.message} />
          <FormFeedback error={errors.descricao?.message} />
        </div>

        <div className="space-y-2">
          <Label>Data de Vencimento</Label>
          <Input
            type="date"
            {...register("dataVencimento")}
            error={errors.dataVencimento?.message}
          />
          <FormFeedback error={errors.dataVencimento?.message} />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            defaultValue={transacao?.status || "pendente"}
            onValueChange={(value) =>
              setValue("status", value as FormTransacaoData["status"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <FormFeedback error={errors.status?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Observações</Label>
          <Input
            {...register("observacoes")}
            error={errors.observacoes?.message}
          />
          <FormFeedback error={errors.observacoes?.message} />
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
          ) : transacao ? (
            "Atualizar"
          ) : (
            "Registrar"
          )}
        </Button>
      </div>

      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Cancelar transação"
        description="Existem dados não salvos. Deseja realmente cancelar?"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
      />
    </form>
  );
}
