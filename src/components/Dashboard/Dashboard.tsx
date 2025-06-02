import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  Package,
  Tags,
  Settings,
} from "lucide-react";
import { useCupomFiscalStore } from "../../store";
import { LucideIcon } from "lucide-react";

interface CardAction {
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
}

export function Dashboard() {
  const navigate = useNavigate();
  const cupons = useCupomFiscalStore((state) => state.cupons);

  const totalVendas = cupons.reduce((acc, cupom) => acc + cupom.valorTotal, 0);
  const totalCupons = cupons.length;
  const cuponsPendentes = cupons.filter((c) => c.status === "pendente").length;

  const cards: CardAction[] = [
    {
      title: "Produtos",
      description: "Gerencie o cadastro e estoque de produtos",
      icon: Package,
      action: () => {
        navigate("/produtos");
      },
    },
    {
      title: "Clientes",
      description: "Gerencie o cadastro de clientes",
      icon: Users,
      action: () => {
        navigate("/clientes");
      },
    },
    {
      title: "Vendas",
      description: "Registre e gerencie as vendas",
      icon: ShoppingCart,
      action: () => {
        navigate("/vendas");
      },
    },
    {
      title: "Financeiro",
      description: "Controle suas receitas e despesas",
      icon: DollarSign,
      action: () => {
        navigate("/financeiro");
      },
    },
    {
      title: "Relatórios",
      description: "Visualize relatórios de vendas, financeiro e estoque",
      icon: FileText,
      action: () => {
        navigate("/relatorios");
      },
    },
    {
      title: "Cupom Fiscal",
      description: "Emissão e gestão de cupons fiscais",
      icon: Receipt,
      action: () => {
        navigate("/cupom-fiscal");
      },
    },
    {
      title: "Cupons",
      description: "Visualize e gerencie cupons fiscais emitidos",
      icon: Tags,
      action: () => {
        navigate("/cupons");
      },
    },
    {
      title: "Configurações",
      description: "Configure as preferências do sistema",
      icon: Settings,
      action: () => {
        navigate("/configuracoes");
      },
    },
    {
      title: "Estoque",
      description: "Gestão completa de estoque e inventário",
      icon: Package,
      action: () => {
        navigate("/estoque");
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sistema de Gestão</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Vendas</p>
              <h3 className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalVendas)}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Cupons</p>
              <h3 className="text-2xl font-bold">{totalCupons}</h3>
            </div>
            <Receipt className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cupons Pendentes</p>
              <h3 className="text-2xl font-bold">{cuponsPendentes}</h3>
            </div>
            <ShoppingCart className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="p-6 cursor-pointer transition-all"
            onClick={card.action}
          >
            <div className="flex flex-col items-center text-center">
              <card.icon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-muted-foreground">{card.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
