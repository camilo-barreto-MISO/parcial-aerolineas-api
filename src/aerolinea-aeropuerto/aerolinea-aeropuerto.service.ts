import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from '../aerolinea/entities/aerolinea';
import { Aeropuerto } from '../aeropuerto/entities/aeropuerto';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepo: Repository<Aerolinea>,

    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepo: Repository<Aeropuerto>,
  ) {}

  async addAirportToAirline(aerolineaId: number, aeropuertoId: number): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuerto = await this.aeropuertoRepo.findOneBy({ id: aeropuertoId });
    if (!aeropuerto) throw new NotFoundException('Aeropuerto no encontrado');

    aerolinea.aeropuertos.push(aeropuerto);
    return this.aerolineaRepo.save(aerolinea);
  }

  async findAirportsFromAirline(aerolineaId: number): Promise<Aeropuerto[]> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');
    return aerolinea.aeropuertos;
  }

  async findAirportFromAirline(aerolineaId: number, aeropuertoId: number): Promise<Aeropuerto> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuerto = aerolinea.aeropuertos.find(a => a.id === aeropuertoId);
    if (!aeropuerto) throw new NotFoundException('Aeropuerto no está asociado a esta aerolínea');

    return aeropuerto;
  }

  async updateAirportsFromAirline(aerolineaId: number, aeropuertoIds: number[]): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuertos: Aeropuerto[] = [];

    for (const id of aeropuertoIds) {
      const aeropuerto = await this.aeropuertoRepo.findOneBy({ id });
      if (!aeropuerto) throw new NotFoundException(`Aeropuerto con id ${id} no existe`);
      aeropuertos.push(aeropuerto);
    }

    aerolinea.aeropuertos = aeropuertos;
    return this.aerolineaRepo.save(aerolinea);
  }

  async deleteAirportFromAirline(aerolineaId: number, aeropuertoId: number): Promise<void> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(a => a.id !== aeropuertoId);
    await this.aerolineaRepo.save(aerolinea);
  }
}
