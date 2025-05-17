import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from '../aerolinea/entities/aerolinea';
import { Aeropuerto } from '../aeropuerto/entities/aeropuerto';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaModule } from '../aerolinea/aerolinea.module';
import { AeropuertoModule } from '../aeropuerto/aeropuerto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aerolinea, Aeropuerto]),
    AerolineaModule,
    AeropuertoModule,
  ],
  providers: [AerolineaAeropuertoService],
})
export class AerolineaAeropuertoModule {}