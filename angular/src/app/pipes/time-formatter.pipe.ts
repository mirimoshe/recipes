import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormatter',
  standalone: true
})
export class TimeFormatterPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (value === undefined || value < 0) {
      return 'Invalid time';
    }

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    let formattedTime = '';
    if (hours > 0) {
      formattedTime += `${hours}H `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}M`;
    }

    return formattedTime.trim() || '0M';
  }

}
