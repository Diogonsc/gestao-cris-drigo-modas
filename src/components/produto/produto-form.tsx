import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto } from "@/types";
import { useProdutoStore } from "@/store";

// Schema de validação
const produtoSchema = z.object({
  codigo: z.string().min(1, { message: "Código é obrigatório" }),
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  descricao: z
    .string()
    .min(3, { message: "Descrição deve ter pelo menos 3 caracteres" }),
  categoria: z.string().min(1, { message: "Categoria é obrigatória" }),
  precoCusto: z
    .number()
    .min(0, { message: "Preço de custo deve ser maior ou igual a 0" }),
  precoVenda: z
    .number()
    .min(0, { message: "Preço de venda deve ser maior ou igual a 0" }),
  estoque: z
    .number()
    .min(0, { message: "Estoque deve ser maior ou igual a 0" }),
  estoqueMinimo: z
    .number()
    .min(0, { message: "Estoque mínimo deve ser maior ou igual a 0" }),
  unidade: z.string().min(1, { message: "Unidade é obrigatória" }),
  codigoBarras: z.string().optional(),
  status: z.enum(["ativo", "inativo"]),
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  produto?: Produto;
  onSuccess: () => void;
}

export function ProdutoForm({ produto, onSuccess }: ProdutoFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { adicionarProduto, atualizarProduto } = useProdutoStore();

  const form = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: produto
      ? {
          codigo: produto.codigo,
          nome: produto.nome,
          descricao: produto.descricao,
          categoria: produto.categoria,
          precoCusto: produto.precoCusto,
          precoVenda: produto.precoVenda,
          estoque: produto.estoque,
          estoqueMinimo: produto.estoqueMinimo,
          unidade: produto.unidade,
          codigoBarras: produto.codigoBarras,
          status: produto.status,
        }
      : {
          codigo: "",
          nome: "",
          descricao: "",
          categoria: "",
          precoCusto: 0,
          precoVenda: 0,
          estoque: 0,
          estoqueMinimo: 0,
          unidade: "UN",
          codigoBarras: "",
          status: "ativo",
        },
  });

  const handleSubmit = async (data: ProdutoFormData) => {
    setIsLoading(true);
    try {
      if (produto) {
        // Atualizar produto existente
        await atualizarProduto(produto.id, data);

        toast({
          title: "Produto atualizado",
          description:
            "As informações do produto foram atualizadas com sucesso!",
        });
      } else {
        // Adicionar novo produto
        const margemLucro =
          ((data.precoVenda - data.precoCusto) / data.precoCusto) * 100;
        await adicionarProduto({ ...data, margemLucro });

        toast({
          title: "Produto cadastrado",
          description: "O produto foi cadastrado com sucesso!",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações do produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                <p className="text-sm text-muted-foreground">
                  Dados principais do produto
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="codigo"
                  label="Código"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Código do produto"
                      disabled={isLoading}
                    />
                  )}
                />
                <CustomFormField
                  name="nome"
                  label="Nome"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nome do produto"
                      disabled={isLoading}
                    />
                  )}
                />
                <CustomFormField
                  name="descricao"
                  label="Descrição"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Descrição do produto"
                      disabled={isLoading}
                    />
                  )}
                />
                <CustomFormField
                  name="categoria"
                  label="Categoria"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vestuário">Vestuário</SelectItem>
                        <SelectItem value="Calçados">Calçados</SelectItem>
                        <SelectItem value="Acessórios">Acessórios</SelectItem>
                        <SelectItem value="Bolsas">Bolsas</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Preços e Estoque</h3>
                <p className="text-sm text-muted-foreground">
                  Informações de preço e controle de estoque
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="precoCusto"
                  label="Preço de Custo"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  )}
                />
                <CustomFormField
                  name="precoVenda"
                  label="Preço de Venda"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  )}
                />
                <CustomFormField
                  name="estoque"
                  label="Estoque Atual"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="0"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  )}
                />
                <CustomFormField
                  name="estoqueMinimo"
                  label="Estoque Mínimo"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="0"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  )}
                />
                <CustomFormField
                  name="unidade"
                  label="Unidade"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UN">Unidade</SelectItem>
                        <SelectItem value="KG">Quilograma</SelectItem>
                        <SelectItem value="CX">Caixa</SelectItem>
                        <SelectItem value="PCT">Pacote</SelectItem>
                        <SelectItem value="PAR">Par</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <CustomFormField
                  name="codigoBarras"
                  label="Código de Barras"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Código de barras (opcional)"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Status</h3>
                <p className="text-sm text-muted-foreground">
                  Status atual do produto
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="status"
                  label="Status"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as "ativo" | "inativo"}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onSuccess();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : produto
                ? "Atualizar Produto"
                : "Cadastrar Produto"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
