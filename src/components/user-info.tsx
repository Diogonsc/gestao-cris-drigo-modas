import { UserCircle, EllipsisVertical } from "lucide-react";


export function UserInfo() {
  return (
    <div className="flex items-center justify-between gap-2">
      <img src="https://github.com/diogonsc.png" alt="Diogo Nascimento" className="h-10 w-10 rounded-full" />
      <div className="text-sm flex-1">
        <p className="font-medium">Diogo Nascimento</p>
        <p className="text-muted-foreground">Administrador</p>
      </div>
      <div className="w-8 h-8 hover:bg-gray-500/50 cursor-pointer rounded-full flex items-center justify-center">
        <EllipsisVertical className="h-4 w-4" />
      </div>
    </div>
  );
}