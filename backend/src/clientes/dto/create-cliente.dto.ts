import { IsString, IsEmail, IsPhoneNumber, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEnderecoDto } from './create-endereco.dto';

export class CreateClienteDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('BR')
  telefone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  whatsapp?: string;

  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco: CreateEnderecoDto;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
} 