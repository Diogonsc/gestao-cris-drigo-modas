import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    const { endereco, ...clienteData } = createClienteDto;

    return this.prisma.cliente.create({
      data: {
        ...clienteData,
        endereco: {
          create: endereco,
        },
      },
      include: {
        endereco: true,
      },
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany({
      include: {
        endereco: true,
      },
    });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        endereco: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const { endereco, ...clienteData } = updateClienteDto;

    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return this.prisma.cliente.update({
      where: { id },
      data: {
        ...clienteData,
        endereco: endereco
          ? {
              update: endereco,
            }
          : undefined,
      },
      include: {
        endereco: true,
      },
    });
  }

  async remove(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return this.prisma.cliente.delete({
      where: { id },
    });
  }
} 