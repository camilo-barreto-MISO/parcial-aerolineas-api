import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Aeropuerto } from './entities/aeropuerto';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AeropuertoService', () => {
  let service: AeropuertoService;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoService,
        {
          provide: getRepositoryToken(Aeropuerto),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar todos los aeropuertos', async () => {
      const aeropuertos = [{ id: 1, nombre: 'ElDorado' }];
      mockRepo.find.mockResolvedValue(aeropuertos);

      const result = await service.findAll();

      expect(mockRepo.find).toHaveBeenCalledWith({ relations: ['aerolineas'] });
      expect(result).toEqual(aeropuertos);
    });
  });

  describe('findOne', () => {
    it('debería retornar un aeropuerto existente', async () => {
      const aeropuerto = { id: 1, nombre: 'EZE' };
      mockRepo.findOne.mockResolvedValue(aeropuerto);

      const result = await service.findOne(1);

      expect(result).toEqual(aeropuerto);
    });

    it('debería lanzar error si el aeropuerto no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debería crear un aeropuerto válido', async () => {
      const dto = { nombre: 'EZE', codigo: 'EZE', pais: 'Argentina', ciudad: 'Buenos Aires' };
      const created = { id: 1, ...dto };

      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });

    it('debería lanzar error si el código no tiene 3 caracteres', async () => {
      const dto = { nombre: 'EZE', codigo: 'E', pais: 'Argentina', ciudad: 'Buenos Aires' };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería actualizar un aeropuerto válido', async () => {
      const aeropuerto = { id: 1, nombre: 'Old', codigo: 'ABC', pais: 'X', ciudad: 'Y' };
      const dto = { nombre: 'NewName' };

      mockRepo.findOne.mockResolvedValue(aeropuerto);
      mockRepo.save.mockResolvedValue({ ...aeropuerto, ...dto });

      const result = await service.update(1, dto);

      expect(result.nombre).toBe('NewName');
    });

    it('debería lanzar error si el código tiene más o menos de 3 letras', async () => {
      const aeropuerto = { id: 1, nombre: 'Old', codigo: 'ABC', pais: 'X', ciudad: 'Y' };
      mockRepo.findOne.mockResolvedValue(aeropuerto);

      await expect(service.update(1, { codigo: 'TOOLONG' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un aeropuerto existente', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('debería lanzar error si el aeropuerto no existe', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

});