import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: createProdutoDto,
    });
  }

  async findAll() {
    return this.prisma.produto.findMany({
      where: {
        ativo: true,
      },
    });
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
    });
  }

  async remove(id: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return this.prisma.produto.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async getProdutosComEstoqueBaixo() {
    return this.prisma.produto.findMany({
      where: {
        ativo: true,
        estoque: {
          lte: this.prisma.produto.fields.estoqueMinimo,
        },
      },
    });
  }

  async registrarEntradaEstoque(id: string, quantidade: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return this.prisma.produto.update({
      where: { id },
      data: {
        estoque: produto.estoque + quantidade,
      },
    });
  }

  async registrarSaidaEstoque(id: string, quantidade: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    if (produto.estoque < quantidade) {
      throw new Error('Quantidade insuficiente em estoque');
    }

    return this.prisma.produto.update({
      where: { id },
      data: {
        estoque: produto.estoque - quantidade,
      },
    });
  }
} 