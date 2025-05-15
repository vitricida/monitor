import { Injectable, Logger } from '@nestjs/common';
import { CreateAreaSelectionDto } from './dto/create-area-selection.dto';

@Injectable()
export class AreaSelectionService {
  private readonly logger = new Logger(AreaSelectionService.name);

  async create(createAreaSelectionDto: CreateAreaSelectionDto): Promise<void> {
    this.logger.log('Received area selection:');
    this.logger.log(
      `Coordinates: ${JSON.stringify(createAreaSelectionDto.coordinates)}`,
    );
  }
}
