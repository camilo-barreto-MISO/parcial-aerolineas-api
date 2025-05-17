import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAeropuertoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @Length(3, 3, { message: 'El código debe tener exactamente 3 caracteres' })
  codigo: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;
}