import { useState } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputMask } from "../ui/input-mask";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { Loading } from "../ui/loading";

interface Item {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export function ListaItens() {
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const {
    control,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const adicionarItem = () => {
    append({
      codigo: "",
      descricao: "",
      quantidade: 1,
      valorUnitario: 0,
    });
    toast.success("Novo item adicionado");
  };

  const confirmarRemocao = (index: number) => {
    setIsRemoving(index);
  };

  const removerItem = (index: number) => {
    try {
      remove(index);
      toast.success("Item removido com sucesso");
    } catch (error) {
      toast.error("Erro ao remover item");
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Itens do Cupom</h2>
        <Button
          type="button"
          onClick={adicionarItem}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`itens.${index}.codigo`}>Código</Label>
                <Input
                  id={`itens.${index}.codigo`}
                  {...register(`itens.${index}.codigo`)}
                  error={errors.itens?.[index]?.codigo?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor={`itens.${index}.descricao`}>Descrição</Label>
                <Input
                  id={`itens.${index}.descricao`}
                  {...register(`itens.${index}.descricao`)}
                  error={errors.itens?.[index]?.descricao?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor={`itens.${index}.quantidade`}>Quantidade</Label>
                <Input
                  id={`itens.${index}.quantidade`}
                  type="number"
                  {...register(`itens.${index}.quantidade`, {
                    valueAsNumber: true,
                  })}
                  error={errors.itens?.[index]?.quantidade?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor={`itens.${index}.valorUnitario`}>
                  Valor Unitário
                </Label>
                <Controller
                  name={`itens.${index}.valorUnitario`}
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      mask="999999.99"
                      maskChar=""
                      placeholder="0,00"
                      disabled={isSubmitting}
                      onChange={(value) => {
                        const number = parseFloat(value.replace(",", "."));
                        field.onChange(isNaN(number) ? 0 : number);
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <ConfirmDialog
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isSubmitting || isRemoving === index}
                  >
                    {isRemoving === index ? (
                      <Loading size="sm" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </>
                    )}
                  </Button>
                }
                title="Remover Item"
                description="Tem certeza que deseja remover este item? Esta ação não pode ser desfeita."
                confirmText="Remover"
                variant="destructive"
                onConfirm={() => confirmarRemocao(index)}
              />
            </div>
          </Card>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">Nenhum item adicionado</p>
            <p className="text-sm text-gray-400 mt-1">
              Clique em "Adicionar Item" para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
