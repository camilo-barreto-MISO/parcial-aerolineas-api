import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from './entities/aerolinea';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepo: Repository<Aerolinea>,
  ) {}

  findAll(): Promise<Aerolinea[]> {
    return this.aerolineaRepo.find({ relations: ['aeropuertos'] });
  }

  async findOne(id: number): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');
    return aerolinea;
  }

  async create(dto: CreateAerolineaDto): Promise<Aerolinea> {
    const fechaFundacion = new Date(dto.fechaFundacion);
    if (fechaFundacion >= new Date())
      throw new BadRequestException('La fecha de fundación debe ser en el pasado');

    const aerolinea = this.aerolineaRepo.create(dto);
    return this.aerolineaRepo.save(aerolinea);
  }

  async update(id: number, dto: UpdateAerolineaDto): Promise<Aerolinea> {
    const aerolinea = await this.findOne(id);

    if (dto.fechaFundacion && new Date(dto.fechaFundacion) >= new Date())
      throw new BadRequestException('La fecha de fundación debe ser en el pasado');

    Object.assign(aerolinea, dto);
    return this.aerolineaRepo.save(aerolinea);
  }

  async remove(id: number): Promise<void> {
    const result = await this.aerolineaRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Aerolínea no encontrada');
  }
}
