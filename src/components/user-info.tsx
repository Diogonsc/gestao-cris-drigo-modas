import {
  UserCircle,
  EllipsisVertical,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/providers/theme-provider";

export function UserInfo() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const nome = "Diogo Nascimento";
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout, como limpar o token, etc
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/diogonsc.png" alt={nome} />
        <AvatarFallback>{iniciais}</AvatarFallback>
      </Avatar>
      <div className="text-sm flex-1">
        <p className="font-medium">{nome}</p>
        <p className="text-muted-foreground">Administrador</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-8 h-8 hover:bg-gray-500/50 cursor-pointer rounded-full flex items-center justify-center">
            <EllipsisVertical className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
              {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
              {theme === "system" && <Monitor className="mr-2 h-4 w-4" />}
              <span>Tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Escuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
