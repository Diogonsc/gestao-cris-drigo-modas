import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
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
import { useProdutoStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";

const Produtos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { produtos, isLoading, error, fetchProdutos } = useProdutoStore();

  const filteredProducts = produtos.filter(
    (product) =>
      (product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoBarras
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || product.categoria === categoryFilter)
  );

  const handleNovoProduto = () => {
    navigate("/novo-produto");
  };

  const headers = ["Código", "Nome", "Categoria", "Preço", "Estoque", "Status"];

  const exportData = filteredProducts.map((product) => ({
    codigo: product.codigo,
    nome: product.nome,
    categoria: product.categoria,
    preco: product.precoVenda.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    estoque: product.estoque,
    status: product.status === "ativo" ? "Ativo" : "Inativo",
  }));

  if (isLoading) {
    return <Loading text="Carregando produtos..." />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar produtos: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seus produtos e acompanhe seu estoque
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            filename="produtos"
            headers={headers}
            disabled={filteredProducts.length === 0}
          />
          <Button onClick={handleNovoProduto}>
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            Todos os produtos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos por nome, código ou código de barras..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
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
                  <SelectItem value="Bolsas">Bolsas</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-32 text-muted-foreground"
                    >
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.codigo}
                      </TableCell>
                      <TableCell>{product.nome}</TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell className="text-right">
                        {product.precoVenda.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{product.estoque}</span>
                          {product.estoque <= product.estoqueMinimo && (
                            <Badge
                              variant="outline"
                              className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                            >
                              Baixo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            product.status === "ativo"
                              ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                              : "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                          }
                        >
                          {product.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate(`/produtos/${product.id}`);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Editar produto</span>
                          <Search className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Produtos;
