import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/form-field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Produto } from "@/types";
import { adicionarProduto, atualizarProduto } from "@/services/mockData";

// Schema de validação
const produtoSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  sku: z.string().min(3, { message: "SKU deve ter pelo menos 3 caracteres" }),
  preco: z.number().min(0.01, { message: "Preço deve ser maior que zero" }),
  estoque: z.number().min(0, { message: "Estoque não pode ser negativo" }),
  categoria: z.string().min(1, { message: "Categoria é obrigatória" }),
  estoqueMinimo: z.number().min(0, { message: "Estoque mínimo não pode ser negativo" }),
  fornecedor: z.string().optional(),
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  produto?: Produto;
  onSuccess: () => void;
}

export function ProdutoForm({ produto, onSuccess }: ProdutoFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: produto ?
      { 
        ...produto,
        estoqueMinimo: 5, // Valor padrão
        fornecedor: "" // Valor padrão
      } :
      {
        nome: "",
        sku: "",
        preco: 0,
        estoque: 0,
        categoria: "",
        estoqueMinimo: 5,
        fornecedor: ""
      },
  });

  const handleSubmit = async (data: ProdutoFormData) => {
    setIsLoading(true);
    try {
      const produtoData = {
        id: produto?.id || crypto.randomUUID(),
        nome: data.nome,
        sku: data.sku,
        preco: data.preco,
        estoque: data.estoque,
        categoria: data.categoria,
        estoqueMinimo: data.estoqueMinimo
      };

      if (produto) {
        // Atualizar produto existente
        atualizarProduto(produtoData);

        toast({
          title: "Produto atualizado",
          description: "As informações do produto foram atualizadas com sucesso!",
        });
      } else {
        // Adicionar novo produto
        adicionarProduto(produtoData);

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
        <CardTitle>{produto ? "Editar Produto" : "Cadastro de Produto"}</CardTitle>
        <CardDescription>
          {produto
            ? "Atualize as informações do produto"
            : "Preencha os dados para cadastrar um novo produto"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                name="nome"
                label="Nome do Produto"
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
                name="sku"
                label="SKU"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Código SKU"
                    disabled={isLoading}
                  />
                )}
              />
              <CustomFormField
                name="preco"
                label="Preço"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    disabled={isLoading}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              <CustomFormField
                name="estoque"
                label="Estoque"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              <CustomFormField
                name="categoria"
                label="Categoria"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Categoria"
                    disabled={isLoading}
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
                    placeholder="0"
                    disabled={isLoading}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              <CustomFormField
                name="fornecedor"
                label="Fornecedor"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nome do fornecedor"
                    disabled={isLoading}
                  />
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : produto ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 