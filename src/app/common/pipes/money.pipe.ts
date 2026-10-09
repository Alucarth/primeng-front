import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(value: any, digitInfo: string = '1.2-2'): string {
    if (value == null || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return '';
    const [minFrac, maxFrac] = this.parseFraction(digitInfo);
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: minFrac,
      maximumFractionDigits: maxFrac,
      useGrouping: true,
    }).format(num);
  }

  private parseFraction(digitInfo: string): [number, number] {
    const frac = digitInfo.split('.')[1];
    if (!frac) return [0, 0];
    const [min = 2, max = 2] = frac.split('-').map((part) => parseInt(part, 10));
    return [min, max === undefined ? min : max];
  }
}
