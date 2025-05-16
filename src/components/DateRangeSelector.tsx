import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDateRange } from '@/context/date-range-context';

export function DateRangeSelector() {
  const { dateRange, setDateRange, selectedPeriod, setSelectedPeriod } = useDateRange();

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (period) {
      case 'hoje':
        from = today;
        to = today;
        break;
      case 'semanal':
        from = new Date(today.setDate(today.getDate() - 7));
        to = new Date();
        break;
      case 'quinzenal':
        from = new Date(today.setDate(today.getDate() - 15));
        to = new Date();
        break;
      case 'mensal':
        from = new Date(today.setMonth(today.getMonth() - 1));
        to = new Date();
        break;
      default:
        from = dateRange.from;
        to = dateRange.to;
    }

    const newRange = { from, to };
    setDateRange(newRange);
  };

  return (
    <div className="flex flex-col gap-4">
      <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hoje">Hoje</SelectItem>
          <SelectItem value="semanal">Últimos 7 dias</SelectItem>
          <SelectItem value="quinzenal">Últimos 15 dias</SelectItem>
          <SelectItem value="mensal">Últimos 30 dias</SelectItem>
          <SelectItem value="personalizado">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {selectedPeriod === 'personalizado' && (
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PPP", { locale: ptBR })
                ) : (
                  <span>Data inicial</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => {
                  const newRange = { ...dateRange, from: date };
                  setDateRange(newRange);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PPP", { locale: ptBR })
                ) : (
                  <span>Data final</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => {
                  const newRange = { ...dateRange, to: date };
                  setDateRange(newRange);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
} 