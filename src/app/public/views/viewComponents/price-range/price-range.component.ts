import {Component} from '@angular/core';
import {LabelType, Options} from 'ng5-slider';
import {Router} from '@angular/router';

@Component({
  selector: 'tlims-price-range',
  templateUrl: './price-range.component.html',
  styleUrls: ['./price-range.component.scss']
})
export class PriceRangeComponent {

  url: string;
  minValue: number;
  maxValue: number;
  showBtn = false;
  amount: string;

  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      if (!value) {
        value = 0;
      }
      switch (label) {
        case LabelType.Low:
          return '<b>Min:</b> ₦' + value;
        case LabelType.High:
          return '<b>Max:</b> ₦' + value;
      }
    }
  };

  constructor(private router: Router) {
    this.url = router.url.split('?')[0];
  }

  go() {
    if (this.minValue && this.maxValue) {
      this.amount = this.minValue + '-' + this.maxValue;
    }
    if (!this.minValue && this.maxValue) {
      this.minValue = 0;
      this.amount = this.minValue + '-' + this.maxValue;
    }
    if (this.minValue && !this.maxValue) {
      this.amount = String(this.minValue);
    }
    this.router.navigate([this.url], {queryParams: {price: this.amount}, queryParamsHandling: 'merge'});
  }

}
