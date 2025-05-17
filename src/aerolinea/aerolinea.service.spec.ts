import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Aerolinea } from './entities/aerolinea';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repo: Repository<Aerolinea>;

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
        AerolineaService,
        {
          provide: getRepositoryToken(Aerolinea),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repo = module.get(getRepositoryToken(Aerolinea));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('debería crear una aerolínea con una fecha válida', async () => {
      const dto = {
        nombre: 'AeroTest',
        descripcion: 'Una aerolínea de prueba',
        fechaFundacion: '2000-01-01',
        paginaWeb: 'https://aerotest.com',
      };

      const created = { id: 1, ...dto };

      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });

    it('debería lanzar error si la fecha de fundación es en el futuro', async () => {
      const dto = {
        nombre: 'Futura',
        descripcion: 'Empresa de ciencia ficción',
        fechaFundacion: '2999-01-01',
        paginaWeb: 'https://futura.com',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar un arreglo de aerolíneas', async () => {
      const aerolineas = [{ id: 1, nombre: 'A', aeropuertos: [] }];
      mockRepo.find.mockResolvedValue(aerolineas);

      const result = await service.findAll();

      expect(mockRepo.find).toHaveBeenCalledWith({ relations: ['aeropuertos'] });
      expect(result).toEqual(aerolineas);
    });
  });

  describe('findOne', () => {
    it('debería retornar una aerolínea existente', async () => {
      const aerolinea = { id: 1, nombre: 'Aero1', aeropuertos: [] };
      mockRepo.findOne.mockResolvedValue(aerolinea);

      const result = await service.findOne(1);

      expect(result).toEqual(aerolinea);
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una aerolínea existente', async () => {
      const original = { id: 1, nombre: 'Old', aeropuertos: [] };
      const dto = { nombre: 'Updated' };

      mockRepo.findOne.mockResolvedValue(original);
      mockRepo.save.mockResolvedValue({ ...original, ...dto });

      const result = await service.update(1, dto);

      expect(result.nombre).toBe('Updated');
    });

    it('debería lanzar error si la fechaFundacion es futura', async () => {
      const aerolinea = { id: 1, nombre: 'Test', aeropuertos: [] };
      mockRepo.findOne.mockResolvedValue(aerolinea);

      await expect(service.update(1, { fechaFundacion: '2999-01-01' }))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una aerolínea existente', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error si la aerolínea no existe', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

});
