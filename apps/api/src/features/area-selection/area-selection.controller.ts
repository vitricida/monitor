import { Controller, Post, Body } from '@nestjs/common';
import { AreaSelectionService } from './area-selection.service';
import { CreateAreaSelectionDto } from './dto/create-area-selection.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Area Selection')
@Controller('area-selection')
export class AreaSelectionController {
  constructor(private readonly areaSelectionService: AreaSelectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area selection' })
  @ApiResponse({
    status: 201,
    description: 'The area selection has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid coordinates provided.',
  })
  create(
    @Body() createAreaSelectionDto: CreateAreaSelectionDto,
  ): Promise<void> {
    return this.areaSelectionService.create(createAreaSelectionDto);
  }
}
