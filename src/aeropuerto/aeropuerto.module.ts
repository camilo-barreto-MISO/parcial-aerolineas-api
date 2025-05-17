import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aeropuerto } from './entities/aeropuerto';
import { AeropuertoService } from './aeropuerto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aeropuerto])],
  providers: [AeropuertoService],
  exports: [AeropuertoService],
})
export class AeropuertoModule {}
