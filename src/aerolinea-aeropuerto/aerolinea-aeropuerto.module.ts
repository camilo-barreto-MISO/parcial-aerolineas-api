import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from '../aerolinea/entities/aerolinea';
import { Aeropuerto } from '../aeropuerto/entities/aeropuerto';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaModule } from '../aerolinea/aerolinea.module';
import { AeropuertoModule } from '../aeropuerto/aeropuerto.module';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aerolinea, Aeropuerto]),
    AerolineaModule,
    AeropuertoModule,
  ],
  providers: [AerolineaAeropuertoService],
  controllers: [AerolineaAeropuertoController],
})
export class AerolineaAeropuertoModule {}