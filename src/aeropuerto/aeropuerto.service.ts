import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aeropuerto } from './entities/aeropuerto';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepo: Repository<Aeropuerto>,
  ) {}

  findAll(): Promise<Aeropuerto[]> {
    return this.aeropuertoRepo.find({ relations: ['aerolineas'] });
  }

  async findOne(id: number): Promise<Aeropuerto> {
    const aeropuerto = await this.aeropuertoRepo.findOne({
      where: { id },
      relations: ['aerolineas'],
    });
    if (!aeropuerto) throw new NotFoundException('Aeropuerto no encontrado');
    return aeropuerto;
  }

  async create(dto: CreateAeropuertoDto): Promise<Aeropuerto> {
    if (dto.codigo.length !== 3) {
      throw new BadRequestException('El código debe tener exactamente 3 caracteres');
    }

    const aeropuerto = this.aeropuertoRepo.create(dto);
    return this.aeropuertoRepo.save(aeropuerto);
  }

  async update(id: number, dto: UpdateAeropuertoDto): Promise<Aeropuerto> {
    const aeropuerto = await this.findOne(id);

    if (dto.codigo && dto.codigo.length !== 3) {
      throw new BadRequestException('El código debe tener exactamente 3 caracteres');
    }

    Object.assign(aeropuerto, dto);
    return this.aeropuertoRepo.save(aeropuerto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.aeropuertoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Aeropuerto no encontrado');
    }
  }
}
