import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './entities/aerolinea';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aerolinea])],
  providers: [AerolineaService],
  exports: [AerolineaService],
  controllers: [AerolineaController], 
})
export class AerolineaModule {}
