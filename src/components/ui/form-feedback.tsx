import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../lib/utils";

interface FormFeedbackProps {
  type?: "error" | "success" | "info";
  message?: string;
  error?: string;
  className?: string;
}

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

const styles = {
  error: "text-destructive bg-destructive/10 border-destructive/20",
  success: "text-green-600 bg-green-50 border-green-200",
  info: "text-blue-600 bg-blue-50 border-blue-200",
};

export function FormFeedback({
  type = "error",
  message,
  error,
  className,
}: FormFeedbackProps) {
  const Icon = icons[type];
  const displayMessage = error || message;

  if (!displayMessage) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-md border text-sm",
        styles[type],
        className
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{displayMessage}</span>
    </div>
  );
}
