import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../store";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "1d";

// Usuário padrão para desenvolvimento
const DEFAULT_USER = {
  id: "1",
  name: "Administrador",
  email: "admin@crisdrigo.com.br",
  role: "admin" as const,
  permissions: [
    "emitir_cupom",
    "gerenciar_cupons",
    "gerenciar_produtos",
    "gerenciar_clientes",
    "gerenciar_vendas",
    "gerenciar_financeiro",
    "visualizar_relatorios",
    "gerenciar_configuracoes",
    "gerenciar_estoque",
  ],
};

// Senha padrão: Admin@123
const DEFAULT_PASSWORD_HASH =
  "$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5YxX";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: "admin" | "user";
}

export const AuthService = {
  async login({ email, password }: LoginCredentials) {
    try {
      // Em produção, aqui você deve buscar o usuário no banco de dados
      // Por enquanto, vamos usar o usuário padrão
      if (email !== DEFAULT_USER.email) {
        throw new Error("Credenciais inválidas");
      }

      // Verifica a senha
      const isValidPassword = await bcrypt.compare(
        password,
        DEFAULT_PASSWORD_HASH
      );

      if (!isValidPassword) {
        throw new Error("Credenciais inválidas");
      }

      const token = jwt.sign({ userId: DEFAULT_USER.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return { user: DEFAULT_USER, token };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao realizar login");
    }
  },

  async register({ name, email, password, role = "user" }: RegisterData) {
    try {
      // Aqui você deve implementar a lógica de criação do usuário no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10);

      // Define as permissões baseadas no papel do usuário
      const permissions =
        role === "admin" ? DEFAULT_USER.permissions : ["visualizar_relatorios"];

      const user: User = {
        id: crypto.randomUUID(),
        name,
        email,
        role,
        permissions,
      };

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return { user, token };
    } catch (error) {
      throw new Error("Erro ao registrar usuário");
    }
  },

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Token inválido");
    }
  },
};
