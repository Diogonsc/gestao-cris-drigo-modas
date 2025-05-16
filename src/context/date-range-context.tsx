import { createContext, useContext, useState, ReactNode } from "react";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type DateRangeContextType = {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>("semanal");

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange, selectedPeriod, setSelectedPeriod }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
} 