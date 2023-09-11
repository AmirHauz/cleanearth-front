import { Pipe, PipeTransform } from '@angular/core';
import { TakenCupon } from '../models/taken-cupon';

@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {
  transform(couponItems: TakenCupon[], status: string): TakenCupon[] {
    if (!couponItems || !status) {
      return couponItems;
    }
    return couponItems.filter((item) => item.status === status);
  }
}
