import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('properties')
// GIN indexes using pg_trgm for partial matching
@Index('IDX_PROPERTIES_NORMALIZED_ADDRESS_TRGM', ['normalizedAddress']) // Note: actual gin_trgm_ops will be applied in migration
@Index('IDX_PROPERTIES_STREET_NAME_TRGM', ['streetName'])
@Index('IDX_PROPERTIES_CITY_TRGM', ['city'])
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'int', nullable: true })
  houseNumber: number | null;

  @Column({ type: 'varchar', length: 255 })
  streetName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  streetSuffix: string | null;

  @Index()
  @Column({ type: 'varchar', length: 500 })
  fullAddress: string;

  @Column({ type: 'varchar', length: 500 })
  normalizedAddress: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  county: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
