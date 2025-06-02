import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
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
import { FormUsuario } from "@/components/Usuarios/FormUsuario";
import { useUsuarioStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";

export default function UsuariosPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const { usuarios, loading, error, fetchUsuarios } = useUsuarioStore();

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.perfil.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuccess = () => {
    setShowForm(false);
    setUsuarioSelecionado(null);
    fetchUsuarios();
  };

  const headers = ["Nome", "Email", "Perfil", "Status", "Último Acesso"];

  const exportData = filteredUsuarios.map((usuario) => ({
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    status: usuario.status === "ativo" ? "Ativo" : "Inativo",
    ultimoAcesso: new Date(usuario.ultimoAcesso).toLocaleDateString("pt-BR"),
  }));

  if (loading) {
    return <Loading text="Carregando usuários..." />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar usuários: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie seus usuários e acompanhe seus acessos
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            filename="usuarios"
            headers={headers}
            disabled={filteredUsuarios.length === 0}
          />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
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
              placeholder="Buscar usuários por nome, email ou perfil..."
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
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-32 text-muted-foreground"
                    >
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nome}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{usuario.perfil}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            usuario.status === "ativo"
                              ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                              : "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                          }
                        >
                          {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(usuario.ultimoAcesso).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUsuarioSelecionado(usuario);
                            setShowForm(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Editar usuário</span>
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {usuarioSelecionado ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <FormUsuario
            usuario={usuarioSelecionado}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false);
              setUsuarioSelecionado(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
