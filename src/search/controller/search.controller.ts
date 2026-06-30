import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
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

    // Exact Match
    if (exactMatch) {
      return {
        success: true,
        exactMatch: true,
        message: 'Exact match found.',
        count: results.length,
        data: results,
      };
    }

    // No Match At All
    if (results.length === 0) {
      return {
        success: true,
        exactMatch: false,
        message: 'No matching properties found.',
        count: 0,
        suggestions: [],
      };
    }

    // Best Ranked Match
    const bestMatch = results[0];

    // Top 5 Suggestions
    const suggestions = results
      .slice(0, 5)
      .map((property) => property.fullAddress);

    return {
      success: true,
      exactMatch: false,
      message: 'No exact match found. Showing the closest matching property.',
      count: 1,
      data: [bestMatch],
      Did_You_Mean: suggestions,
    };
  }
}