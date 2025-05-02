import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);
    
    return this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
} 