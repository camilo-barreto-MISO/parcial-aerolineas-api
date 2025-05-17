import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Aerolinea } from '../aerolinea/entities/aerolinea';
import { Aeropuerto } from '../aeropuerto/entities/aeropuerto';
import { NotFoundException } from '@nestjs/common';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;

  const mockAerolineaRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockAeropuertoRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaAeropuertoService,
        {
          provide: getRepositoryToken(Aerolinea),
          useValue: mockAerolineaRepo,
        },
        {
          provide: getRepositoryToken(Aeropuerto),
          useValue: mockAeropuertoRepo,
        },
      ],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
  });

  afterEach(() => jest.clearAllMocks());


  describe('addAirportToAirline', () => {
    it('debería asociar un aeropuerto a una aerolínea', async () => {
      const aerolinea = { id: 1, aeropuertos: [] };
      const aeropuerto = { id: 10 };

      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);
      mockAeropuertoRepo.findOneBy.mockResolvedValue(aeropuerto);
      mockAerolineaRepo.save.mockResolvedValue({ ...aerolinea, aeropuertos: [aeropuerto] });

      const result = await service.addAirportToAirline(1, 10);

      expect(result.aeropuertos).toContain(aeropuerto);
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockAerolineaRepo.findOne.mockResolvedValue(null);

      await expect(service.addAirportToAirline(1, 10)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si el aeropuerto no existe', async () => {
      mockAerolineaRepo.findOne.mockResolvedValue({ id: 1, aeropuertos: [] });
      mockAeropuertoRepo.findOneBy.mockResolvedValue(null);

      await expect(service.addAirportToAirline(1, 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportsFromAirline', () => {
    it('debería retornar todos los aeropuertos de una aerolínea', async () => {
      const aerolinea = { id: 1, aeropuertos: [{ id: 10 }, { id: 11 }] };
      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);

      const result = await service.findAirportsFromAirline(1);
      expect(result).toEqual(aerolinea.aeropuertos);
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockAerolineaRepo.findOne.mockResolvedValue(null);
      await expect(service.findAirportsFromAirline(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportFromAirline', () => {
    it('debería retornar un aeropuerto asociado a la aerolínea', async () => {
      const aeropuerto = { id: 10 };
      const aerolinea = { id: 1, aeropuertos: [aeropuerto] };
      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);

      const result = await service.findAirportFromAirline(1, 10);
      expect(result).toEqual(aeropuerto);
    });

    it('debería lanzar error si el aeropuerto no está asociado', async () => {
      const aerolinea = { id: 1, aeropuertos: [] };
      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);

      await expect(service.findAirportFromAirline(1, 10)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockAerolineaRepo.findOne.mockResolvedValue(null);
      await expect(service.findAirportFromAirline(1, 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('debería actualizar los aeropuertos de una aerolínea', async () => {
      const aerolinea = { id: 1, aeropuertos: [] };
      const aeropuerto = { id: 10 };

      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);
      mockAeropuertoRepo.findOneBy.mockResolvedValue(aeropuerto);
      mockAerolineaRepo.save.mockResolvedValue({ ...aerolinea, aeropuertos: [aeropuerto] });

      const result = await service.updateAirportsFromAirline(1, [10]);
      expect(result.aeropuertos).toEqual([aeropuerto]);
    });

    it('debería lanzar error si algún aeropuerto no existe', async () => {
      const aerolinea = { id: 1, aeropuertos: [] };
      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);
      mockAeropuertoRepo.findOneBy.mockResolvedValue(null);

      await expect(service.updateAirportsFromAirline(1, [99])).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockAerolineaRepo.findOne.mockResolvedValue(null);
      await expect(service.updateAirportsFromAirline(1, [10])).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('debería eliminar un aeropuerto asociado a la aerolínea', async () => {
      const aeropuerto = { id: 10 };
      const aerolinea = { id: 1, aeropuertos: [aeropuerto] };

      mockAerolineaRepo.findOne.mockResolvedValue(aerolinea);
      mockAerolineaRepo.save.mockResolvedValue({ ...aerolinea, aeropuertos: [] });

      await service.deleteAirportFromAirline(1, 10);

      expect(mockAerolineaRepo.save).toHaveBeenCalledWith({ ...aerolinea, aeropuertos: [] });
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockAerolineaRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteAirportFromAirline(1, 10)).rejects.toThrow(NotFoundException);
    });
  });

});