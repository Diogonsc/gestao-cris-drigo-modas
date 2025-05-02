import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsString()
  sku: string;

  @IsNumber()
  preco: number;

  @IsNumber()
  estoque: number;

  @IsNumber()
  estoqueMinimo: number;

  @IsString()
  categoria: string;

  @IsString()
  @IsOptional()
  fornecedor?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
} 