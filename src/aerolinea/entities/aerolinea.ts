import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Aeropuerto } from '../../aeropuerto/entities/aeropuerto';
import { JoinTable } from 'typeorm';

@Entity()
export class Aerolinea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'date' })
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => Aeropuerto, aeropuerto => aeropuerto.aerolineas, {
    cascade: true,
  })
  @JoinTable()
  aeropuertos: Aeropuerto[];
}