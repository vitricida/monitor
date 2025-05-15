import { Module } from '@nestjs/common';
import { AreaSelectionService } from './area-selection.service';
import { AreaSelectionController } from './area-selection.controller';

@Module({
  controllers: [AreaSelectionController],
  providers: [AreaSelectionService],
})
export class AreaSelectionModule {}
