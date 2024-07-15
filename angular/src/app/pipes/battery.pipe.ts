import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'battery',
  standalone: true
})
export class BatteryPipe implements PipeTransform {

  // transform(value: number): string {
  //   if (value < 1 || value > 5) {
  //     return '';
  //   }

  //   let filledLines = value;
  //   let outlineLines = 5 - filledLines;

  //   let battery = '';

  //   for (let i = 0; i < filledLines; i++) {
  //     battery += '█'; // filled line
  //   }

  //   for (let i = 0; i < outlineLines; i++) {
  //     battery += '░'; // outline line
  //   }

  //   return battery;
  // }
  transform(value: number): number[] {
    if (value < 1 || value > 5) {
      return [];
    }

    const filledLines = value;
    const outlineLines = 5 - filledLines;

    return new Array(filledLines).fill(1).concat(new Array(outlineLines).fill(0));
  }

}
