import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputMask } from "@/components/ui/input-mask";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cliente } from "@/types";
import { buscarCep } from "@/services/enderecoService";
import { adicionarCliente, atualizarCliente } from "@/services/mockData";
import { FormFeedback } from "@/components/ui/form-feedback";
import { DialogConfirm } from "@/components/ui/dialog-confirm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema de validação
const clienteSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(14, { message: "Telefone inválido" }),
  whatsapp: z.string().min(14, { message: "WhatsApp inválido" }),
  endereco: z.object({
    cep: z.string().min(8, { message: "CEP inválido" }),
    logradouro: z.string().min(3, { message: "Logradouro obrigatório" }),
    numero: z.string().min(1, { message: "Número obrigatório" }),
    complemento: z.string().optional(),
    bairro: z.string().min(3, { message: "Bairro obrigatório" }),
    cidade: z.string().min(3, { message: "Cidade obrigatória" }),
    estado: z.string().min(2, { message: "Estado obrigatório" }),
  }),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  cliente?: Cliente;
  onSuccess: () => void;
}

export function ClienteForm({ cliente, onSuccess }: ClienteFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente
      ? { ...cliente }
      : {
          nome: "",
          cpf: "",
          email: "",
          telefone: "",
          whatsapp: "",
          endereco: {
            cep: "",
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
          },
        },
  });

  const handleSubmit = (data: ClienteFormData) => {
    setIsLoading(true);
    try {
      // Limpar formatos dos campos
      const telefone = data.telefone.replace(/\D/g, "");
      const whatsapp = data.whatsapp.replace(/\D/g, "");
      const cep = data.endereco.cep.replace(/\D/g, "");
      const cpf = data.cpf.replace(/\D/g, "");

      const clienteData = {
        nome: data.nome,
        cpf,
        email: data.email,
        telefone: data.telefone,
        whatsapp,
        endereco: {
          cep,
          logradouro: data.endereco.logradouro,
          numero: data.endereco.numero,
          complemento: data.endereco.complemento,
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
          estado: data.endereco.estado,
        },
        pendingValue: cliente?.pendingValue || 0,
      };

      if (cliente) {
        // Atualizar cliente existente
        atualizarCliente({ ...clienteData, id: cliente.id });

        toast({
          title: "Cliente atualizado",
          description:
            "As informações do cliente foram atualizadas com sucesso!",
        });
      } else {
        // Adicionar novo cliente
        adicionarCliente(clienteData);

        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso!",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const cep = form.getValues("endereco.cep").replace(/\D/g, "");

    if (cep.length === 8) {
      setIsLoading(true);
      try {
        const dadosEndereco = await buscarCep(cep);

        form.setValue("endereco.logradouro", dadosEndereco.logradouro);
        form.setValue("endereco.bairro", dadosEndereco.bairro);
        form.setValue("endereco.cidade", dadosEndereco.localidade);
        form.setValue("endereco.estado", dadosEndereco.uf);

        if (dadosEndereco.complemento) {
          form.setValue("endereco.complemento", dadosEndereco.complemento);
        }
      } catch (error) {
        toast({
          title: "Erro ao buscar CEP",
          description:
            "Não foi possível encontrar o endereço com este CEP. Verifique se o CEP está correto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {cliente ? "Editar Cliente" : "Cadastro de Cliente"}
        </CardTitle>
        <CardDescription>
          {cliente
            ? "Atualize as informações do cliente"
            : "Preencha os dados para cadastrar um novo cliente"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                <p className="text-sm text-muted-foreground">
                  Dados básicos do cliente
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="nome"
                  label="Nome Completo"
                  control={form.control}
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      ref={ref}
                      placeholder="Nome completo"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  )}
                />
                <CustomFormField
                  name="cpf"
                  label="CPF"
                  control={form.control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      mask="999.999.999-99"
                      maskChar={null}
                      placeholder="000.000.000-00"
                      type="tel"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                  )}
                />
                <CustomFormField
                  name="email"
                  label="Email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="exemplo@email.com"
                      type="email"
                      disabled={isLoading}
                    />
                  )}
                />
                <CustomFormField
                  name="telefone"
                  label="Telefone"
                  control={form.control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      mask="(99) 99999-9999"
                      maskChar={null}
                      placeholder="(00) 00000-0000"
                      type="tel"
                      autoComplete="tel"
                      disabled={isLoading}
                    />
                  )}
                />
                <CustomFormField
                  name="whatsapp"
                  label="WhatsApp"
                  control={form.control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      mask="(99) 99999-9999"
                      maskChar={null}
                      placeholder="(00) 00000-0000"
                      type="tel"
                      autoComplete="tel"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Endereço</h3>
                <p className="text-sm text-muted-foreground">
                  Informe o CEP para preenchimento automático
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="endereco.cep"
                  label="CEP"
                  control={form.control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      mask="99999-999"
                      maskChar={null}
                      placeholder="00000-000"
                      type="tel"
                      autoComplete="postal-code"
                      disabled={isLoading}
                      onBlur={(e) => {
                        field.onBlur();
                        void handleCepBlur();
                      }}
                    />
                  )}
                />
                <div className="md:col-span-2">
                  <CustomFormField
                    name="endereco.logradouro"
                    label="Logradouro"
                    control={form.control}
                    render={({ field: { ref, ...field } }) => (
                      <Input
                        {...field}
                        ref={ref}
                        placeholder="Rua, Avenida, etc"
                        disabled={isLoading}
                        autoComplete="street-address"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="endereco.numero"
                  label="Número"
                  control={form.control}
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      ref={ref}
                      placeholder="123"
                      disabled={isLoading}
                      autoComplete="address-line2"
                    />
                  )}
                />
                <div className="md:col-span-2">
                  <CustomFormField
                    name="endereco.complemento"
                    label="Complemento"
                    control={form.control}
                    render={({ field: { ref, ...field } }) => (
                      <Input
                        {...field}
                        ref={ref}
                        placeholder="Apto, Bloco, etc"
                        disabled={isLoading}
                        autoComplete="address-line3"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="endereco.bairro"
                  label="Bairro"
                  control={form.control}
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      ref={ref}
                      placeholder="Bairro"
                      disabled={isLoading}
                      autoComplete="address-level2"
                    />
                  )}
                />
                <CustomFormField
                  name="endereco.cidade"
                  label="Cidade"
                  control={form.control}
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      ref={ref}
                      placeholder="Cidade"
                      disabled={isLoading}
                      autoComplete="address-level1"
                    />
                  )}
                />
                <CustomFormField
                  name="endereco.estado"
                  label="Estado"
                  control={form.control}
                  render={({ field: { ref, ...field } }) => (
                    <Input
                      {...field}
                      ref={ref}
                      placeholder="UF"
                      disabled={isLoading}
                      autoComplete="address-level1"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onSuccess();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : cliente
                ? "Salvar Alterações"
                : "Cadastrar Cliente"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
