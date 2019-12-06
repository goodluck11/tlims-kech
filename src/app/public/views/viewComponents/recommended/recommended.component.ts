import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {SlideConfigService} from 'core/services/slide-config.service';

@Component({
  selector: 'tlims-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss']
})
export class RecommendedComponent implements OnInit {

  images = [
    {
      text: 'Everfresh Flowers',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/1.jpg'
    },
    {
      text: 'Festive Deer',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/2.jpg'
    },
    {
      text: 'Morning Greens',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/3.jpg'
    },
    {
      text: 'Bunch of Love',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/4.jpg'
    },
    {
      text: 'Blue Clear',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/5.jpg'
    }
  ];

  slideConfigs: any;

  constructor(private breakpointObserver: BreakpointObserver,
              private slideConfigService: SlideConfigService) { }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        const defaultVal = this.slideConfigService.getDefaultConfig();
        if (state.breakpoints['(max-width: 599.99px) and (orientation: portrait)']) {
          defaultVal.slidesToShow = 1;
        }
        if (state.breakpoints['(min-width: 600px) and (max-width: 959.99px)']) {
          defaultVal.slidesToShow = 2;
        }
        this.slideConfigs = defaultVal;
      });
  }

}
