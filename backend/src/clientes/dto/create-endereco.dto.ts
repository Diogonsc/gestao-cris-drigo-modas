import { IsString, IsOptional } from 'class-validator';

export class CreateEnderecoDto {
  @IsString()
  cep: string;

  @IsString()
  logradouro: string;

  @IsString()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;
} 