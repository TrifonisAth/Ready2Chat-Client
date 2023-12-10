import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import localeEl from '@angular/common/locales/el';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  // get greek locale
  lc = navigator.language.split('-')[0];
  transform(value: any): any {
    const datePipe = new DatePipe(this.lc);
    const currentDate = new Date();
    const messageDate = new Date(value);

    const hoursDiff =
      Math.abs(currentDate.getTime() - messageDate.getTime()) / 60 / 60 / 1000;
    if (hoursDiff < 24) {
      return datePipe.transform(value, 'shortTime');
    } else if (hoursDiff < 48) {
      return 'Yesterday';
    } else {
      return datePipe.transform(value, 'shortDate');
    }
  }
}
