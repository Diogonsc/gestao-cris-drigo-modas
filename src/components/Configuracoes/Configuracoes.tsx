import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConfiguracoesStore, ConfiguracoesSistema } from "../../store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { Loading } from "../ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { formatarData } from "../../lib/utils";
import { useThemeStore } from "../../store/theme";

const configuracoesSchema = z.object({
  empresa: z.object({
    razaoSocial: z.string().min(1, "Razão social é obrigatória"),
    nomeFantasia: z.string().min(1, "Nome fantasia é obrigatório"),
    cnpj: z.string().min(1, "CNPJ é obrigatório"),
    inscricaoEstadual: z.string().min(1, "Inscrição estadual é obrigatória"),
    endereco: z.object({
      logradouro: z.string().min(1, "Logradouro é obrigatório"),
      numero: z.string().min(1, "Número é obrigatório"),
      complemento: z.string().optional(),
      bairro: z.string().min(1, "Bairro é obrigatório"),
      cidade: z.string().min(1, "Cidade é obrigatória"),
      estado: z.string().min(1, "Estado é obrigatório"),
      cep: z.string().min(1, "CEP é obrigatório"),
    }),
    contato: z.object({
      telefone: z.string().min(1, "Telefone é obrigatório"),
      email: z.string().email("E-mail inválido"),
      site: z.string().optional(),
    }),
  }),
  fiscal: z.object({
    regimeTributario: z.enum(["simples", "lucro_presumido", "lucro_real"]),
    cnae: z.string().min(1, "CNAE é obrigatório"),
    certificadoDigital: z
      .object({
        numero: z.string().min(1, "Número do certificado é obrigatório"),
        dataValidade: z.date(),
      })
      .optional(),
    serieNFe: z.string().min(1, "Série NFe é obrigatória"),
    numeroNFe: z.string().min(1, "Número NFe é obrigatório"),
  }),
  tema: z.enum(["claro", "escuro", "sistema"]),
  idioma: z.literal("pt-BR"),
  backupAutomatico: z.boolean(),
  intervaloBackup: z
    .number()
    .min(1, "Intervalo de backup deve ser maior que zero"),
});

type ConfiguracoesFormData = z.infer<typeof configuracoesSchema>;

