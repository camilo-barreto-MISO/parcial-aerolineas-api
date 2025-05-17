import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './aerolinea/entities/aerolinea';
import { Aeropuerto } from './aeropuerto/entities/aeropuerto';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'airlines',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AerolineaModule,
    AeropuertoModule,
    TypeOrmModule.forFeature([Aerolinea, Aeropuerto]),
    AerolineaAeropuertoModule,
  ],
})
export class AppModule {}
