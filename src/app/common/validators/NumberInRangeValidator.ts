import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


export function numberInRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined) return null;
    if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
      return {outOfRange: {value, min, max}};
    }
    return null;
  };
}
