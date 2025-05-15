import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validCoordinates', async: false })
export class ValidCoordinatesConstraint
  implements ValidatorConstraintInterface
{
  validate(coordinates: [number, number][]): boolean {
    if (!Array.isArray(coordinates)) return false;
    return coordinates.every(([lat, lng]) => {
      if (typeof lat !== 'number' || typeof lng !== 'number') return false;
      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    });
  }

  defaultMessage(): string {
    return 'Each coordinate must have valid latitude (-90 to 90) and longitude (-180 to 180) values';
  }
}
