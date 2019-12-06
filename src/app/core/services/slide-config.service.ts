import {Injectable} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class SlideConfigService {

  slideConfigs = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    arrows: false
  };

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  getDefaultConfig() {
    return this.slideConfigs;
  }
}
