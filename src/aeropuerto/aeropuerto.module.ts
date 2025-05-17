import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aeropuerto } from './entities/aeropuerto';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aeropuerto])],
  providers: [AeropuertoService],
  exports: [AeropuertoService],
  controllers: [AeropuertoController],
})
export class AeropuertoModule {}
