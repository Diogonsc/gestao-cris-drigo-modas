import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Pencil, Trash2 } from "lucide-react";
import { ExportButton } from "@/components/ui/export-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProdutoForm } from "@/components/produto/produto-form";
import { EstoqueManager } from "@/components/produto/estoque-manager";
import { EstoqueAlerts } from "@/components/produto/estoque-alerts";
import { EstoqueRelatorios } from "@/components/produto/estoque-relatorios";
import { getProdutos, excluirProduto } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { Produto } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Produtos = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | undefined>();
  const [produtos, setProdutos] = useState<Produto[]>(getProdutos());
  const [selectedTab, setSelectedTab] = useState<"detalhes" | "estoque">(
    "detalhes"
  );

  const filteredProducts = produtos.filter(
    (product) =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || product.categoria === categoryFilter)
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      if (excluirProduto(id)) {
        setProdutos(getProdutos());
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso!",
        });
      }
    }
  };

  const handleSuccess = () => {
    setProdutos(getProdutos());
    setIsFormOpen(false);
    setSelectedProduto(undefined);
  };

  const headers = ["Nome", "SKU", "Categoria", "Preço", "Estoque"];

  const exportData = filteredProducts.map((product) => ({
    nome: product.nome,
    sku: product.sku,
    categoria: product.categoria,
    preço: product.preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    estoque: product.estoque,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu estoque e cadastro de produtos
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            filename="produtos"
            headers={headers}
            disabled={filteredProducts.length === 0}
          />
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <EstoqueAlerts />
      <EstoqueRelatorios />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            Todos os produtos disponíveis no seu estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="Vestuário">Vestuário</SelectItem>
                  <SelectItem value="Calçados">Calçados</SelectItem>
                  <SelectItem value="Acessórios">Acessórios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.nome}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.categoria}</TableCell>
                    <TableCell className="text-right">
                      {product.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>{product.estoque}</span>
                        {product.estoque <= 5 && (
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduto(product);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-32 text-muted-foreground"
                    >
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduto ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <Tabs
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(value as "detalhes" | "estoque")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="estoque">Estoque</TabsTrigger>
            </TabsList>
            <TabsContent value="detalhes">
              <ProdutoForm
                produto={selectedProduto}
                onSuccess={handleSuccess}
              />
            </TabsContent>
            <TabsContent value="estoque">
              {selectedProduto && (
                <EstoqueManager
                  produto={selectedProduto}
                  onSuccess={handleSuccess}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Produtos;
