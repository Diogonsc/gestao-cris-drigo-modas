import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);
    if (usuario && await bcrypt.compare(senha, usuario.senha)) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(email: string, senha: string) {
    const usuario = await this.validateUser(email, senha);
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = { 
      sub: usuario.id,
      email: usuario.email,
      funcao: usuario.funcao 
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        funcao: usuario.funcao
      }
    };
  }
} 