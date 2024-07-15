import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficultyFormatterPipe',
  standalone: true
})
export class DifficultyFormatterPipePipe implements PipeTransform {

  transform(value: number): string {
    const filledLine = '█'; // Represents a filled line
    const emptyLine = '░'; // Represents an empty line
    const maxLevel = 5;

    if (value < 1 || value > maxLevel) {
      return 'Invalid level';
    }

    let result = '';
    for (let i = 1; i <= maxLevel; i++) {
      result += i <= value ? filledLine : emptyLine;
    }

    return result;
  }

}
