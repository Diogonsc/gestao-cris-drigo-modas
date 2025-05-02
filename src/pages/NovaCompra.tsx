
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/form-field";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adicionarCompra, getClientes, getProdutos } from "@/services/mockData";
import { Compra, Cliente, Produto, ProdutoCompra } from "@/types";

const schemaNovaCompra = z.object({
  clienteId: z.string().min(1, { message: "Selecione um cliente" }),
  tipoPagamento: z.enum(["avista", "parcelado"]),
  numeroParcelas: z.number().min(1).max(12).optional(),
  valorPago: z.number().min(0),
});

type NovaCompraFormData = z.infer<typeof schemaNovaCompra>;

const NovaCompra = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<ProdutoCompra[]>([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  
  const clientes = getClientes();
  const produtosDisponiveis = getProdutos();
  
  const form = useForm<NovaCompraFormData>({
    resolver: zodResolver(schemaNovaCompra),
    defaultValues: {
      clienteId: "",
      tipoPagamento: "avista",
      numeroParcelas: 1,
      valorPago: 0,
    },
  });
  
  const watchTipoPagamento = form.watch("tipoPagamento");
  
  const valorTotal = produtos.reduce((total, item) => total + item.valorTotal, 0);
  
  const handleAdicionarProduto = () => {
    if (!produtoSelecionadoId || quantidade <= 0) return;
    
    const produtoExistente = produtos.find(
      (p) => p.produto.id === produtoSelecionadoId
    );
    
    const produto = produtosDisponiveis.find((p) => p.id === produtoSelecionadoId);
    if (!produto) return;
    
    if (produtoExistente) {
      const novosItems = produtos.map((p) =>
        p.produto.id === produtoSelecionadoId
          ? {
              ...p,
              quantidade: p.quantidade + quantidade,
              valorTotal: p.valorUnitario * (p.quantidade + quantidade),
            }
          : p
      );
      setProdutos(novosItems);
    } else {
      const novoProduto: ProdutoCompra = {
        produto,
        quantidade,
        valorUnitario: produto.preco,
        valorTotal: produto.preco * quantidade,
      };
      setProdutos([...produtos, novoProduto]);
    }
    
    // Resetar os campos após adicionar
    setProdutoSelecionadoId("");
    setQuantidade(1);
  };
  
  const handleRemoverProduto = (produtoId: string) => {
    const novosItems = produtos.filter((p) => p.produto.id !== produtoId);
    setProdutos(novosItems);
  };
  
  const handleSubmit = (data: NovaCompraFormData) => {
    if (produtos.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto à compra.",
        variant: "destructive",
      });
      return;
    }
    
    const novaCompra: Omit<Compra, "id"> = {
      clienteId: data.clienteId,
      produtos,
      dataCompra: new Date().toISOString(),
      valorTotal,
      tipoPagamento: data.tipoPagamento,
      numeroParcelas: data.tipoPagamento === "parcelado" ? data.numeroParcelas || 1 : 1,
      valorPago: data.valorPago,
      status:
        data.valorPago >= valorTotal
          ? "quitado"
          : data.valorPago > 0
          ? "parcialmente_pago"
          : "em_aberto",
    };
    
    try {
      adicionarCompra(novaCompra);
      
      toast({
        title: "Compra registrada",
        description: "A compra foi registrada com sucesso.",
      });
      
      navigate("/clientes");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a compra.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/clientes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Compra</h1>
          <p className="text-muted-foreground">
            Registre uma nova compra para um cliente
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                Adicione os produtos para esta compra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select
                    value={produtoSelecionadoId}
                    onValueChange={setProdutoSelecionadoId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtosDisponiveis.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome} - {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                    placeholder="Qtd"
                  />
                </div>
                
                <Button type="button" onClick={handleAdicionarProduto}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Produto</th>
                      <th className="text-right p-2">Preço</th>
                      <th className="text-right p-2">Qtd</th>
                      <th className="text-right p-2">Total</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((item) => (
                      <tr key={item.produto.id} className="border-b">
                        <td className="p-2">{item.produto.nome}</td>
                        <td className="text-right p-2">
                          {item.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="text-right p-2">{item.quantidade}</td>
                        <td className="text-right p-2">
                          {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoverProduto(item.produto.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {produtos.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-4 text-muted-foreground">
                          Nenhum produto adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-medium">
                      <td colSpan={3} className="text-right p-2">
                        Total:
                      </td>
                      <td className="text-right p-2">
                        {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Compra</CardTitle>
              <CardDescription>
                Informações de pagamento
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-4">
                  <CustomFormField
                    name="clienteId"
                    label="Cliente"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  
                  <CustomFormField
                    name="tipoPagamento"
                    label="Forma de Pagamento"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avista">À Vista</SelectItem>
                          <SelectItem value="parcelado">Parcelado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  
                  {watchTipoPagamento === "parcelado" && (
                    <CustomFormField
                      name="numeroParcelas"
                      label="Número de Parcelas"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() || "1"}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n}x
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  
                  <CustomFormField
                    name="valorPago"
                    label="Valor Pago"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={valorTotal}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    )}
                  />
                  
                  <div className="pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Valor Total:</span>
                      <span>
                        {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Valor Restante:</span>
                      <span>
                        {Math.max(0, valorTotal - (form.watch("valorPago") || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={produtos.length === 0}>
                    Finalizar Compra
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NovaCompra;
