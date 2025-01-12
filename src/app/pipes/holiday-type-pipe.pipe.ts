import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'holidayTypePipe'
})
export class HolidayTypePipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch (value) {
      case 'BankHoliday':
        return 'Bank';
      case 'SchoolVacation':
        return 'School';
      case 'NationalHoliday':
        return 'National';
      case 'ReligiousHoliday':
        return 'Religious';
      case 'Other':
        return 'Other';
      default:
        return "INVALID"
    }
  }
}
