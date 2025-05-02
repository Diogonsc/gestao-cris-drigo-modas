
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone } from "lucide-react";
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

const mockClients = [
  { id: 1, name: "João Silva", email: "joao.silva@email.com", phone: "(11) 98765-4321", pendingValue: 0 },
  { id: 2, name: "Maria Oliveira", email: "maria.oliveira@email.com", phone: "(21) 98765-4321", pendingValue: 350.75 },
  { id: 3, name: "Pedro Santos", email: "pedro.santos@email.com", phone: "(31) 98765-4321", pendingValue: 0 },
  { id: 4, name: "Ana Costa", email: "ana.costa@email.com", phone: "(41) 98765-4321", pendingValue: 1250.50 },
  { id: 5, name: "Carlos Ferreira", email: "carlos.ferreira@email.com", phone: "(51) 98765-4321", pendingValue: 0 },
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const formatWhatsAppUrl = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, '');
    return `https://wa.me/55${phoneNumber}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e acompanhe suas compras
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
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
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Valor Pendente</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell className="text-right">
                      {client.pendingValue > 0 ? (
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                          {client.pendingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                          Pago
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <a 
                        href={formatWhatsAppUrl(client.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
