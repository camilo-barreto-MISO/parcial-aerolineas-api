import {
  Controller,
  Param,
  Post,
  Get,
  Put,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('airlines/:id/airports')
export class AerolineaAeropuertoController {
  constructor(private readonly service: AerolineaAeropuertoService) {}

  @Post(':airportId')
  addAirportToAirline(
    @Param('id', ParseIntPipe) id: number,
    @Param('airportId', ParseIntPipe) airportId: number,
  ) {
    return this.service.addAirportToAirline(id, airportId);
  }

  @Get()
  findAirportsFromAirline(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAirportsFromAirline(id);
  }

  @Get(':airportId')
  findAirportFromAirline(
    @Param('id', ParseIntPipe) id: number,
    @Param('airportId', ParseIntPipe) airportId: number,
  ) {
    return this.service.findAirportFromAirline(id, airportId);
  }

  @Put()
  updateAirportsFromAirline(
    @Param('id', ParseIntPipe) id: number,
    @Body() aeropuertoIds: number[],
  ) {
    return this.service.updateAirportsFromAirline(id, aeropuertoIds);
  }

  @Delete(':airportId')
  deleteAirportFromAirline(
    @Param('id', ParseIntPipe) id: number,
    @Param('airportId', ParseIntPipe) airportId: number,
  ) {
    return this.service.deleteAirportFromAirline(id, airportId);
  }
}