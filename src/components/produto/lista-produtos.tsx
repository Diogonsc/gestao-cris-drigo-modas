import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { Produto } from "@/types";
import { useProdutoStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

interface ListaProdutosProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
}

const TODAS_CATEGORIAS = "todas";

export function ListaProdutos({ produtos, onEdit }: ListaProdutosProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { removerProduto } = useProdutoStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] =
    useState<string>(TODAS_CATEGORIAS);

  const handleDelete = async (id: string) => {
    try {
      await removerProduto(id);
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o produto.",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (produto: Produto) => {
    onEdit(produto);
  };

  const handleDeleteClick = (id: string) => {
    void handleDelete(id);
  };

  // Extrair categorias únicas dos produtos
  const categorias = Array.from(
    new Set(produtos.map((p) => p.categoria))
  ).sort();

  // Filtrar produtos por termo de busca e categoria
  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigoBarras?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategoria =
      categoriaFilter === TODAS_CATEGORIAS ||
      produto.categoria === categoriaFilter;

    return matchesSearch && matchesCategoria;
  });

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "-";
    const dateObj = new Date(date);
    return isValid(dateObj)
      ? format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR })
      : "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS_CATEGORIAS}>
              Todas as categorias
            </SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço de Venda</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">
                    {produto.codigo}
                  </TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>
                    {produto.precoVenda.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>{produto.estoque}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        produto.status === "ativo" ? "default" : "secondary"
                      }
                    >
                      {produto.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(produto.ultimaAtualizacao)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <FaEllipsisV className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditClick(produto);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            handleDeleteClick(produto.id);
                          }}
                        >
                          Remover
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
    </div>
  );
}
