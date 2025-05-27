import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useProdutoStore } from "../../store";
import { Produto } from "../../store";
import { Loading } from "../ui/loading";
import { FormFeedback } from "../ui/form-feedback";
import { DialogConfirm } from "../ui/dialog-confirm";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schemaProduto = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().min(5, "Descrição deve ter no mínimo 5 caracteres"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  precoCusto: z.number().min(0, "Preço de custo deve ser maior ou igual a 0"),
  precoVenda: z.number().min(0, "Preço de venda deve ser maior ou igual a 0"),
  margemLucro: z.number().min(0, "Margem de lucro deve ser maior ou igual a 0"),
  estoque: z.number().min(0, "Estoque deve ser maior ou igual a 0"),
  estoqueMinimo: z
    .number()
    .min(0, "Estoque mínimo deve ser maior ou igual a 0"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  codigoBarras: z.string().optional(),
  status: z.enum(["ativo", "inativo"]),
});

type FormProdutoData = z.infer<typeof schemaProduto>;

interface FormProdutoProps {
  produto?: Produto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categorias = ["Vestuário", "Calçados", "Acessórios", "Bolsas", "Outros"];

const unidades = ["UN", "PAR", "CX", "KG", "M"];

export function FormProduto({
  produto,
  onSuccess,
  onCancel,
}: FormProdutoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const { toast } = useToast();
  const { addProduto, updateProduto, setError } = useProdutoStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<FormProdutoData>({
    resolver: zodResolver(schemaProduto),
    defaultValues: produto || {
      codigo: "",
      nome: "",
      descricao: "",
      categoria: "",
      precoCusto: 0,
      precoVenda: 0,
      margemLucro: 0,
      estoque: 0,
      estoqueMinimo: 0,
      unidade: "UN",
      codigoBarras: "",
      status: "ativo",
    },
    mode: "onChange",
  });

  // Calcula a margem de lucro quando o preço de custo ou venda muda
  const precoCusto = watch("precoCusto");
  const precoVenda = watch("precoVenda");

  useEffect(() => {
    if (precoCusto > 0 && precoVenda > 0) {
      const margem = ((precoVenda - precoCusto) / precoCusto) * 100;
      setValue("margemLucro", Number(margem.toFixed(2)));
    }
  }, [precoCusto, precoVenda, setValue]);

  const onSubmit = async (data: FormProdutoData) => {
    try {
      setIsSubmitting(true);
      if (produto) {
        await updateProduto(produto.id, data);
        toast({
          title: "Produto atualizado",
          description: "Os dados do produto foram atualizados com sucesso.",
        });
      } else {
        await addProduto(data);
        toast({
          title: "Produto cadastrado",
          description: "O produto foi cadastrado com sucesso.",
        });
        reset();
      }
      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar produto"
      );
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados do produto.",
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="codigo">Código</Label>
          <Input
            id="codigo"
            {...register("codigo")}
            error={errors.codigo?.message}
          />
          <FormFeedback error={errors.codigo?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigoBarras">Código de Barras</Label>
          <Input
            id="codigoBarras"
            {...register("codigoBarras")}
            error={errors.codigoBarras?.message}
          />
          <FormFeedback error={errors.codigoBarras?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" {...register("nome")} error={errors.nome?.message} />
          <FormFeedback error={errors.nome?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            defaultValue={produto?.categoria}
            onValueChange={(value) => setValue("categoria", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFeedback error={errors.categoria?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            {...register("descricao")}
            error={errors.descricao?.message}
          />
          <FormFeedback error={errors.descricao?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="precoCusto">Preço de Custo</Label>
          <Input
            id="precoCusto"
            type="number"
            step="0.01"
            {...register("precoCusto", { valueAsNumber: true })}
            error={errors.precoCusto?.message}
          />
          <FormFeedback error={errors.precoCusto?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="precoVenda">Preço de Venda</Label>
          <Input
            id="precoVenda"
            type="number"
            step="0.01"
            {...register("precoVenda", { valueAsNumber: true })}
            error={errors.precoVenda?.message}
          />
          <FormFeedback error={errors.precoVenda?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margemLucro">Margem de Lucro (%)</Label>
          <Input
            id="margemLucro"
            type="number"
            step="0.01"
            disabled
            {...register("margemLucro", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade</Label>
          <Select
            defaultValue={produto?.unidade || "UN"}
            onValueChange={(value) => setValue("unidade", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma unidade" />
            </SelectTrigger>
            <SelectContent>
              {unidades.map((unidade) => (
                <SelectItem key={unidade} value={unidade}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFeedback error={errors.unidade?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estoque">Estoque Atual</Label>
          <Input
            id="estoque"
            type="number"
            {...register("estoque", { valueAsNumber: true })}
            error={errors.estoque?.message}
          />
          <FormFeedback error={errors.estoque?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
          <Input
            id="estoqueMinimo"
            type="number"
            {...register("estoqueMinimo", { valueAsNumber: true })}
            error={errors.estoqueMinimo?.message}
          />
          <FormFeedback error={errors.estoqueMinimo?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={produto?.status || "ativo"}
            onValueChange={(value) =>
              setValue("status", value as "ativo" | "inativo")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <FormFeedback error={errors.status?.message} />
        </div>
      </div>

      <div className="flex justify-end space-x-2 sticky bottom-0 bg-background pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? (
            <Loading size="sm" text="Salvando..." />
          ) : produto ? (
            "Atualizar"
          ) : (
            "Cadastrar"
          )}
        </Button>
      </div>

      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Cancelar cadastro"
        description="Existem dados não salvos. Deseja realmente cancelar?"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
      />
    </form>
  );
}
