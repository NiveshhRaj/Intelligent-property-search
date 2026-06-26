import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';

import { PropertyRepository } from './repositories/property.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  providers: [PropertyRepository],
  exports: [PropertyRepository],
})
export class PropertiesModule {}
