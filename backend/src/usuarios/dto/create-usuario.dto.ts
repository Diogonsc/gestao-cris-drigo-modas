import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Funcao } from '@prisma/client';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  nome: string;

  @ApiProperty({ example: 'joao@exemplo.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @ApiProperty({ enum: Funcao, example: Funcao.VENDEDOR })
  @IsEnum(Funcao)
  funcao: Funcao;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  ativo?: boolean;
} 