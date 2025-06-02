import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useUsuarioStore } from "../../store";
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

const schemaUsuario = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .optional(),
    confirmarSenha: z.string().optional(),
    perfil: z.string().min(1, "Perfil é obrigatório"),
    status: z.enum(["ativo", "inativo"]),
  })
  .refine(
    (data) => {
      if (data.senha && data.confirmarSenha) {
        return data.senha === data.confirmarSenha;
      }
      return true;
    },
    {
      message: "As senhas não conferem",
      path: ["confirmarSenha"],
    }
  );

type FormUsuarioData = z.infer<typeof schemaUsuario>;

interface FormUsuarioProps {
  usuario?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const perfis = [
  "Administrador",
  "Gerente",
  "Vendedor",
  "Estoquista",
  "Financeiro",
];

export function FormUsuario({
  usuario,
  onSuccess,
  onCancel,
}: FormUsuarioProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const { toast } = useToast();
  const { adicionarUsuario, atualizarUsuario, setError } = useUsuarioStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormUsuarioData>({
    resolver: zodResolver(schemaUsuario),
    defaultValues: usuario || {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      perfil: "",
      status: "ativo",
    },
  });

  const onSubmit = async (data: FormUsuarioData) => {
    try {
      setIsSubmitting(true);
      if (usuario) {
        await atualizarUsuario(usuario.id, data);
        toast({
          title: "Usuário atualizado",
          description: "Os dados do usuário foram atualizados com sucesso.",
        });
      } else {
        await adicionarUsuario({
          ...data,
        });
        toast({
          title: "Usuário cadastrado",
          description: "O usuário foi cadastrado com sucesso.",
        });
        reset();
      }
      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar usuário"
      );
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados do usuário.",
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
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              {...register("nome")}
              error={errors.nome?.message}
              disabled={isSubmitting}
            />
            <FormFeedback error={errors.nome?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              disabled={isSubmitting}
            />
            <FormFeedback error={errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">
              {usuario ? "Nova Senha (opcional)" : "Senha"}
            </Label>
            <Input
              id="senha"
              type="password"
              {...register("senha")}
              error={errors.senha?.message}
              disabled={isSubmitting}
            />
            <FormFeedback error={errors.senha?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmarSenha">
              {usuario ? "Confirmar Nova Senha" : "Confirmar Senha"}
            </Label>
            <Input
              id="confirmarSenha"
              type="password"
              {...register("confirmarSenha")}
              error={errors.confirmarSenha?.message}
              disabled={isSubmitting}
            />
            <FormFeedback error={errors.confirmarSenha?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="perfil">Perfil</Label>
            <Select
              defaultValue={usuario?.perfil}
              onValueChange={(value) => setValue("perfil", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                {perfis.map((perfil) => (
                  <SelectItem key={perfil} value={perfil}>
                    {perfil}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFeedback error={errors.perfil?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={usuario?.status || "ativo"}
              onValueChange={(value) =>
                setValue("status", value as "ativo" | "inativo")
              }
              disabled={isSubmitting}
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
      </div>
      <div className="flex justify-end gap-2 p-4 border-t bg-background">
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
            <>
              <Loading className="mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : usuario ? (
            "Salvar Alterações"
          ) : (
            "Cadastrar Usuário"
          )}
        </Button>
      </div>
      <DialogConfirm
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Descartar alterações?"
        description="Você tem alterações não salvas. Tem certeza que deseja descartá-las?"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
      />
    </form>
  );
}
