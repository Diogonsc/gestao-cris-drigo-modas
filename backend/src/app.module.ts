import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProdutosModule } from './produtos/produtos.module';
import { ComprasModule } from './compras/compras.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    ClientesModule,
    ProdutosModule,
    ComprasModule,
    PagamentosModule,
  ],
})
export class AppModule {} 