import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Loading } from "../components/ui/loading";
import { ErrorBoundary } from "../components/ui/error-boundary";
import { useAuthStore } from "../store";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import React from "react";

// Interface para definição de rotas
export interface RouteConfig {
  path: string;
  element: React.ElementType;
  title: string;
  requiresAuth?: boolean;
  permissions?: string[];
  children?: RouteConfig[];
}

// Lazy loading dos componentes
const FormCupomFiscal = lazy(() =>
  import("../components/CupomFiscal/FormCupomFiscal").then((module) => ({
    default: module.FormCupomFiscal,
  }))
);

const ListaCupons = lazy(() =>
  import("../components/CupomFiscal/ListaCupons").then((module) => ({
    default: module.ListaCupons,
  }))
);

const Produtos = lazy(() => import("../pages/Produtos"));

const Clientes = lazy(() =>
  import("../pages/Clientes").then((module) => ({
    default: module.default,
  }))
);

const ListaVendas = lazy(() =>
  import("../components/Vendas/ListaVendas").then((module) => ({
    default: module.ListaVendas,
  }))
);

const ListaTransacoes = lazy(() =>
  import("../components/Financeiro/ListaTransacoes").then((module) => ({
    default: module.ListaTransacoes,
  }))
);

const Relatorios = lazy(() =>
  import("../components/Relatorios/Relatorios").then((module) => ({
    default: module.default,
  }))
);

const Configuracoes = lazy(
  () => import("../components/Configuracoes/Configuracoes")
);
const Estoque = lazy(() => import("../components/Estoque/Estoque"));

const Login = lazy(() =>
  import("../components/Auth/Login").then((module) => ({
    default: module.Login,
  }))
);

const NovaCompra = lazy(() =>
  import("../pages/NovaCompra").then((module) => ({
    default: module.default,
  }))
);

const Usuarios = lazy(() =>
  import("../pages/Usuarios").then((module) => ({
    default: module.default,
  }))
);

const NovoCliente = lazy(() =>
  import("../pages/NovoCliente").then((module) => ({
    default: module.default,
  }))
);

const NovoProduto = lazy(() => import("../pages/NovoProduto"));

const EditarProduto = lazy(() => import("../pages/EditarProduto"));

const NovoUsuario = lazy(() =>
  import("../pages/NovoUsuario").then((module) => ({
    default: module.default,
  }))
);

const EditarUsuario = lazy(() =>
  import("../pages/EditarUsuario").then((module) => ({
    default: module.default,
  }))
);

// Configuração das rotas
const routes: RouteConfig[] = [
  {
    path: "/login",
    element: Login,
    title: "Login",
    requiresAuth: false,
  },
  {
    path: "/",
    element: Dashboard,
    title: "Dashboard",
    requiresAuth: true,
  },
  {
    path: "/cupom-fiscal",
    element: FormCupomFiscal,
    title: "Emitir Cupom Fiscal",
    requiresAuth: true,
    permissions: ["emitir_cupom"],
  },
  {
    path: "/cupons",
    element: ListaCupons,
    title: "Cupons Fiscais",
    requiresAuth: true,
    permissions: ["gerenciar_cupons"],
  },
  {
    path: "/produtos",
    element: Produtos,
    title: "Produtos",
    requiresAuth: true,
    permissions: ["gerenciar_produtos"],
  },
  {
    path: "/produtos/novo",
    element: NovoProduto,
    title: "Novo Produto",
    requiresAuth: true,
    permissions: ["gerenciar_produtos"],
  },
  {
    path: "/produtos/:id",
    element: EditarProduto,
    title: "Editar Produto",
    requiresAuth: true,
    permissions: ["gerenciar_produtos"],
  },
  {
    path: "/clientes",
    element: Clientes,
    title: "Clientes",
    requiresAuth: true,
    permissions: ["gerenciar_clientes"],
  },
  {
    path: "/novo-cliente",
    element: NovoCliente,
    title: "Novo Cliente",
    requiresAuth: true,
    permissions: ["gerenciar_clientes"],
  },
  {
    path: "/vendas",
    element: ListaVendas,
    title: "Vendas",
    requiresAuth: true,
    permissions: ["gerenciar_vendas"],
  },
  {
    path: "/financeiro",
    element: ListaTransacoes,
    title: "Financeiro",
    requiresAuth: true,
    permissions: ["gerenciar_financeiro"],
  },
  {
    path: "/relatorios",
    element: Relatorios,
    title: "Relatórios",
    requiresAuth: true,
    permissions: ["visualizar_relatorios"],
  },
  {
    path: "/configuracoes",
    element: Configuracoes,
    title: "Configurações",
    requiresAuth: true,
    permissions: ["gerenciar_configuracoes"],
  },
  {
    path: "/estoque",
    element: Estoque,
    title: "Estoque",
    requiresAuth: true,
    permissions: ["gerenciar_estoque"],
  },
  {
    path: "/nova-compra",
    element: NovaCompra,
    title: "Nova Compra",
    requiresAuth: true,
    permissions: ["gerenciar_vendas"],
  },
  {
    path: "/usuarios",
    element: Usuarios,
    title: "Usuários",
    requiresAuth: true,
    permissions: ["gerenciar_usuarios"],
  },
  {
    path: "/novo-usuario",
    element: NovoUsuario,
    title: "Novo Usuário",
    requiresAuth: true,
    permissions: ["gerenciar_usuarios"],
  },
  {
    path: "/usuarios/:id",
    element: EditarUsuario,
    title: "Editar Usuário",
    requiresAuth: true,
    permissions: ["gerenciar_usuarios"],
  },
];

// Exportação explícita das rotas
export { routes };

// Componente de guarda de rota
function RouteGuard({
  children,
  requiresAuth,
  permissions,
}: {
  children: React.ReactNode;
  requiresAuth?: boolean;
  permissions?: string[];
}) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize a verificação de permissões
  const hasRequiredPermissions = React.useMemo(() => {
    // Se não houver permissões requeridas ou não houver usuário, retorna true
    if (!permissions || !user?.permissions) return true;

    // Verifica se o usuário tem todas as permissões necessárias
    return permissions.every((permission) =>
      user.permissions.includes(permission)
    );
  }, [permissions, user]);

  // Efeito para lidar com redirecionamentos
  React.useEffect(() => {
    const currentPath = location.pathname;

    // Se estiver na rota de login e já estiver autenticado, redireciona para home
    if (currentPath === "/login" && isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    // Se não estiver autenticado e a rota requer autenticação
    if (requiresAuth && !isAuthenticated && currentPath !== "/login") {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    // Se não tiver permissões necessárias
    if (
      permissions &&
      user &&
      !hasRequiredPermissions &&
      currentPath !== "/unauthorized"
    ) {
      navigate("/unauthorized", { replace: true });
      return;
    }
  }, [
    requiresAuth,
    isAuthenticated,
    permissions,
    user,
    hasRequiredPermissions,
    location.pathname,
    navigate,
  ]);

  // Se não estiver autenticado ou não tiver permissões, não renderiza nada
  if (
    (requiresAuth && !isAuthenticated) ||
    (permissions && user && !hasRequiredPermissions)
  ) {
    return null;
  }

  return <>{children}</>;
}

// Componente principal de rotas
export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading text="Carregando..." />}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <RouteGuard
                  requiresAuth={route.requiresAuth}
                  permissions={route.permissions}
                >
                  <route.element />
                </RouteGuard>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
