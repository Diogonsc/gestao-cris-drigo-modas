
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getUsuarios } from "@/services/mockData";
import { Usuario } from "@/types";

const Usuarios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(getUsuarios());
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    funcao: "visualizador" as "admin" | "vendedor" | "visualizador",
  });
  const [modalAberto, setModalAberto] = useState(false);
  
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAbrirModal = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioSelecionado(usuario);
      setNovoUsuario({
        nome: usuario.nome,
        email: usuario.email,
        funcao: usuario.funcao,
      });
    } else {
      setUsuarioSelecionado(null);
      setNovoUsuario({
        nome: "",
        email: "",
        funcao: "visualizador",
      });
    }
    setModalAberto(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSalvarUsuario = () => {
    const { nome, email, funcao } = novoUsuario;
    
    if (!nome || !email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (usuarioSelecionado) {
      // Atualizar usuário
      const updatedUsuarios = usuarios.map((u) =>
        u.id === usuarioSelecionado.id
          ? { ...u, nome, email, funcao }
          : u
      );
      setUsuarios(updatedUsuarios);
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas.",
      });
    } else {
      // Adicionar novo usuário
      const novoId = `u${usuarios.length + 1}`;
      setUsuarios([...usuarios, { id: novoId, nome, email, funcao }]);
      
      toast({
        title: "Usuário adicionado",
        description: "O novo usuário foi adicionado com sucesso.",
      });
    }
    
    setModalAberto(false);
  };
  
  const handleExcluirUsuario = (id: string) => {
    const updatedUsuarios = usuarios.filter((u) => u.id !== id);
    setUsuarios(updatedUsuarios);
    
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído com sucesso.",
    });
  };
  
  const getFuncaoBadge = (funcao: string) => {
    switch (funcao) {
      case "admin":
        return <Badge className="bg-red-500">Administrador</Badge>;
      case "vendedor":
        return <Badge className="bg-blue-500">Vendedor</Badge>;
      default:
        return <Badge className="bg-gray-500">Visualizador</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={() => handleAbrirModal()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Todos os usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{getFuncaoBadge(usuario.funcao)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAbrirModal(usuario)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExcluirUsuario(usuario.id)}
                            disabled={usuario.funcao === "admin"} // Não permitir excluir o admin
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {usuarioSelecionado ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {usuarioSelecionado
                ? "Altere as informações do usuário"
                : "Preencha os dados para adicionar um novo usuário"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={novoUsuario.nome}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={novoUsuario.email}
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funcao">Função</Label>
              <Select
                value={novoUsuario.funcao}
                onValueChange={(value) => setNovoUsuario((prev) => ({ ...prev, funcao: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="visualizador">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarUsuario}>
              {usuarioSelecionado ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