export default function Configuracoes() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useThemeStore();
  const {
    configuracoes,
    isLoading: isLoadingConfig,
    error,
    fetchConfiguracoes,
    atualizarConfiguracoes,
    resetarConfiguracoes,
    realizarBackup,
    restaurarBackup,
  } = useConfiguracoesStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ConfiguracoesFormData>({
    resolver: zodResolver(configuracoesSchema),
    defaultValues: configuracoes || undefined,
  });

  useEffect(() => {
    fetchConfiguracoes();
  }, [fetchConfiguracoes]);

  useEffect(() => {
    if (configuracoes) {
      reset(configuracoes);
    }
  }, [configuracoes, reset]);

  const onSubmit = async (data: ConfiguracoesFormData) => {
    try {
      setIsLoading(true);
      await atualizarConfiguracoes(data);
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetar = async () => {
    try {
      setIsLoading(true);
      await resetarConfiguracoes();
      toast({
        title: "Sucesso",
        description: "Configurações resetadas com sucesso.",
      });
      setShowConfirmDialog(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível resetar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      await realizarBackup();
      toast({
        title: "Sucesso",
        description: "Backup realizado com sucesso.",
      });
      setShowBackupDialog(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o backup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemaChange = (novoTema: "claro" | "escuro" | "sistema") => {
    setTheme(novoTema);
    toast({
      title: "Tema atualizado",
      description: "O tema do sistema foi atualizado com sucesso.",
    });
  };

  if (isLoadingConfig) {
    return <Loading text="Carregando configurações..." />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Erro ao carregar configurações: {error}</p>
        <Button onClick={() => fetchConfiguracoes()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowBackupDialog(true)}
            disabled={isLoading}
          >
            Realizar Backup
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoading}
          >
            Resetar Configurações
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="empresa" className="space-y-4">
          <TabsList>
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="empresa">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>
                  Informações cadastrais da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Razão Social</Label>
                    <Input {...register("empresa.razaoSocial")} />
                    {errors.empresa?.razaoSocial && (
                      <p className="text-sm text-red-500">
                        {errors.empresa.razaoSocial.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Nome Fantasia</Label>
                    <Input {...register("empresa.nomeFantasia")} />
                    {errors.empresa?.nomeFantasia && (
                      <p className="text-sm text-red-500">
                        {errors.empresa.nomeFantasia.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input {...register("empresa.cnpj")} />
                    {errors.empresa?.cnpj && (
                      <p className="text-sm text-red-500">
                        {errors.empresa.cnpj.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Inscrição Estadual</Label>
                    <Input {...register("empresa.inscricaoEstadual")} />
                    {errors.empresa?.inscricaoEstadual && (
                      <p className="text-sm text-red-500">
                        {errors.empresa.inscricaoEstadual.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Logradouro</Label>
                      <Input {...register("empresa.endereco.logradouro")} />
                      {errors.empresa?.endereco?.logradouro && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.endereco.logradouro.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input {...register("empresa.endereco.numero")} />
                      {errors.empresa?.endereco?.numero && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.endereco.numero.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Complemento</Label>
                      <Input {...register("empresa.endereco.complemento")} />
                    </div>

                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input {...register("empresa.endereco.bairro")} />
                      {errors.empresa?.endereco?.bairro && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.endereco.bairro.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input {...register("empresa.endereco.cidade")} />
                      {errors.empresa?.endereco?.cidade && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.endereco.cidade.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Input {...register("empresa.endereco.estado")} />
                      {errors.empresa?.endereco?.estado && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.endereco.estado.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <Input {...register("empresa.endereco.cep")} />
                      {errors.empresa?.endereco?.cep && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.endereco.cep.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input {...register("empresa.contato.telefone")} />
                      {errors.empresa?.contato?.telefone && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.contato.telefone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input {...register("empresa.contato.email")} />
                      {errors.empresa?.contato?.email && (
                        <p className="text-sm text-red-500">
                          {errors.empresa.contato.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Site</Label>
                      <Input {...register("empresa.contato.site")} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiscal">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Fiscais</CardTitle>
                <CardDescription>
                  Configurações relacionadas à emissão de documentos fiscais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Regime Tributário</Label>
                    <Select
                      defaultValue={
                        configuracoes?.fiscal?.regimeTributario || "simples"
                      }
                      onValueChange={(value) =>
                        register("fiscal.regimeTributario").onChange({
                          target: { value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o regime tributário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">
                          Simples Nacional
                        </SelectItem>
                        <SelectItem value="lucro_presumido">
                          Lucro Presumido
                        </SelectItem>
                        <SelectItem value="lucro_real">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.fiscal?.regimeTributario && (
                      <p className="text-sm text-red-500">
                        {errors.fiscal.regimeTributario.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>CNAE</Label>
                    <Input {...register("fiscal.cnae")} />
                    {errors.fiscal?.cnae && (
                      <p className="text-sm text-red-500">
                        {errors.fiscal.cnae.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Série NFe</Label>
                    <Input {...register("fiscal.serieNFe")} />
                    {errors.fiscal?.serieNFe && (
                      <p className="text-sm text-red-500">
                        {errors.fiscal.serieNFe.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Número NFe</Label>
                    <Input {...register("fiscal.numeroNFe")} />
                    {errors.fiscal?.numeroNFe && (
                      <p className="text-sm text-red-500">
                        {errors.fiscal.numeroNFe.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Certificado Digital</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número do Certificado</Label>
                      <Input
                        {...register("fiscal.certificadoDigital.numero")}
                      />
                      {errors.fiscal?.certificadoDigital?.numero && (
                        <p className="text-sm text-red-500">
                          {errors.fiscal.certificadoDigital.numero.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Validade</Label>
                      <Input
                        type="date"
                        {...register("fiscal.certificadoDigital.dataValidade", {
                          valueAsDate: true,
                        })}
                      />
                      {errors.fiscal?.certificadoDigital?.dataValidade && (
                        <p className="text-sm text-red-500">
                          {
                            errors.fiscal.certificadoDigital.dataValidade
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Preferências gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select value={theme} onValueChange={handleTemaChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claro">Claro</SelectItem>
                        <SelectItem value="escuro">Escuro</SelectItem>
                        <SelectItem value="sistema">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select defaultValue={configuracoes?.idioma} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          Português (Brasil)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Backup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        {...register("backupAutomatico")}
                        checked={configuracoes?.backupAutomatico}
                      />
                      <Label>Backup Automático</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Intervalo de Backup (horas)</Label>
                      <Input
                        type="number"
                        {...register("intervaloBackup", {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.intervaloBackup && (
                        <p className="text-sm text-red-500">
                          {errors.intervaloBackup.message}
                        </p>
                      )}
                    </div>

                    {configuracoes?.ultimoBackup && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">
                          Último backup realizado em:{" "}
                          {formatarData(configuracoes.ultimoBackup)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset(configuracoes)}
            disabled={!isDirty || isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={!isDirty || isLoading}>
            Salvar Alterações
          </Button>
        </div>
      </form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reset</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja resetar todas as configurações? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleResetar}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Realizar Backup</DialogTitle>
            <DialogDescription>
              Deseja realizar um backup das configurações do sistema agora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBackupDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleBackup}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
