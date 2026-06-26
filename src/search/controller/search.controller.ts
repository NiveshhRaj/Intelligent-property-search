import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SearchService } from '../service/search.service';
import { SearchAddressDto } from '../dto/search-address.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search for properties by address' })
  @ApiResponse({ status: 200, description: 'Successful search' })
  @ApiQuery({
    name: 'address',
    required: true,
    type: String,
    example: '5515 Washington Avenue',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 5,
  })
  async search(@Query() query: SearchAddressDto) {
    const { exactMatch, results } = await this.searchService.exactSearch(
      query.address,
      query.limit,
    );

    if (exactMatch) {
      return {
        success: true,
        exactMatch: true,
        count: results.length,
        data: results,
      };
    }

    const suggestions = results.map((p) => p.fullAddress);

    return {
      success: true,
      exactMatch: false,
      message: 'No exact match found. Did you mean one of these?',
      count: Math.min(suggestions.length, 5),
      suggestions: suggestions.slice(0, 5),
    };
  }
}
