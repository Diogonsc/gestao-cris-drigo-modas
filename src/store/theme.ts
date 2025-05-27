import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { useConfiguracoesStore } from "./index";

interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

/**
 * Store para gerenciar o tema da aplicação
 * @returns {ThemeState} Estado e métodos para gerenciar o tema
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        // Atualiza o tema no store local
        set({ theme });

        // Atualiza o tema nas configurações do sistema
        const configuracoesStore = useConfiguracoesStore.getState();
        if (configuracoesStore.configuracoes) {
          configuracoesStore.atualizarConfiguracoes({ tema: theme });
        }
      },
    }),
    {
      name: "theme-store",
    }
  )
);

/**
 * Hook para aplicar o tema atual
 * @returns {void}
 */
export function useTheme() {
  const { theme } = useThemeStore();
  const { configuracoes } = useConfiguracoesStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // Usa o tema das configurações do sistema se disponível, senão usa o tema do store local
    const temaAtual = configuracoes?.tema || theme;

    if (temaAtual === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(temaAtual);
    }
  }, [theme, configuracoes?.tema]);
}
