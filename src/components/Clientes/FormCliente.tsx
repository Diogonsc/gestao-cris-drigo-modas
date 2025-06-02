import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputMask } from "../ui/input-mask";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useClienteStore } from "../../store";
import { Cliente } from "../../store";
import { Loading } from "../ui/loading";
import { FormFeedback } from "../ui/form-feedback";
import { DialogConfirm } from "../ui/dialog-confirm";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schemaCliente = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.object({
    logradouro: z.string().min(3, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Bairro é obrigatório"),
    cidade: z.string().min(2, "Cidade é obrigatória"),
    estado: z.string().length(2, "Estado deve ter 2 caracteres"),
    cep: z.string().min(8, "CEP inválido"),
  }),
  status: z.enum(["ativo", "inativo"]),
});

type FormClienteData = z.infer<typeof schemaCliente>;

interface FormClienteProps {
  cliente?: Cliente;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export function FormCliente({
  cliente,
  onSuccess,
  onCancel,
}: FormClienteProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const { toast } = useToast();
  const { adicionarCliente, atualizarCliente, setError } = useClienteStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<FormClienteData>({
    resolver: zodResolver(schemaCliente),
    defaultValues: cliente || {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      },
      status: "ativo",
    },
  });

  const onSubmit = (data: FormClienteData) => {
    try {
      setIsSubmitting(true);
      if (cliente) {
        atualizarCliente(cliente.id, data);
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        });
      } else {
        adicionarCliente(data);
        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso.",
        });
        reset();
      }
      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar cliente"
      );
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(errors).length > 0) {
      setShowConfirmCancel(true);
    } else {
      onCancel?.();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" {...register("nome")} error={errors.nome?.message} />
          <FormFeedback error={errors.nome?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <InputMask
                id="cpf"
                mask="999.999.999-99"
                value={field.value}
                onChange={field.onChange}
                error={errors.cpf?.message}
              />
            )}
          />
          <FormFeedback error={errors.cpf?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <FormFeedback error={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <InputMask
                id="telefone"
                mask="(99) 99999-9999"
                value={field.value}
                onChange={field.onChange}
                error={errors.telefone?.message}
              />
            )}
          />
          <FormFeedback error={errors.telefone?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cep">CEP</Label>
          <Controller
            name="endereco.cep"
            control={control}
            render={({ field }) => (
              <InputMask
                id="cep"
                mask="99999-999"
                value={field.value}
                onChange={field.onChange}
                error={errors.endereco?.cep?.message}
              />
            )}
          />
          <FormFeedback error={errors.endereco?.cep?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input
            id="logradouro"
            {...register("endereco.logradouro")}
            error={errors.endereco?.logradouro?.message}
          />
          <FormFeedback error={errors.endereco?.logradouro?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            {...register("endereco.numero")}
            error={errors.endereco?.numero?.message}
          />
          <FormFeedback error={errors.endereco?.numero?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            {...register("endereco.complemento")}
            error={errors.endereco?.complemento?.message}
          />
          <FormFeedback error={errors.endereco?.complemento?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            {...register("endereco.bairro")}
            error={errors.endereco?.bairro?.message}
          />
          <FormFeedback error={errors.endereco?.bairro?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            {...register("endereco.cidade")}
            error={errors.endereco?.cidade?.message}
          />
          <FormFeedback error={errors.endereco?.cidade?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            defaultValue={cliente?.endereco.estado}
            onValueChange={(value) => {
              setValue("endereco.estado", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFeedback error={errors.endereco?.estado?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={cliente?.status || "ativo"}
            onValueChange={(value) => {
              setValue("status", value as "ativo" | "inativo");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <FormFeedback error={errors.status?.message} />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loading size="sm" text="Salvando..." />
          ) : cliente ? (
            "Atualizar"
          ) : (
            "Cadastrar"
          )}
        </Button>
      </div>

      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Cancelar cadastro"
        description="Existem dados não salvos. Deseja realmente cancelar?"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
      />
    </form>
  );
}
