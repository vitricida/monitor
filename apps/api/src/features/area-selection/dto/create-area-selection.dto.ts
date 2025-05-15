import { IsArray, ArrayMinSize, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidCoordinatesConstraint } from '../validators/valid-coordinates.validator';

export class CreateAreaSelectionDto {
  @ApiProperty({
    description:
      'Array of coordinates in format [[lat, lng], [lat, lng], ...] (minimum 3 points)',
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'number',
      },
      minItems: 2,
      maxItems: 2,
    },
    example: [
      [40.7128, -74.006],
      [40.7589, -73.9851],
      [40.7484, -73.9857],
    ],
  })
  @IsArray()
  @ArrayMinSize(3)
  @Validate(ValidCoordinatesConstraint)
  coordinates: [number, number][];
}
