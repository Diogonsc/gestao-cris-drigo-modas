import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { useThemeSettings } from "@/context/theme-settings-context";

const Configuracoes = () => {
  const { toast } = useToast();
  const { primaryColor, setPrimaryColor } = useThemeSettings();
  const [companyName, setCompanyName] = useState("Gestão Pro");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize o sistema de acordo com suas preferências
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Configure os dados básicos da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input 
                    id="company-name" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email de Contato</Label>
                  <Input 
                    id="company-email" 
                    type="email"
                    placeholder="contato@empresa.com.br" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-logo">Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <Input 
                    id="company-logo" 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema e Cores</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-toggle">Tema</Label>
                  <ThemeToggle />
                </div>
                <p className="text-sm text-muted-foreground">
                  Alterna entre os temas claro e escuro
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="primary-color" 
                    type="color"
                    className="w-16 h-10 p-1"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                  <div 
                    className="h-10 flex-1 rounded-md"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure quando e como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-stock">Alertas de Estoque Baixo</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando o estoque estiver abaixo do mínimo
                  </p>
                </div>
                <Switch id="notify-stock" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-payment">Alertas de Pagamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar sobre parcelas pendentes
                  </p>
                </div>
                <Switch id="notify-payment" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Adicione ou edite usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                Recursos de gerenciamento de usuários estarão disponíveis em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
      </div>
    </div>
  );
};

export default Configuracoes;
