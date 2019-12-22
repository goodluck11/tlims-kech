import {Injectable} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';

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

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    margin: 10,
    rewind: true,
    autoplay: true,
    navText: [ '<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>' ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  };

  constructor() {
  }

  getDefaultConfig() {
    return this.slideConfigs;
  }

  getConfig() {
    return this.customOptions;
  }
}
