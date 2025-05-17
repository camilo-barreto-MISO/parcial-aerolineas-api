import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateAerolineaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFundacion: string; // se recibe como string en formato ISO

  @IsUrl()
  paginaWeb: string;
}
