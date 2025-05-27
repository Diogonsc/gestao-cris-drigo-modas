import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro não tratado:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null }, () => {
      const root = document.getElementById("root");
      if (root) {
        const event = new Event("error-reset");
        root.dispatchEvent(event);
      }
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || "Ocorreu um erro inesperado"}
          </p>
          <Button onClick={this.handleReset} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
