import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './entities/aerolinea';
import { AerolineaService } from './aerolinea.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aerolinea])],
  providers: [AerolineaService],
  exports: [AerolineaService], 
})
export class AerolineaModule {}
