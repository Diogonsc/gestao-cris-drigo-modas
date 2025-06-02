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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const schemaProduto = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().min(3, "Descrição é obrigatória"),
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
  fornecedor: z.string().optional(),
});

type FormProdutoData = z.infer<typeof schemaProduto>;

interface FormProdutoProps {
  produto?: Produto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categorias = ["Vestuário", "Calçados", "Acessórios", "Bolsas", "Outros"];
const unidades = ["un", "kg", "m", "cm", "l", "par", "cx"];

export function FormProduto({
  produto,
  onSuccess,
  onCancel,
}: FormProdutoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const { toast } = useToast();
  const { adicionarProduto, atualizarProduto, setError } = useProdutoStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
      estoqueMinimo: 5,
      unidade: "un",
      codigoBarras: "",
      status: "ativo",
      fornecedor: "",
    },
  });

  const onSubmit = async (data: FormProdutoData) => {
    try {
      setIsSubmitting(true);
      if (produto) {
        await atualizarProduto(produto.id, data);
        toast({
          title: "Produto atualizado",
          description: "Os dados do produto foram atualizados com sucesso.",
        });
      } else {
        await adicionarProduto({
          ...data,
        });
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
    <Card>
      <CardHeader>
        <CardTitle>
          {produto ? "Editar Produto" : "Cadastro de Produto"}
        </CardTitle>
        <CardDescription>
          {produto
            ? "Atualize as informações do produto"
            : "Preencha os dados para cadastrar um novo produto"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                {...register("codigo")}
                error={errors.codigo?.message}
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.codigo?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register("nome")}
                error={errors.nome?.message}
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.nome?.message} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                {...register("descricao")}
                error={errors.descricao?.message}
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.descricao?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                defaultValue={produto?.categoria}
                onValueChange={(value) => setValue("categoria", value)}
                disabled={isSubmitting}
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
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                defaultValue={produto?.unidade || "un"}
                onValueChange={(value) => setValue("unidade", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
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
              <Label htmlFor="precoCusto">Preço de Custo</Label>
              <Input
                id="precoCusto"
                type="number"
                step="0.01"
                {...register("precoCusto", { valueAsNumber: true })}
                error={errors.precoCusto?.message}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.precoVenda?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margemLucro">Margem de Lucro (%)</Label>
              <Input
                id="margemLucro"
                type="number"
                step="0.01"
                {...register("margemLucro", { valueAsNumber: true })}
                error={errors.margemLucro?.message}
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.margemLucro?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                id="estoque"
                type="number"
                {...register("estoque", { valueAsNumber: true })}
                error={errors.estoque?.message}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.estoqueMinimo?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigoBarras">Código de Barras</Label>
              <Input
                id="codigoBarras"
                {...register("codigoBarras")}
                error={errors.codigoBarras?.message}
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.codigoBarras?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={produto?.status || "ativo"}
                onValueChange={(value) =>
                  setValue("status", value as "ativo" | "inativo")
                }
                disabled={isSubmitting}
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                {...register("fornecedor")}
                error={errors.fornecedor?.message}
                disabled={isSubmitting}
              />
              <FormFeedback error={errors.fornecedor?.message} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-background">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : produto ? "Salvar" : "Criar"}
          </Button>
        </CardFooter>
      </form>
      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Descartar alterações?"
        description="Você tem alterações não salvas. Tem certeza que deseja descartá-las?"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
      />
    </Card>
  );
}
