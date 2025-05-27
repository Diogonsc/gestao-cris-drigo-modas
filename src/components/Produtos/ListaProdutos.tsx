import { useState, useEffect } from "react";
import { useProdutoStore } from "../../store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";
import { DialogConfirm } from "../ui/dialog-confirm";
import { useToast } from "../ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  MoreHorizontal,
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import { FormProduto } from "./FormProduto";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Produto } from "../../store";

const categorias = [
  "Todos",
  "Vestuário",
  "Calçados",
  "Acessórios",
  "Bolsas",
  "Outros",
];

export function ListaProdutos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(
    null
  );
  const { toast } = useToast();

  const {
    produtos,
    isLoading,
    error,
    fetchProdutos,
    removerProduto,
    setError,
  } = useProdutoStore();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        await fetchProdutos();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive",
        });
      }
    };

    carregarProdutos();
  }, [fetchProdutos, toast]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigoBarras?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria =
      categoriaFiltro === "Todos" || produto.categoria === categoriaFiltro;

    return matchSearch && matchCategoria;
  });

  const handleEdit = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setShowForm(true);
  };

  const handleDelete = (produto: Produto) => {
    setProdutoParaExcluir(produto);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!produtoParaExcluir) return;

    try {
      await removerProduto(produtoParaExcluir.id);
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao excluir produto"
      );
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setProdutoParaExcluir(null);
    }
  };

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>{formatarPreco(produto.precoVenda)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span
                        className={
                          produto.estoque <= produto.estoqueMinimo
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {produto.estoque} {produto.unidade}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        produto.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {produto.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(produto)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(produto)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {produtoSelecionado ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <FormProduto
              produto={produtoSelecionado || undefined}
              onSuccess={() => {
                setShowForm(false);
                setProdutoSelecionado(null);
                fetchProdutos();
              }}
              onCancel={() => {
                setShowForm(false);
                setProdutoSelecionado(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DialogConfirm
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o produto "${produtoParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
