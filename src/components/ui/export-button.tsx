import { Download } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useExport } from "@/utils/export";
import { toast } from "sonner";

interface ExportButtonProps {
  data: any[];
  filename: string;
  headers?: string[];
  disabled?: boolean;
}

export function ExportButton({
  data,
  filename,
  headers,
  disabled = false,
}: ExportButtonProps) {
  const { exportData } = useExport();

  const handleExport = async (format: "csv" | "excel" | "pdf" | "json") => {
    try {
      await exportData(data, filename, format, headers);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar dados. Tente novamente.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          disabled={!headers}
        >
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={!headers}
        >
          PDF (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
