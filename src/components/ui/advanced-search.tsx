import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchField {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface AdvancedSearchProps {
  fields: SearchField[];
  onSearch: (filters: Record<string, any>) => void;
  onClear?: () => void;
  className?: string;
}

export function AdvancedSearch({
  fields,
  onSearch,
  onClear,
  className,
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [quickSearch, setQuickSearch] = useState("");

  const handleSearch = () => {
    const searchParams = { ...filters };
    if (quickSearch) {
      searchParams.quickSearch = quickSearch;
    }
    onSearch(searchParams);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    setQuickSearch("");
    onClear?.();
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          className="pl-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "select" ? (
                  <Select
                    value={filters[field.name] || ""}
                    onValueChange={(value) =>
                      handleFilterChange(field.name, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.placeholder || "Selecione..."}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={filters[field.name] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.name, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
