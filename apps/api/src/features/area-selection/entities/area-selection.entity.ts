import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

interface GeoJsonPoint {
  lat: number;
  lng: number;
}

interface GeoJsonPolygon {
  coordinates: GeoJsonPoint[];
}

@Entity('area_selections')
export class AreaSelection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  geometry: GeoJsonPolygon;

  @Column('float')
  area: number;

  @Column('float')
  centroidLat: number;

  @Column('float')
  centroidLng: number;

  @CreateDateColumn()
  createdAt: Date;
}
