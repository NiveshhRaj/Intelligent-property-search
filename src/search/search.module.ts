import { Module } from '@nestjs/common';
import { AddressParserService } from './parser/address-parser.service';
import { AddressNormalizerService } from './normalizer/address-normalizer.service';
import { SearchController } from './controller/search.controller';
import { SearchService } from './service/search.service';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [PropertiesModule],
  controllers: [SearchController],
  providers: [AddressParserService, AddressNormalizerService, SearchService],
  exports: [AddressParserService, AddressNormalizerService],
})
export class SearchModule {}
